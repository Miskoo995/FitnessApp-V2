import axios from "axios";

const instance = axios.create({
  baseURL: "https://api-fitness-app.herokuapp.com",
});

instance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
