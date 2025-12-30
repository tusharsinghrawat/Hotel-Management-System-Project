import axios from "axios";

// 🔥 Detect backend availability (demo-safe)
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "";

// ✅ Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 8000, // 🔥 avoid infinite wait when backend OFF
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // ✅ token safety check
    if (token && token !== "null" && token !== "undefined") {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 BACKEND OFF / NETWORK ERROR → silent fail
    if (!error.response) {
      console.warn("Backend not reachable (demo mode)");
      return Promise.reject(error);
    }

    // 🔥 Auto logout on auth failure
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      console.warn("Unauthorized – token removed");
    }

    return Promise.reject(error);
  }
);

export default api;
