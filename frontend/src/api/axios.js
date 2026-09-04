import axios from "axios";

// Vite mein env variables VITE_ prefix ke saath likhi jaati hain,
// aur import.meta.env se access hoti hain (process.env yahan kaam nahi karega)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Interceptor — HAR request jaane se pehle ye function chalega.
// Isse hume har jagah manually token attach nahi karna padega.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
