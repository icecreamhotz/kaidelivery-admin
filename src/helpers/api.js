import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://kaidelivery-api.herokuapp.com/api/v1/",
  timeout: 5000
});

axiosInstance.interceptors.request.use(
  config => {
    config.headers.authorization = localStorage.getItem("token");
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
