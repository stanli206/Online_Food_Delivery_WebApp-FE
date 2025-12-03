import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // backend URL
  withCredentials: true, // important for sessions (cookies)
});

export default api;
