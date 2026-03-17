import axios from "axios";

const api = axios.create({
  baseURL: "http://16.171.148.112:5000/", // backend URL
  withCredentials: true, //cookies
})

export default api;
