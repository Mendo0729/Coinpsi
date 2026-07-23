const DEFAULT_API_BASE_URL = "http://localhost:3002";

export const API_BASE_URL = String(
  window.COINPSI_CONFIG?.API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");
