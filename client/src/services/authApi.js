const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

/**
 * Store token in localStorage
 */
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * Get token from localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Remove token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Register new user
 */
export const register = async ({ name, email, password }) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Registration failed: ${res.status}`);
  }

  const data = await res.json();
  
  // Store token
  if (data.token) {
    setAuthToken(data.token);
  }

  return data;
};

/**
 * Login user
 */
export const login = async ({ email, password }) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Login failed: ${res.status}`);
  }

  const data = await res.json();
  
  // Store token
  if (data.token) {
    setAuthToken(data.token);
  }

  return data;
};

/**
 * Logout user
 */
export const logout = () => {
  removeAuthToken();
  window.location.href = '/login';
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Token expired or invalid
      removeAuthToken();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(`Failed to get user: ${res.status}`);
  }

  const data = await res.json();
  return data.user;
};

/**
 * Helper to add auth header to requests
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
