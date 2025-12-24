import axios from 'axios';

// 1. Set your backend URL (Adjust localhost port as needed, e.g., 8000 for Django, 5000 for Node)
const BASE_URL = 'http://localhost:5000/api/blogs/';

// 2. Create an axios instance
const api = axios.create({
    baseURL: BASE_URL,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    withCredentials: true,
});

// 3. Define API calls
export const blogsApi = {
    // Get all blogs
    getFeaturedBlogs: async (limit = 6) => {
        try {
            // Adjust query params based on your backend expectations
            const response = await api.get(`/?featured=true&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching featured blogs:", error);
            throw error;
        }
    }, 

    getAll: async () => {
        try {
            const response = await api.get('/');
            return response.data;
        } catch (error) {
            console.error("Error fetching blogs:", error);
            throw error;
        }
    },

    // Get a single blog by ID
    getById: async (id) => {
        try {
            const response = await api.get(`/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching blog ${id}:`, error);
            throw error;
        }
    },
    // Get blogs by author
    getByAuthor: async (author) => {
        try {
            const response = await api.get(`/author/${author}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching blogs by author ${author}:`, error);
            throw error;
        }
    },
    // Get drafts by author
    // getDraftsByAuthor: async (author) => {
    //     try {
    //         const response = await api.get(`/author/${author}/drafts/`);
    //         return response.data;
    //     } catch (error) {
    //         console.error(`Error fetching drafts by author ${author}:`, error);
    //         throw error;
    //     }
    // },

    // Create a new blog
    create: async (blogData) => {
        try {
            const response = await api.post('/', blogData);
            return response.data;
        } catch (error) {
            console.error("Error creating blog:", error);
            throw error;
        }
    },

    // Update a blog
    update: async (id, blogData) => {
        try { 
            const response = await api.put(`/${id}/`, blogData);
            console.log(response);
            return response;
        } catch (error) {
            console.error(`Error updating blog ${id}:`, error);
            throw error;
        }
    },

    // Delete a blog
    delete: async (id) => {
        try {
            // Adjust query params based on your backend expectations
            const response = await api.delete(`/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting blog ${id}:`, error);
            throw error;
        }
    },
    // Add to archive
    addToArchive: async (id) => {
        try {
            // Adjust query params based on your backend expectations
            console.log(id);
            const response = await api.post(`/archive/${id}/`);
            
            return response.data;
        } catch (error) {
            console.error(`Error archiving blog ${id}:`, error);
            throw error;
        }
    },
    getArchived: async () => {
        try {
            console.log("req.user.username");
            const response = await api.get('/archives');   
            console.log(response.data);         
            return response.data;
        } catch (error) {
            console.error("Error fetching archived blogs:", error);
            throw error;
        }
    },
    restore: async (id) => {
        try {
            console.log(id);
            const response = await api.post(`/restore/${id}/`);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(`Error restoring blog ${id}:`, error);
            throw error;
        }
    },

};

