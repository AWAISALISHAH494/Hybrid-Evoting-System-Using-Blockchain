import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (email: string, password: string) =>
        api.post('/auth/register', { email, password }),

    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    verifyOTP: (userId: string, otp: string) =>
        api.post('/auth/verify-otp', { userId, otp }),

    getMe: () =>
        api.get('/auth/me'),

    logout: () =>
        api.post('/auth/logout'),
};

// Elections API
export const electionsAPI = {
    getAll: () =>
        api.get('/elections'),

    getById: (id: string) =>
        api.get(`/elections/${id}`),

    create: (data: any) =>
        api.post('/elections', data),

    update: (id: string, data: any) =>
        api.put(`/elections/${id}`, data),

    delete: (id: string) =>
        api.delete(`/elections/${id}`),
};

// Vote API
export const voteAPI = {
    cast: (electionId: string, candidateId: string) =>
        api.post('/vote', { electionId, candidateId }),

    verify: (receiptId: string) =>
        api.get(`/vote/verify/${receiptId}`),

    getReceipt: (receiptId: string) =>
        api.get(`/vote/receipt/${receiptId}`),
};

// Admin API
export const adminAPI = {
    getAnalytics: (electionId: string) =>
        api.get(`/admin/analytics/${electionId}`),

    finalizeElection: (electionId: string) =>
        api.post(`/admin/finalize/${electionId}`),

    addManualVotes: (electionId: string, votes: any[]) =>
        api.post('/admin/manual-votes', { electionId, votes }),
};

export default api;
