const images = [1, 2, 3, 4, 7, 9];

export default function Statistics() {
  return (
    <section className="gallery home-section" id="works">
      <div className="home-container">
        <div className="gallery__heading">
          <div>
            <p className="home-kicker home-kicker--dark">OUR WORK</p>
            <h2>A gallery of sweet moments</h2>
          </div>
          <p>A selection of real orders handcrafted for our wonderful customers.</p>
        </div>
        <div className="gallery__grid">
          {images.map((number) => (
            <img
              key={number}
              src={`/img/past.shirin${number}.png`}
              alt="A custom Sweet Shop order"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
