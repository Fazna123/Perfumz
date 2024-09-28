import axios from "axios";

const token = localStorage.getItem("PerfumzToken");
const baseURI = import.meta.env.VITE_PUBLIC_BASE_API;

const api = axios.create({
  baseURL: `${baseURI}/api/`,
  headers: {
    Authorization: token || "",
  },
});

export default api;
