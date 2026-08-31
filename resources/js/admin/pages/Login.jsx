import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Field } from '../ui';

export default function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);

    if (user) return <Navigate to={location.state?.from?.pathname || '/'} replace />;

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
            await login(email, password);
            navigate(location.state?.from?.pathname || '/', { replace: true });
        } catch (err) {
            setError(err.errors?.email?.[0] || err.message || 'Sign in failed.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="login-wrap">
            <form className="login-card" onSubmit={submit}>
                <div className="text-center mb-4">
                    <img src="/images/logo/perjoda-logo.png" alt="PERJODA" style={{ height: 60 }} />
                    <h1 className="h5 mt-3 mb-1 text-primary fw-bold">PERJODA Admin</h1>
                    <p className="muted small mb-0">Operations panel — staff sign in</p>
                </div>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <Field label="Email">
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                    />
                </Field>
                <Field label="Password">
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </Field>

                <button className="btn btn-primary w-100" disabled={busy}>
                    {busy ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    );
}
