/**
 * Shared loading / empty / error panel for API-driven sections.
 * Never leaves a blank space when a request is pending or fails.
 */
export default function StatePanel({ variant = 'loading', title, message, onRetry }) {
    if (variant === 'loading') {
        return (
            <div className="state-panel" role="status" aria-live="polite">
                <span
                    className="spinner-border spinner-border-sm text-primary me-2"
                    aria-hidden="true"
                />
                {message || 'Loading…'}
            </div>
        );
    }

    const isError = variant === 'error';

    return (
        <div
            className={`state-panel ${isError ? 'state-panel--error' : ''}`}
            role={isError ? 'alert' : 'status'}
        >
            <i
                className={`bi ${isError ? 'bi-exclamation-triangle' : 'bi-inbox'}`}
                aria-hidden="true"
            />
            {title && <p className="fw-semibold text-dark mb-1">{title}</p>}
            <p className="mb-0">{message}</p>
            {isError && onRetry && (
                <button type="button" className="btn btn-outline-primary btn-sm mt-3" onClick={onRetry}>
                    <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
                    Try Again
                </button>
            )}
        </div>
    );
}
