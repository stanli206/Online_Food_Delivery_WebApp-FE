import axios from "axios";

const api = axios.create({
  baseURL: "https://d2z2es90bhnbzx.cloudfront.net", // backend URL
  withCredentials: true, //cookies
});

export default api;
