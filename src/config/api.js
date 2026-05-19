const API_ROOT = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

/** Base URL for all REST calls, e.g. http://localhost:5000/api */
export const API_BASE_URL = `${API_ROOT}/api`;
