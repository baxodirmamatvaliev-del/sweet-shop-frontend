import { useEffect, useState, type FormEvent } from "react";
import type { AiCakeDesign } from "../../../lib/types/ai-design";
import {
  generateAiCakeDesign,
  getAiCakeDesignHistory,
  getAiDesignImageUrl,
} from "../../services/AiCakeDesignService";

type AiCakeDesignerProps = {
  selectedDesignId?: string;
  onSelect: (design: AiCakeDesign | null) => void;
};

export default function AiCakeDesigner({ selectedDesignId, onSelect }: AiCakeDesignerProps) {
  const [prompt, setPrompt] = useState("");
  const [designs, setDesigns] = useState<AiCakeDesign[]>([]);
  const [remaining, setRemaining] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(3);
  const [status, setStatus] = useState<"loading" | "ready" | "generating" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAiCakeDesignHistory()
      .then((history) => {
        if (!active) return;
        setDesigns(history.designs);
        setRemaining(history.remaining);
        setDailyLimit(history.dailyLimit);
        setStatus("ready");
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load AI designs.");
        setStatus("error");
      });
    return () => { active = false; };
  }, []);

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (cleanPrompt.length < 10 || cleanPrompt.length > 500) {
      setError("Describe your cake idea in 10 to 500 characters.");
      return;
    }
    setStatus("generating");
    setError("");
    try {
      const result = await generateAiCakeDesign(cleanPrompt);
      setDesigns((current) => [result.design, ...current].slice(0, 12));
      setRemaining(result.remaining);
      setDailyLimit(result.dailyLimit);
      setPrompt("");
      setStatus("ready");
      onSelect(result.design);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to generate an AI design.");
      setStatus("ready");
    }
  };

  return (
    <section className="ai-designer">
      <div className="ai-designer__intro">
        <div><p>AI CAKE DESIGNER</p><h2>Turn your idea into a visual concept</h2></div>
        <span>{remaining} of {dailyLimit} generations remaining today</span>
      </div>
      <form className="ai-designer__form" onSubmit={handleGenerate}>
        <label htmlFor="aiCakePrompt">Describe colors, theme, decorations and occasion</label>
        <div>
          <textarea disabled={status === "generating" || remaining === 0} id="aiCakePrompt" maxLength={500} minLength={10} onChange={(event) => setPrompt(event.target.value)} placeholder="An elegant two-tier midnight-blue birthday cake with gold stars and white flowers..." required rows={3} value={prompt} />
          <button className="button button--yellow" disabled={status === "generating" || remaining === 0} type="submit">
            {status === "generating" ? "Generating concept..." : remaining === 0 ? "Daily limit reached" : "Generate design"}
          </button>
        </div>
        <small>{prompt.length}/500 · Generation can take up to a minute.</small>
      </form>
      {error && <p className="ai-designer__error" role="alert">{error}</p>}
      {status === "loading" && <p className="ai-designer__loading">Loading your design history...</p>}
      {designs.length > 0 && (
        <div className="ai-designer__history">
          <div className="ai-designer__history-title"><strong>Your concepts</strong><span>Select one to attach to this cake</span></div>
          <div className="ai-designer__grid">
            {designs.map((design) => {
              const selected = selectedDesignId === design._id;
              return (
                <button aria-pressed={selected} className={selected ? "ai-design-card ai-design-card--selected" : "ai-design-card"} key={design._id} onClick={() => onSelect(selected ? null : design)} type="button">
                  <img alt={`AI cake concept: ${design.prompt}`} src={getAiDesignImageUrl(design.imageUrl)} />
                  <span>{design.prompt}</span>
                  <strong>{selected ? "Attached ✓" : "Use concept"}</strong>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <p className="ai-designer__disclaimer">AI-generated inspiration only. Colors, structure and decorations may be adjusted by the bakery for a safe, buildable final cake.</p>
    </section>
  );
}
