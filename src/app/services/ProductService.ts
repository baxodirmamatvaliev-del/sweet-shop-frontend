const API_URL = import.meta.env.REACT_APP_API_URL;
export const getProducts = () => fetch(`${API_URL}/products`);
