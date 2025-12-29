import axios from "axios";

const api = axios.create({
  // ✅ ENV based baseURL (DEV + PROD safe)
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
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

// ================= RESPONSE INTERCEPTOR (OPTIONAL BUT USEFUL) =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Auto logout on auth failure
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      console.warn("Unauthorized – token removed");
    }
    return Promise.reject(error);
  }
);

export default api;
