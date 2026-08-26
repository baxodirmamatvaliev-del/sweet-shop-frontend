export function animateToBasket(image: HTMLImageElement | null) {
  const basket = document.querySelector<HTMLElement>(".navbar__basket");

  if (!image || !basket) return;

  const imageRect = image.getBoundingClientRect();
  const basketRect = basket.getBoundingClientRect();
  const flyingImage = image.cloneNode(true) as HTMLImageElement;

  flyingImage.className = "basket-flying-image";
  flyingImage.style.left = `${imageRect.left + imageRect.width / 2 - 38}px`;
  flyingImage.style.top = `${imageRect.top + imageRect.height / 2 - 38}px`;
  document.body.appendChild(flyingImage);

  const moveX = basketRect.left + basketRect.width / 2 - imageRect.left - imageRect.width / 2;
  const moveY = basketRect.top + basketRect.height / 2 - imageRect.top - imageRect.height / 2;

  const animation = flyingImage.animate(
    [
      { transform: "translate(0, 0) scale(1)", opacity: 0.95 },
      { transform: `translate(${moveX * 0.55}px, ${moveY * 0.35}px) scale(0.65)`, opacity: 0.8, offset: 0.55 },
      { transform: `translate(${moveX}px, ${moveY}px) scale(0.15)`, opacity: 0.15 },
    ],
    { duration: 700, easing: "cubic-bezier(.22,.8,.3,1)" },
  );

  animation.onfinish = () => {
    flyingImage.remove();
    basket.classList.remove("navbar__basket--added");
    void basket.offsetWidth;
    basket.classList.add("navbar__basket--added");
    window.setTimeout(() => basket.classList.remove("navbar__basket--added"), 420);
  };
}
