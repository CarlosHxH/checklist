// utils/api.ts
export const api = {
  async fetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers});

    if (response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("authToken");
      window.location.href = "/login";
      return;
    }
    return response;
  },
};
