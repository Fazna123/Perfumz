import axios from "axios";

const token = localStorage.getItem("PerfumzToken");
console.log("perfumztoken", token);
const baseURI = import.meta.env.VITE_PUBLIC_BASE_API;

const api = axios.create({
  baseURL: `${baseURI}/api/`,
  headers: {
    "Content-Type": "text/plain",
    Authorization: token ? token : "",
  },
  withCredentials: true,
});
//api.defaults.withCredentials = true;
console.log(api);

const post = async (url, data) => {
  try {
    // Stringify the data before sending
    const response = await api.post(url, JSON.stringify(data));
    return response;
  } catch (error) {
    throw error; // Rethrow the error to handle it in your component
  }
};

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("PerfumzToken");
//     if (token) {
//       config.headers.Authorization = token;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default { api, post };
