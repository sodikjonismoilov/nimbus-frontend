import axios from "axios";

// No trailing slash, we’ll append paths ourselves
export const API_ROOT = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");

// Shared axios instance
export const http = axios.create({
    baseURL: API_ROOT,
    withCredentials: false
});