import axios from "axios";

// instance 请求后端api实例
const API = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API}`,
  timeout: 5000,
});

export default API;
