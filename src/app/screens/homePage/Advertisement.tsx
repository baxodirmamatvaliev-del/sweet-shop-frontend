export default function Advertisement() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <h1 className="hero__title" id="hero-title">Mega Coffee — a latte for today</h1>
      <img
        className="hero__image"
        src="/img/mega-coffee/latte-banner.webp"
        srcSet="/img/mega-coffee/latte-banner-small.webp 960w, /img/mega-coffee/latte-banner.webp 1672w"
        sizes="100vw"
        width="1672"
        height="941"
        alt="Two iced lattes in warm golden sunlight with Korean lettering: a latte for today"
        fetchPriority="high"
      />
      <a className="hero__scroll" href="#catalog">
        <span aria-hidden="true">↓</span>
        Explore the menu
      </a>
    </section>
  );
}
