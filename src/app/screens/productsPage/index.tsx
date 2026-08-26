import { useEffect, useState } from "react";
import Footer from "../../components/footer";
import OtherNavbar from "../../components/headers/OtherNavbar";
import { useAppDispatch, useAppSelector } from "../../hooks";
import ProductsList from "./ProductsList";
import {
  selectProducts,
  selectProductsError,
  selectProductsStatus,
} from "./selector";
import { fetchProducts } from "./slice";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="products-page">
      <OtherNavbar />
      <main>
        <section className="products-hero">
          <div className="products-container">
            <p className="products-kicker">SWEET SHOP CATALOG</p>
            <h1>Find a sweet for every celebration</h1>
            <p className="products-hero__text">
              Freshly prepared desserts, carefully decorated for your special
              moments.
            </p>
            <label className="products-search">
              <span>Search products</span>
              <input
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Type a product name..."
                type="search"
                value={search}
              />
            </label>
          </div>
        </section>

        <section className="products-catalog">
          <div className="products-container">
            {status === "loading" && (
              <p className="products-message">Loading products...</p>
            )}
            {status === "failed" && (
              <div className="products-message products-message--error">
                <p>{error}</p>
                <button
                  className="button button--yellow"
                  onClick={() => dispatch(fetchProducts())}
                  type="button"
                >
                  Try again
                </button>
              </div>
            )}
            {status === "succeeded" && (
              <ProductsList products={filteredProducts} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
