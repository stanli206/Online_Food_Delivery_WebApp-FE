import axios from "axios";

const api = axios.create({
  baseURL: "https://tomato-gk4c.onrender.com/", //"http://localhost:5000", // backend URL
  withCredentials: true, // important for sessions (cookies)
});

export default api;
