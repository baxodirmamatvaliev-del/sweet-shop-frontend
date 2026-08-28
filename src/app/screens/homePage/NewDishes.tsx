import { Link } from "react-router-dom";
import useBasket from "../../hooks/useBasket";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getProductImageUrl } from "../../services/ProductService";
import { convertLegacyPriceToUSD, formatUSD } from "../../../lib/currency";
import { animateToBasket } from "../../../lib/animateToBasket";
import {
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "../productsPage/selector";
import { fetchProducts } from "../productsPage/slice";

export default function NewDishes() {
  const { addItem } = useBasket();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const newestProducts = products.slice(-6);

  return (
    <section className="catalog home-section" id="catalog">
      <div className="home-container">
        <div className="section-heading">
          <div>
            <p className="home-kicker">OUR CATALOG</p>
            <h2>
              Most-loved
              <br />
              sweet creations
            </h2>
          </div>
          <p>
            Every order is made with fresh ingredients and decorated in the
            style you choose.
          </p>
        </div>
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
          <p className="catalog__message">Products will appear here soon.</p>
        )}
        {newestProducts.length > 0 && (
          <div className="product-grid">
            {newestProducts.map((product) => {
              const image = getProductImageUrl(product.productImage);
              const price = convertLegacyPriceToUSD(product.productPrice);

              return (
                <article className="product-card" key={product._id}>
                  <div className="product-card__media">
                    <img src={image} alt={product.productName} />
                    <span>{product.productCategory}</span>
                  </div>
                  <div className="product-card__body">
                    <h3>{product.productName}</h3>
                    <p>
                      {product.productDesc ||
                        "A freshly made Sweet Shop dessert."}
                    </p>
                    <div className="product-card__footer">
                      <strong>{formatUSD(price)}</strong>
                      <button
                        className="button button--small"
                        onClick={(event) => {
                          const card =
                            event.currentTarget.closest(".product-card");
                          animateToBasket(card?.querySelector("img") ?? null);
                          addItem({
                            productId: product._id,
                            name: product.productName,
                            image,
                            price,
                          });
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
            <Link className="button button--yellow" to="/products">
              View all products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
