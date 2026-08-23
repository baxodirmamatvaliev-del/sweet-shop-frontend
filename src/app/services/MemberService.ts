
const API_URL = import.meta.env.REACT_APP_API_URL;
export const getMembers = () => fetch(`${API_URL}/members`);
