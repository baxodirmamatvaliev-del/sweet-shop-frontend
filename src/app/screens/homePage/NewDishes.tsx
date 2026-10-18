import { useCallback, useEffect, useRef, useState } from "react";
import MenuFilters from "../../components/MenuFilters";
import { getMenuCategory, type MenuCategory } from "../../../lib/menu";
import { Link } from "react-router-dom";
import useBasket from "../../hooks/useBasket";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getProductImageUrl } from "../../services/ProductService";
import { formatKRW } from "../../../lib/currency";
import { animateToBasket } from "../../../lib/animateToBasket";
import {
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "../productsPage/selector";
import { fetchProducts } from "../productsPage/slice";

export default function NewDishes() {
  const [category, setCategory] = useState<MenuCategory>("All");
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ back: false, forward: false });
  const { addItem } = useBasket();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const newestProducts = products
    .filter(
      (product) =>
        product.productCategory.toUpperCase() !== "BIRTHDAY_CAKE" &&
        (category === "All" || getMenuCategory(product.productCategory) === category),
    )
    .slice(-6);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScroll({
      back: track.scrollLeft > 1,
      forward: track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateControls);
    observer.observe(track);
    return () => observer.disconnect();
  }, [category, newestProducts.length, updateControls]);

  const slide = (direction: number) => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !card) return;
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className="catalog home-section" id="catalog">
      <div className="home-container">
        <div className="section-heading">
          <div>
            <p className="home-kicker">OUR MENU</p>
            <h2>
              Find your
              <br />
              next favorite
            </h2>
          </div>
          <p>
            Explore our latest products, choose your favorites, and add them
            straight to your basket.
          </p>
        </div>
        <MenuFilters selected={category} onChange={setCategory} />
        {status === "loading" && (
          <p className="catalog__message">Loading fresh products...</p>
        )}
        {status === "failed" && (
          <div className="catalog__message catalog__message--error">
            <span>{error}</span>
            <button onClick={() => dispatch(fetchProducts())} type="button">
              Try again
            </button>
          </div>
        )}
        {status === "succeeded" && newestProducts.length === 0 && (
          <p className="catalog__message">No products in this category yet.</p>
        )}
        {newestProducts.length > 0 && (
          <div
            className="product-carousel"
            key={category}
            id="home-products"
            ref={trackRef}
            onScroll={updateControls}
            role="region"
            aria-label="Latest products"
            tabIndex={0}
          >
            {newestProducts.map((product) => {
              const image = getProductImageUrl(product.productImage);
              const price = product.productPrice;

              return (
                <article className="product-card" key={product._id}>
                  <div className="product-card__media">
                    <img src={image} alt={product.productName} loading="lazy" />
                    <span>{getMenuCategory(product.productCategory)}</span>
                  </div>
                  <div className="product-card__body">
                    <h3>{product.productName}</h3>
                    <p>
                      {product.productDesc ||
                        "Discover your next favorite."}
                    </p>
                    <div className="product-card__footer">
                      <strong>{formatKRW(price)}</strong>
                      <button
                        className="button button--small"
                        onClick={(event) => {
                          const card =
                            event.currentTarget.closest(".product-card");
                          const added = addItem({
                            productId: product._id,
                            name: product.productName,
                            image,
                            price,
                          });
                          if (!added) return;

                          animateToBasket(card?.querySelector("img") ?? null);
                        }}
                        type="button"
                      >
                        Add to basket
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {newestProducts.length > 0 && (
          <div className="catalog__all-products">
            <div className="product-carousel__controls" aria-label="Product navigation">
              <button type="button" aria-label="Previous products" aria-controls="home-products" disabled={!canScroll.back} onClick={() => slide(-1)}>←</button>
              <button type="button" aria-label="Next products" aria-controls="home-products" disabled={!canScroll.forward} onClick={() => slide(1)}>→</button>
            </div>
            <Link className="button button--yellow" to="/products">
              View all products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
