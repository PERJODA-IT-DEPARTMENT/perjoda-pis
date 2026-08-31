import axios from 'axios';

/**
 * Single, centralised Axios instance for the whole app.
 * Every component talks to Laravel through this client.
 */
const api = axios.create({
    baseURL: '/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

const STATUS_MESSAGES = {
    400: 'We could not process that request. Please try again.',
    401: 'You are not authorised to view this information.',
    403: 'You do not have permission to access this resource.',
    404: 'The information you are looking for is not available right now.',
    422: 'Please review the highlighted fields and try again.',
    429: 'You have made too many requests. Please wait a moment and try again.',
    500: 'Something went wrong on our end. Please try again shortly.',
    503: 'This service is temporarily unavailable. Please try again soon.',
};

/**
 * Normalises any Axios failure into a predictable, user-safe shape:
 * { message: string, status: number|null, errors: object|null }
 */
export function normaliseError(error) {
    if (axios.isCancel?.(error)) {
        return { message: 'Request cancelled.', status: null, errors: null, cancelled: true };
    }

    if (error.code === 'ECONNABORTED') {
        return { message: 'The request timed out. Please check your connection and try again.', status: null, errors: null };
    }

    if (!error.response) {
        return { message: 'Unable to connect. Please check your internet connection and try again.', status: null, errors: null };
    }

    const { status, data } = error.response;

    return {
        status,
        message: data?.message || STATUS_MESSAGES[status] || 'Something went wrong. Please try again.',
        errors: data?.errors || null,
    };
}

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normaliseError(error)),
);

export default api;
