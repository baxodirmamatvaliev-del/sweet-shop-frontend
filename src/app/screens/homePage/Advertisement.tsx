import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

export default function Advertisement() {
  const heroRef = useRef<HTMLElement>(null);
  const maxProgressRef = useRef(0);
  const progressStartRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = heroRef.current;
        if (!hero) return;
        if (resetTimerRef.current !== null) return;
        const nextProgress = Math.min(
          1,
          Math.max(
            0,
            (window.scrollY - progressStartRef.current) /
              (window.innerHeight * 0.48),
          ),
        );
        maxProgressRef.current = Math.max(maxProgressRef.current, nextProgress);
        setProgress(maxProgressRef.current);
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      cancelAnimationFrame(frame);
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const resetCake = () => {
    if (resetTimerRef.current !== null) return;
    setIsResetting(true);
    maxProgressRef.current = 0;
    progressStartRef.current = window.scrollY;
    setProgress(0);
    resetTimerRef.current = window.setTimeout(() => {
      resetTimerRef.current = null;
      setIsResetting(false);
    }, 1200);
  };

  const handleCakeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      resetCake();
    }
  };

  const sceneStyle = { "--cake-progress": progress } as CSSProperties;

  return (
    <section className="hero" id="top" ref={heroRef} style={sceneStyle}>
      <div className="hero__sticky">
        <div className="hero__layout home-container">
          <div className="hero__content">
            <p className="home-kicker home-kicker--dark">HANDCRAFTED SWEETS</p>
            <h1>Sweet moments<br />for every celebration</h1>
            <p className="hero__text">Freshly baked cakes, elegant decoration, and reliable on-time delivery.</p>
            <div className="hero__action">
              <a className="button button--yellow" href="#catalog">View Catalog</a>
              <span>Scroll to discover<br />what is inside</span>
            </div>
          </div>
          <div
            className={`hero-cake${isResetting ? " hero-cake--resetting" : ""}`}
            aria-label="Chocolate berry cake layers. Double click to assemble."
            onDoubleClick={resetCake}
            onKeyDown={handleCakeKeyDown}
            role="button"
            tabIndex={0}
            title="Double click to assemble the cake"
          >
            <img className="hero-cake__assembled" src="/img/cake-animation/cake-assembled.png" alt="Assembled chocolate berry cake" />
            <img className="hero-cake__exploded" src="/img/cake-animation/cake-exploded.png" alt="Separated chocolate cake layers" />
            <div className="hero-cake__labels" aria-hidden="true">
              <span>Berries &amp; chocolate</span>
              <span>Chocolate ganache</span>
              <span>Chocolate sponge</span>
              <span>Vanilla cream</span>
              <span>Golden cake board</span>
            </div>
            <small className="hero-cake__hint">Double click to assemble</small>
          </div>
        </div>
      </div>
    </section>
  );
}
