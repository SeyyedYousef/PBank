import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/shared/ui/Toast/toastStore';

// Base URL would typically come from env vars
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pbank.ir/v1';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 (Token Expiry) and Network Errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Catch Network Errors / Timeouts
        if (!error.response) {
            toast.error('خطا در برقراری ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.');
            return Promise.reject(error);
        }

        // Catch Server Errors
        if (error.response.status >= 500) {
            toast.error('خطای سرور رخ داده است. لطفا بعدا دوباره تلاش کنید.');
            return Promise.reject(error);
        }

        // Catch Gateway Timeouts
        if (error.code === 'ECONNABORTED' || error.response.status === 408 || error.response.status === 504) {
            toast.error('مهلت درخواست به پایان رسید. تلاش مجدد...');
            return Promise.reject(error);
        }

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Trigger token rotation from store
                await useAuthStore.getState().rotateTokens();

                // Get new token
                const newToken = useAuthStore.getState().accessToken;

                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, redirect to login (store handles logout)
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
