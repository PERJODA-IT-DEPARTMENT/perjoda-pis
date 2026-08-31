import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { setUnauthorizedHandler, tokenStore } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    const signOutLocal = useCallback(() => {
        tokenStore.clear();
        setUser(null);
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(() => setUser(null));
    }, []);

    useEffect(() => {
        let active = true;
        if (!tokenStore.get()) {
            setReady(true);
            return () => {};
        }
        api.get('/me')
            .then((res) => active && setUser(res.data.data))
            .catch(() => active && signOutLocal())
            .finally(() => active && setReady(true));
        return () => {
            active = false;
        };
    }, [signOutLocal]);

    const login = useCallback(async (email, password) => {
        const res = await api.post('/login', { email, password });
        tokenStore.set(res.data.data.token);
        setUser(res.data.data.user);
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/logout');
        } catch {
            /* ignore — clear locally regardless */
        }
        signOutLocal();
    }, [signOutLocal]);

    return (
        <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
