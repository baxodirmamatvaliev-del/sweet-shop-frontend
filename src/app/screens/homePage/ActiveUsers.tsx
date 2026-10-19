export default function ActiveUsers() {
  return (
    <section className="about home-section" id="our-story">
      <div className="home-container about__inner">
        <div className="about__copy">
          <p className="home-kicker">HELLO, WE’RE MORROW</p>
          <h2>Good mornings.<br />Better coffee breaks.</h2>
          <p className="about__lead">For early starts, slow afternoons, and the moments in between. Morrow is a small invitation to pause and enjoy your favorite cup.</p>
          <ul><li>Classic coffees and smooth, creamy lattes</li><li>A simple menu for your everyday favorites</li><li>From your first sip to your next order</li></ul>
          <a className="button button--yellow" href="#catalog">Find your favorite →</a>
        </div>
        <div className="about__coffee">
          <p>A LITTLE PAUSE.<br /><strong>A MORROW MOMENT.</strong></p>
          <div><img src="/img/morrow-coffee/menu/morrow-a165dd429f5d.webp" alt="Morrow iced Americano" loading="lazy" /><img src="/img/morrow-coffee/menu/morrow-77856bd6361f.webp" alt="Morrow iced latte" loading="lazy" /></div>
        </div>
      </div>
    </section>
  );
}
