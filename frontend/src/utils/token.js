export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => !!getToken();
