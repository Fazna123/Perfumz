import axios from "axios";

const token = localStorage.getItem("PerfumzToken");
console.log("token", token);
const baseURI = import.meta.env.VITE_PUBLIC_BASE_API;

// const api = axios.create({
//   baseURL: `${baseURI}/api/`,
//   headers: {
//     Authorization: token || "",
//   },
// });

const api = axios.create({
  baseURL: `${baseURI}/api/`,
});

api.defaults.withCredentials = true;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("PerfumzToken");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
