import { useEffect, useRef } from "react";
import Navbar from "./Navbar";

export default function HomeNavbar() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number | null = null;

    const updateBackground = () => {
      const progress = Math.min(Math.max(window.scrollY / 180, 0), 1);
      headerRef.current?.style.setProperty("--header-progress", String(progress));
      frame = null;
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateBackground);
    };

    updateBackground();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="home-header" ref={headerRef}><Navbar /></div>;
}
