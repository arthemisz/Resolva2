const API_BASE = 'http://localhost:5000/api';

export const api = {
    getProducts: async () => {
        const res = await fetch(`${API_BASE}/products`);
        return res.json();
    },

    getTransactions: async () => {
        const res = await fetch(`${API_BASE}/transactions`);
        return res.json();
    },

    getTransactionById: async (id) => {
        const res = await fetch(`${API_BASE}/transactions/${id}`);
        return res.json();
    },

    sendChatMessage: async (message, history = []) => {
        const res = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history }),
        });
        return res.json();
    },

    confirmTransaction: async (data) => {
        const res = await fetch(`${API_BASE}/transactions/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    }
};