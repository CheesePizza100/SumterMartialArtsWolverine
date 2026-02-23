import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5163/api';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Request interceptor - add token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            // Check if token is expired
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiry = payload.exp * 1000;

                if (Date.now() > expiry) {
                    // Token expired, don't add it
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('current_user');
                    window.location.href = '/login';
                    return Promise.reject(new Error('Token expired'));
                }

                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Error parsing token:', error);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token invalid or expired
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;