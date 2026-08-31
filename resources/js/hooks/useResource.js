import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';

/**
 * Fetches a read-only API resource once and exposes the four states every
 * API-driven section needs: loading / data / empty / error, plus reload().
 *
 * @param {string} path      API path relative to /api (e.g. "/routes")
 * @param {object} options   { params, enabled }
 */
export default function useResource(path, options = {}) {
    const { params, enabled = true } = options;
    const paramsKey = JSON.stringify(params ?? null);

    const [data, setData] = useState(null);
    const [meta, setMeta] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(enabled);

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(path, { params });
            if (!mounted.current) return;
            setData(response.data?.data ?? null);
            setMeta(response.data?.meta ?? null);
        } catch (err) {
            if (!mounted.current || err.cancelled) return;
            setError(err.message || 'Unable to load this information.');
            setData(null);
        } finally {
            if (mounted.current) setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, paramsKey]);

    useEffect(() => {
        if (enabled) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, load]);

    const isEmpty = !loading && !error && Array.isArray(data) && data.length === 0;

    return { data, meta, error, loading, isEmpty, reload: load };
}
