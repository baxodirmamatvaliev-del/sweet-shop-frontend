import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatKRW } from "../../../lib/currency";
import {
  CakeOptionType,
  type CakeConfigurationInput,
  type CakeLayerConfiguration,
  type CakeOption,
  type CakeOptionType as CakeOptionTypeValue,
} from "../../../lib/types/cake";
import type { Product } from "../../../lib/types/product";
import Footer from "../../components/footer";
import OtherNavbar from "../../components/headers/OtherNavbar";
import useBasket from "../../hooks/useBasket";
import { getActiveCakeOptions } from "../../services/CakeOptionService";
import { getProduct, getProductImageUrl } from "../../services/ProductService";
import type { AiCakeDesign } from "../../../lib/types/ai-design";
import { getAiDesignImageUrl } from "../../services/AiCakeDesignService";
import AiCakeDesigner from "./AiCakeDesigner";

const requiredOptionTypes: CakeOptionTypeValue[] = [
  CakeOptionType.SIZE,
  CakeOptionType.SPONGE,
  CakeOptionType.FILLING,
  CakeOptionType.CREAM,
  CakeOptionType.FROSTING,
];

const fallbackColors: Record<CakeOptionTypeValue, string[]> = {
  SIZE: ["#d6a66d"],
  SPONGE: ["#e9bd78", "#8a4f32", "#d88787", "#c9a7d8"],
  FILLING: ["#fff1bc", "#d66f77", "#825039", "#f1b5d0"],
  CREAM: ["#fff8e9", "#f3c6cf", "#d9c4a7", "#d5c5eb"],
  FROSTING: ["#f8e5d0", "#c9857b", "#8a5a45", "#b9d8c2"],
  CHOCOLATE: ["#5f3828", "#8a5a3d"],
  FRUIT: ["#cb4452", "#704b9b", "#e99543"],
  DECORATION: ["#d9a441", "#e4bfd7", "#8eb7cf"],
};

const colorFor = (option: CakeOption | undefined, fallbackIndex = 0) => {
  if (option?.previewColor && /^#[0-9a-f]{3,8}$/i.test(option.previewColor)) {
    return option.previewColor;
  }
  const palette = fallbackColors[option?.optionType ?? CakeOptionType.SPONGE];
  return palette[fallbackIndex % palette.length];
};

type OptionPickerProps = {
  legend: string;
  options: CakeOption[];
  selectedIds: string[];
  onToggle: (optionId: string) => void;
  multiple?: boolean;
};

