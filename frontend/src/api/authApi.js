import axios from 'axios';

// 1. Set your backend URL (Adjust localhost port as needed, e.g., 8000 for Django, 5000 for Node)
const BASE_URL = 'http://localhost:5000/api';

// 2. Create an axios instance
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Important for cookies/sessions
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. Define API calls
export const authApi = {
    // Register a new user
    signup: async (userData) => {
        try {
            const response = await api.post('/auth/signup/', userData);
            return response.data;
        } catch (error) {
            console.error("Error signing up user:", error);
            throw error;
        }
    },

    // Log in a user
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login/', credentials);
            console.log("Login response:", response.data);
            console.log("Login status:", response.status);
            return response.data;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    },

    // Log out the current user
    logout: async () => {
        try {
            const response = await api.post('/auth/logout/');
            console.log("Logout response:", response.data);
            console.log("Logout status:", response.status);
            return response.data;
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    },

   

    // Get current user info
    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/user');
            return response.data;
        } catch (error) {
            console.error("Error fetching current user:", error);
            throw error;
        }
    },
    updateProfile: async (formData) => {
        // We use 'headers' here because uploading files requires 'multipart/form-data'
        const response = await api.put('/auth/user', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
