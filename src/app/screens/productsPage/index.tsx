import { useEffect, useState } from "react";
import MenuFilters from "../../components/MenuFilters";
import { getMenuCategory, isMenuProduct, type MenuCategory } from "../../../lib/menu";
import Footer from "../../components/footer";
import OtherNavbar from "../../components/headers/OtherNavbar";
import { useAppDispatch, useAppSelector } from "../../hooks";
import ProductsList from "./ProductsList";
import { selectProducts, selectProductsError, selectProductsStatus } from "./selector";
import { fetchProducts } from "./slice";

type SortOrder = "newest" | "price-low" | "price-high" | "popular";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const [category, setCategory] = useState<MenuCategory>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("newest");

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const filtered = products.filter((product) =>
    isMenuProduct(product) &&
    (category === "All" || getMenuCategory(product.productCategory) === category) &&
    product.productName.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const sorted = [...filtered].reverse().sort((a, b) => {
    if (sort === "price-low") return a.productPrice - b.productPrice;
    if (sort === "price-high") return b.productPrice - a.productPrice;
    if (sort === "popular") return (b.productViews ?? 0) - (a.productViews ?? 0);
    return (b.createdAt ? Date.parse(b.createdAt) : 0) - (a.createdAt ? Date.parse(a.createdAt) : 0);
  });

  return (
    <div className="products-page">
      <OtherNavbar />
      <main>
        <section className="products-hero">
          <div className="products-container">
            <p className="products-kicker">THE MORROW MENU</p>
            <h1>A good day starts with your favorite.</h1>
            <p className="products-hero__text">A bold first sip, a smooth afternoon latte, or something a little sweeter.</p>
          </div>
        </section>
        <section className="products-catalog" aria-label="Coffee menu">
          <div className="products-container">
            <div className="products-toolbar">
              <MenuFilters selected={category} onChange={setCategory} />
              <label className="products-search">
                <span>Search the menu</span>
                <input id="menu-search" type="search" placeholder="Find your coffee…" value={search} onChange={(event) => setSearch(event.target.value)} />
              </label>
            </div>
            <div className="products-results">
              <p aria-live="polite">{status === "loading" ? "Updating the menu…" : `${sorted.length} products`}</p>
              <div>
                <label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value as SortOrder)}>
                  <option value="newest">Newest</option>
                  <option value="popular">Most viewed</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select></label>
                <button className="products-refresh" type="button" disabled={status === "loading"} onClick={() => dispatch(fetchProducts())} aria-label="Refresh menu">↻</button>
              </div>
            </div>
            {status === "loading" && <p className="products-message" role="status">Brewing up the menu…</p>}
            {status === "failed" && <div className="products-message products-message--error" role="alert"><p>{error}</p><button className="button button--yellow" type="button" onClick={() => dispatch(fetchProducts())}>Try again</button></div>}
            {status === "succeeded" && <ProductsList products={sorted} />}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
