const API_URL = import.meta.env.REACT_APP_API_URL;
export const getOrders = () => fetch(`${API_URL}/orders`);
