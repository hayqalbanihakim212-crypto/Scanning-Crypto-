import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const getCoins = (params) =>
  api.get("/coins", { params }).then((r) => r.data);

export const getCoinDetail = (id) =>
  api.get(`/coins/${id}`).then((r) => r.data);

export const getScreener = () => api.get("/coins/screener").then((r) => r.data);

export const getAverageScore = () =>
  api.get("/coins/screener/average").then((r) => r.data);

export const getWatchlist = () =>
  api.get("/coins/watchlist").then((r) => r.data);

export const addWatchlist = (coin_id) =>
  api.post("/coins/watchlist", { coin_id }).then((r) => r.data);

export const deleteWatchlist = (id) =>
  api.delete(`/coins/watchlist/${id}`).then((r) => r.data);

export const checkWatchlist = (id) =>
  api.get(`/coins/watchlist/check/${id}`).then((r) => r.data);

export default api;
