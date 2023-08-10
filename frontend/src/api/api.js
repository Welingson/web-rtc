import axios from 'axios';

const configApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

configApi.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user')).token : false;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => { Promise.reject(error) }
)

export const api = configApi;