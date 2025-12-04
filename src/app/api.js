import axios from "axios";

const api = axios.create({
  baseURL:  "https://tomato-43cn.onrender.com", // backend URL "https://tomato-43cn.onrender.com" ||
  withCredentials: true, // important for sessions (cookies)
});

export default api;
