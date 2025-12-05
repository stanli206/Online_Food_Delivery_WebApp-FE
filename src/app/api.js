import axios from "axios";

const api = axios.create({
  baseURL: "https://tomato-5fkk.onrender.com", // backend URL
  withCredentials: true, // important for sessions (cookies)
});

export default api;
