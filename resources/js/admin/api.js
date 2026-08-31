import axios from 'axios';

const TOKEN_KEY = 'perjoda_admin_token';

export const tokenStore = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (t) => localStorage.setItem(TOKEN_KEY, t),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({
    baseURL: '/api/admin',
    headers: { Accept: 'application/json' },
    timeout: 20000,
});

api.interceptors.request.use((config) => {
    const t = tokenStore.get();
    if (t) config.headers.Authorization = `Bearer ${t}`;
    return config;
});

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
    onUnauthorized = fn;
};

api.interceptors.response.use(
    (r) => r,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            tokenStore.clear();
            onUnauthorized();
        }
        const data = error.response?.data;
        return Promise.reject({
            status: status ?? null,
            message:
                data?.message ||
                (error.code === 'ECONNABORTED'
                    ? 'The request timed out. Please try again.'
                    : !error.response
                      ? 'Unable to reach the server.'
                      : 'Something went wrong. Please try again.'),
            errors: data?.errors || null,
        });
    },
);

export default api;
