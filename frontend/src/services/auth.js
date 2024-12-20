export const getToken = () => localStorage.getItem('token');
export const setToken = token => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');
export const isLoggedIn = () => !!getToken();
export const logout = () => removeToken();
