import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// List of all endpoints

export const sendOtp = (data) => api.post("/api/send-otp", data, { withCredentials: true });
export const verifyOtp = (data) => api.post("/api/verify-otp", data);
export const activate = (data) => api.post("/api/activate", data);
export const logout = ()=> api.post('/api/logout');
export const createRoom = (data) => api.post("/api/rooms", data);
export const getAllRooms = ()=> api.get('/api/rooms');
export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`);


api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken"); // Read token from cookies
    console.log(accessToken);
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptors
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        console.log(import.meta.env.VITE_API_URL);
        await axios.get(`${import.meta.env.VITE_API_URL}/api/refresh`, {
          withCredentials: true,
        });

        return api.request(originalRequest);
      } catch (error) {
        console.log(error.message);
      }
    }
    throw error;
  }
);

export default api;
