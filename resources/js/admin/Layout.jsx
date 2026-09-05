import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';

const LINKS = [
    { to: '/', label: 'Dashboard', icon: 'bi-speedometer2', end: true },
    { to: '/announcements', label: 'Announcements', icon: 'bi-megaphone', permission: 'announcements.manage' },
    { to: '/routes', label: 'Routes & Stops', icon: 'bi-signpost-split', permission: 'routes.manage' },
    { to: '/fares', label: 'Fares', icon: 'bi-cash-coin', permission: 'fares.manage' },
    { to: '/messages', label: 'Messages', icon: 'bi-inbox', permission: 'messages.manage' },
    { to: '/site-content', label: 'Site Content', icon: 'bi-file-text', permission: 'site_content.manage' },
    { to: '/users', label: 'Staff Accounts', icon: 'bi-people', roles: ['superadmin'] },
    { to: '/permissions', label: 'Permissions', icon: 'bi-shield-lock', roles: ['superadmin'] },
];

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const links = LINKS.filter((l) => {
        if (l.roles && !l.roles.includes(user?.role)) return false;
        if (l.permission && !user?.permissions?.includes(l.permission)) return false;
        return true;
    });

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <img src="/images/logo/perjoda-logo.png" alt="" />
                    <span>PERJODA</span>
                </div>
                <nav className="admin-nav">
                    {links.map((l) => (
                        <NavLink key={l.to} to={l.to} end={l.end}>
                            <i className={`bi ${l.icon}`} />
                            {l.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar">
                    <span className="fw-semibold text-primary">Operations Panel</span>
                    <div className="d-flex align-items-center gap-3">
                        <span className="small muted d-none d-sm-inline">
                            {user?.name}
                            {user?.role && (
                                <span className="badge text-bg-light ms-2 text-uppercase">{user.role}</span>
                            )}
                        </span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-1" />
                            Sign out
                        </button>
                    </div>
                </header>
                <main className="admin-content">{children}</main>
            </div>
        </div>
    );
}
