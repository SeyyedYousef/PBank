import { UserProfile } from '../../store/authStore';

// Define the response types
interface LoginResponse {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
}



// Simulated API Service - In the future, replace the internals of these functions with Axios calls
// This separates the "Store" (State) from the "Data Source" (API)
export const AuthService = {
    login: async (phone: string, _password?: string): Promise<LoginResponse> => {
        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Validation Simulation
        if (phone.length < 9 || phone.length > 10) {
            throw { message: 'شماره تلفن نامعتبر است', code: 'INVALID_PHONE' };
        }

        // Return Mock Data (For now, until Backend is ready)
        // TODO: Replace with: return axios.post('/auth/login', { phone, password })
        return {
            user: {
                name: 'کاربر پی‌بانک',
                username: `user_${phone.slice(-4)}`,
                avatar: undefined
            },
            accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Date.now()}.access_token_secure_placeholder`,
            refreshToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Date.now()}.refresh_token_secure_placeholder`
        };
    },

    logout: async (): Promise<void> => {
        // Simulate server-side logout (invalidate token)
        await new Promise(resolve => setTimeout(resolve, 300));
        // TODO: axios.post('/auth/logout')
    },

    refreshToken: async (_token: string): Promise<{ accessToken: string, refreshToken: string }> => {
        // Simulate Token Rotation
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Date.now()}.rotated_access`,
            refreshToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Date.now()}.rotated_refresh`
        };
    }
};