function OptionPicker({
  legend,
  options,
  selectedIds,
  onToggle,
  multiple = false,
}: OptionPickerProps) {
  return (
    <fieldset className="builder-options">
      <legend>{legend}</legend>
      <div className="builder-options__grid">
        {options.map((option, index) => {
          const selected = selectedIds.includes(option._id);
          return (
            <button
              aria-pressed={selected}
              className={selected ? "builder-option builder-option--selected" : "builder-option"}
              key={option._id}
              onClick={() => onToggle(option._id)}
              type="button"
            >
              <span
                className="builder-option__swatch"
                style={{ backgroundColor: colorFor(option, index) }}
              />
              <span>
                <strong>{option.name}</strong>
                {option.description && <small>{option.description}</small>}
              </span>
              <em>{option.priceModifier ? `+${formatKRW(option.priceModifier)}` : "Included"}</em>
              {multiple && <span className="builder-option__check">{selected ? "✓" : "+"}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function CakeBuilderPage() {
  const { productId = "" } = useParams();
  const navigate = useNavigate();
  const { addItem } = useBasket();
  const [product, setProduct] = useState<Product | null>(null);
  const [options, setOptions] = useState<CakeOption[]>([]);
  const [configuration, setConfiguration] = useState<CakeConfigurationInput | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");
  const [selectedAiDesign, setSelectedAiDesign] = useState<AiCakeDesign | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([getProduct(productId), getActiveCakeOptions()])
      .then(([cake, activeOptions]) => {
        if (!active) return;
        if (cake.productCategory.toUpperCase() !== "BIRTHDAY_CAKE") {
          throw new Error("Only birthday cakes can be customized.");
        }

        const byType = (type: CakeOptionTypeValue) =>
          activeOptions.filter((option) => option.optionType === type);
        if (requiredOptionTypes.some((type) => byType(type).length === 0)) {
          throw new Error("Cake customization options are not ready yet.");
        }

        const sponge = byType(CakeOptionType.SPONGE)[0];
        const filling = byType(CakeOptionType.FILLING)[0];
        const size = byType(CakeOptionType.SIZE)[0];
        const cream = byType(CakeOptionType.CREAM)[0];
        const frosting = byType(CakeOptionType.FROSTING)[0];
        if (!sponge || !filling || !size || !cream || !frosting) return;

        setProduct(cake);
        setOptions(activeOptions);
        setConfiguration({
          sizeOptionId: size._id,
          layers: [{ spongeOptionId: sponge._id, fillingOptionId: filling._id }],
          creamOptionId: cream._id,
          frostingOptionId: frosting._id,
          chocolateOptionIds: [],
          fruitOptionIds: [],
          decorationOptionIds: [],
          message: "",
        });
        setStatus("success");
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "Cake builder could not be loaded.");
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [productId]);

  const byType = (type: CakeOptionTypeValue) =>
    options.filter((option) => option.optionType === type);
  const optionById = useMemo(
    () => new Map(options.map((option) => [option._id, option])),
    [options],
  );

  const estimatedPrice = useMemo(() => {
    if (!product || !configuration) return 0;
    const selectedIds = [
      configuration.sizeOptionId,
      configuration.creamOptionId,
      configuration.frostingOptionId,
      ...configuration.layers.flatMap((layer) => [layer.spongeOptionId, layer.fillingOptionId]),
      ...configuration.chocolateOptionIds,
      ...configuration.fruitOptionIds,
      ...configuration.decorationOptionIds,
    ];
    return selectedIds.reduce(
      (total, optionId) => total + (optionById.get(optionId)?.priceModifier ?? 0),
      product.productPrice,
    );
  }, [configuration, optionById, product]);

  const selectSingle = (
    key: "sizeOptionId" | "creamOptionId" | "frostingOptionId",
    optionId: string,
  ) => setConfiguration((current) => current ? { ...current, [key]: optionId } : current);

  const toggleMultiple = (
    key: "chocolateOptionIds" | "fruitOptionIds" | "decorationOptionIds",
    optionId: string,
  ) => setConfiguration((current) => {
    if (!current) return current;
    const selected = current[key];
    return {
      ...current,
      [key]: selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId],
    };
  });

  const changeLayerCount = (count: number) => {
    const defaultSponge = byType(CakeOptionType.SPONGE)[0];
    const defaultFilling = byType(CakeOptionType.FILLING)[0];
    if (!defaultSponge || !defaultFilling) return;
    setConfiguration((current) => {
      if (!current) return current;
      const layers = [...current.layers];
      while (layers.length < count) {
        layers.push({
          spongeOptionId: defaultSponge._id,
          fillingOptionId: defaultFilling._id,
        });
      }
      return { ...current, layers: layers.slice(0, count) };
    });
  };

  const updateLayer = (
    index: number,
    key: keyof CakeLayerConfiguration,
    optionId: string,
  ) => setConfiguration((current) => {
    if (!current) return current;
    return {
      ...current,
      layers: current.layers.map((layer, layerIndex) =>
        layerIndex === index ? { ...layer, [key]: optionId } : layer,
      ),
    };
  });

  const addCustomizedCake = () => {
    if (!product || !configuration) return;
    const size = optionById.get(configuration.sizeOptionId);
    const cream = optionById.get(configuration.creamOptionId);
    const frosting = optionById.get(configuration.frostingOptionId);
    const extrasCount =
      configuration.chocolateOptionIds.length +
      configuration.fruitOptionIds.length +
      configuration.decorationOptionIds.length;
    const added = addItem({
      lineId: `${product._id}:custom:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId: product._id,
      name: `${product.productName} — Custom`,
      image: selectedAiDesign
        ? getAiDesignImageUrl(selectedAiDesign.imageUrl)
        : getProductImageUrl(product.productImage),
      price: estimatedPrice,
      cakeConfiguration: configuration,
      ...(selectedAiDesign ? { aiDesignId: selectedAiDesign._id } : {}),
      customizationSummary: [
        `${size?.name ?? "Custom size"} · ${configuration.layers.length} layer${configuration.layers.length === 1 ? "" : "s"}`,
        `${cream?.name ?? "Cream"} · ${frosting?.name ?? "Frosting"}`,
        extrasCount ? `${extrasCount} decoration option${extrasCount === 1 ? "" : "s"}` : "No extra decorations",
        ...(configuration.message ? [`Message: “${configuration.message}”`] : []),
        ...(selectedAiDesign ? ["AI design concept attached"] : []),
      ],
    });
    if (added) navigate("/basket");
  };

  const previewFrosting = configuration
    ? optionById.get(configuration.frostingOptionId)
    : undefined;
  const previewCream = configuration
    ? optionById.get(configuration.creamOptionId)
    : undefined;
  const sizeIndex = configuration
    ? Math.max(0, byType(CakeOptionType.SIZE).findIndex((option) => option._id === configuration.sizeOptionId))
    : 0;
  const previewStyle = {
    "--preview-frosting": colorFor(previewFrosting),
    "--preview-cream": colorFor(previewCream),
    "--preview-scale": String(0.86 + Math.min(sizeIndex, 3) * 0.07),
  } as CSSProperties;
  const previewToppings = [
    ...configuration?.fruitOptionIds.map((id) => ({ id, type: "fruit" })) ?? [],
    ...configuration?.chocolateOptionIds.map((id) => ({ id, type: "chocolate" })) ?? [],
    ...configuration?.decorationOptionIds.map((id) => ({ id, type: "decoration" })) ?? [],
  ].slice(0, 10);

  return (
    <div className="builder-page">
      <OtherNavbar />
      <main className="builder-main">
        <div className="builder-container">
          <Link className="builder-back" to="/#works">← Back to birthday cakes</Link>

          {status === "loading" && <div className="builder-state">Preparing your cake studio...</div>}
          {status === "error" && (
            <div className="builder-state builder-state--error">
              <h1>Builder unavailable</h1><p>{error}</p>
              <Link className="button button--yellow" to="/">Return home</Link>
            </div>
          )}

          {status === "success" && product && configuration && (
            <>
              <header className="builder-heading">
                <div><p>CAKE STUDIO</p><h1>Build your celebration cake</h1></div>
                <span>Customize every layer. Final pricing is verified at checkout.</span>
              </header>

              <AiCakeDesigner
                onSelect={setSelectedAiDesign}
                selectedDesignId={selectedAiDesign?._id}
              />

              <div className="builder-layout">
                <aside className="builder-preview">
                  <div className="builder-preview__title">
                    <div><small>LIVE PREVIEW</small><strong>{product.productName}</strong></div>
                    <img
                      alt=""
                      src={selectedAiDesign
                        ? getAiDesignImageUrl(selectedAiDesign.imageUrl)
                        : "/img/cake-animation/cake-assembled.png"}
                    />
                  </div>
                  <div className="builder-preview__stage" style={previewStyle}>
                    <div className="builder-cake">
                      <div className="builder-cake__toppings" aria-hidden="true">
                        {previewToppings.map((item, index) => (
                          <i
                            className={`builder-cake__${item.type}`}
                            key={item.id}
                            style={{ "--item-index": index } as CSSProperties}
                          >
                            {item.type === "chocolate" ? "◆" : item.type === "decoration" ? "✦" : ""}
                          </i>
                        ))}
                      </div>
                      {[...configuration.layers].reverse().map((layer, reverseIndex) => {
                        const originalIndex = configuration.layers.length - reverseIndex - 1;
                        const sponge = optionById.get(layer.spongeOptionId);
                        const filling = optionById.get(layer.fillingOptionId);
                        return (
                          <div
                            className="builder-cake__layer"
                            key={originalIndex}
                            style={{
                              "--layer-sponge": colorFor(sponge, originalIndex),
                              "--layer-filling": colorFor(filling, originalIndex),
                            } as CSSProperties}
                          ><span /></div>
                        );
                      })}
                      {configuration.message && <div className="builder-cake__message">{configuration.message}</div>}
                      <div className="builder-cake__board" />
                    </div>
                  </div>
                  <div className="builder-preview__price">
                    <span>Estimated total<small>Backend verifies the final price</small></span>
                    <strong>{formatKRW(estimatedPrice)}</strong>
                  </div>
                  <button className="button button--yellow" onClick={addCustomizedCake} type="button">Add custom cake to basket</button>
                </aside>

                <section className="builder-controls">
                  <div className="builder-step">
                    <div className="builder-step__heading"><span>01</span><div><h2>Size and layers</h2><p>Choose the serving size and cake height.</p></div></div>
                    <OptionPicker legend="Cake size" options={byType(CakeOptionType.SIZE)} selectedIds={[configuration.sizeOptionId]} onToggle={(id) => selectSingle("sizeOptionId", id)} />
                    <fieldset className="builder-layer-count"><legend>Number of layers</legend><div>{[1, 2, 3, 4, 5].map((count) => <button aria-pressed={configuration.layers.length === count} key={count} onClick={() => changeLayerCount(count)} type="button">{count}</button>)}</div></fieldset>
                  </div>

                  <div className="builder-step">
                    <div className="builder-step__heading"><span>02</span><div><h2>Sponge and filling</h2><p>Customize each layer independently.</p></div></div>
                    <div className="builder-layers">
                      {configuration.layers.map((layer, index) => (
                        <article className="builder-layer-control" key={index}>
                          <h3>Layer {index + 1}</h3>
                          <OptionPicker legend="Sponge" options={byType(CakeOptionType.SPONGE)} selectedIds={[layer.spongeOptionId]} onToggle={(id) => updateLayer(index, "spongeOptionId", id)} />
                          <OptionPicker legend="Filling" options={byType(CakeOptionType.FILLING)} selectedIds={[layer.fillingOptionId]} onToggle={(id) => updateLayer(index, "fillingOptionId", id)} />
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="builder-step">
                    <div className="builder-step__heading"><span>03</span><div><h2>Cream and frosting</h2><p>Pick the finish for your cake.</p></div></div>
                    <OptionPicker legend="Cream" options={byType(CakeOptionType.CREAM)} selectedIds={[configuration.creamOptionId]} onToggle={(id) => selectSingle("creamOptionId", id)} />
                    <OptionPicker legend="Frosting" options={byType(CakeOptionType.FROSTING)} selectedIds={[configuration.frostingOptionId]} onToggle={(id) => selectSingle("frostingOptionId", id)} />
                  </div>

                  <div className="builder-step">
                    <div className="builder-step__heading"><span>04</span><div><h2>Finishing touches</h2><p>Add as many extras as you like.</p></div></div>
                    <OptionPicker multiple legend="Chocolate" options={byType(CakeOptionType.CHOCOLATE)} selectedIds={configuration.chocolateOptionIds} onToggle={(id) => toggleMultiple("chocolateOptionIds", id)} />
                    <OptionPicker multiple legend="Fruit" options={byType(CakeOptionType.FRUIT)} selectedIds={configuration.fruitOptionIds} onToggle={(id) => toggleMultiple("fruitOptionIds", id)} />
                    <OptionPicker multiple legend="Decorations" options={byType(CakeOptionType.DECORATION)} selectedIds={configuration.decorationOptionIds} onToggle={(id) => toggleMultiple("decorationOptionIds", id)} />
                  </div>

                  <div className="builder-step">
                    <div className="builder-step__heading"><span>05</span><div><h2>Personal message</h2><p>Add up to 80 characters.</p></div></div>
                    <label className="builder-message" htmlFor="cakeMessage"><span>Cake message</span><input id="cakeMessage" maxLength={80} onChange={(event) => setConfiguration((current) => current ? { ...current, message: event.target.value } : current)} placeholder="Happy birthday!" type="text" value={configuration.message} /><small>{configuration.message.length}/80</small></label>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
