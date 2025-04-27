import axios from "axios";
import { store } from "../redux/store";
import { refreshTokens, clearAuth } from "../redux/slices/authSlice";

const BASE_URL = import.meta.env.VITE_API_URL;

const baseService = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        'ngrok-skip-browser-warning': '1'
    },
});

baseService.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const state = store.getState();
                const refreshToken = state.auth.refreshToken;
                
                if (!refreshToken) {
                    store.dispatch(clearAuth());
                    return Promise.reject(error);
                }
                
                const result = await store.dispatch(refreshTokens(refreshToken));
                
                if (refreshTokens.fulfilled.match(result)) {
                    originalRequest.headers['Authorization'] = `Bearer ${result.payload.tokens.access.token}`;
                    return baseService(originalRequest);
                } else {
                    store.dispatch(clearAuth());
                }
            } catch (refreshError) {
                store.dispatch(clearAuth());
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

baseService.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default baseService;