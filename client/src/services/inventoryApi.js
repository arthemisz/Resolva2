const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export const inventoryApi = {
  getProducts: async () => {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  createProduct: async (data) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }
    return res.json();
  },

  getTransactions: async () => {
    const res = await fetch(`${API_BASE}/transactions`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  getTransactionById: async (id) => {
    const res = await fetch(`${API_BASE}/transactions/${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  sendChatMessage: async (message, history = []) => {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }
    return res.json();
  },

  confirmTransaction: async (data) => {
    const res = await fetch(`${API_BASE}/transactions/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${res.status}`);
    }
    return res.json();
  }
};
