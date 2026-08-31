import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

/* ----------------------------- Toasts ----------------------------- */
const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const push = useCallback((message, variant = 'success') => {
        const id = Math.random().toString(36).slice(2);
        setToasts((t) => [...t, { id, message, variant }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
    }, []);
    return (
        <ToastCtx.Provider value={push}>
            {children}
            <div className="toast-stack">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`alert alert-${t.variant === 'error' ? 'danger' : t.variant} shadow-sm mb-0 py-2 px-3`}
                        role="alert"
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastCtx.Provider>
    );
}
export const useToast = () => useContext(ToastCtx);

/* ----------------------------- Field ----------------------------- */
export function Field({ label, error, children, hint, required }) {
    return (
        <div className="mb-3">
            {label && (
                <label className="form-label fw-semibold small">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
            )}
            {children}
            {hint && !error && <div className="form-text">{hint}</div>}
            {error && <div className="text-danger small mt-1">{error}</div>}
        </div>
    );
}

/* ----------------------------- Spinner ----------------------------- */
export function Loading({ label = 'Loading…' }) {
    return (
        <div className="text-center text-muted py-5">
            <span className="spinner-border spinner-border-sm me-2" />
            {label}
        </div>
    );
}

export function ErrorNote({ message, onRetry }) {
    return (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{message}</span>
            {onRetry && (
                <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
                    Retry
                </button>
            )}
        </div>
    );
}

/* -------------------------- Confirm button -------------------------- */
export function ConfirmButton({ onConfirm, children, className = 'btn btn-sm btn-outline-danger', confirmLabel = 'Click again to confirm' }) {
    const [armed, setArmed] = useState(false);
    const timer = useRef(null);
    useEffect(() => () => clearTimeout(timer.current), []);
    return (
        <button
            type="button"
            className={className}
            onClick={() => {
                if (armed) {
                    clearTimeout(timer.current);
                    setArmed(false);
                    onConfirm();
                } else {
                    setArmed(true);
                    timer.current = setTimeout(() => setArmed(false), 3000);
                }
            }}
        >
            {armed ? confirmLabel : children}
        </button>
    );
}

/* ----------------------------- Modal ----------------------------- */
export function Modal({ title, onClose, children, footer, size = '' }) {
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <>
            <div className="modal-backdrop fade show" onClick={onClose} />
            <div className="modal fade show d-block" role="dialog" onMouseDown={onClose}>
                <div
                    className={`modal-dialog modal-dialog-scrollable modal-dialog-centered ${size}`}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title h6 mb-0">{title}</h2>
                            <button type="button" className="btn-close" onClick={onClose} />
                        </div>
                        <div className="modal-body">{children}</div>
                        {footer && <div className="modal-footer">{footer}</div>}
                    </div>
                </div>
            </div>
        </>
    );
}

/* ----------------------------- useList ----------------------------- */
export function useApiResource(loader, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const reload = useCallback(() => {
        setLoading(true);
        setError(null);
        loader()
            .then((res) => setData(res))
            .catch((e) => setError(e.message || 'Failed to load.'))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        reload();
    }, [reload]);

    return { data, loading, error, reload, setData };
}
