import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import { ToastProvider } from './ui';
import Layout from './Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Announcements from './pages/Announcements';
import RoutesPage from './pages/RoutesPage';
import Fares from './pages/Fares';
import Messages from './pages/Messages';
import SiteContent from './pages/SiteContent';
import Users from './pages/Users';
import Permissions from './pages/Permissions';

function Protected({ children, roles, permission }) {
    const { user, ready } = useAuth();
    const location = useLocation();
    if (!ready) {
        return (
            <div className="login-wrap">
                <span className="spinner-border text-light" />
            </div>
        );
    }
    if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
    if (permission && !user.permissions?.includes(permission)) return <Navigate to="/" replace />;
    return <Layout>{children}</Layout>;
}

function Shell() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Protected><Dashboard /></Protected>} />
            <Route
                path="/announcements"
                element={<Protected permission="announcements.manage"><Announcements /></Protected>}
            />
            <Route path="/routes" element={<Protected permission="routes.manage"><RoutesPage /></Protected>} />
            <Route path="/fares" element={<Protected permission="fares.manage"><Fares /></Protected>} />
            <Route path="/messages" element={<Protected permission="messages.manage"><Messages /></Protected>} />
            <Route
                path="/site-content"
                element={<Protected permission="site_content.manage"><SiteContent /></Protected>}
            />
            <Route path="/users" element={<Protected roles={['superadmin']}><Users /></Protected>} />
            <Route path="/permissions" element={<Protected roles={['superadmin']}><Permissions /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function AdminApp() {
    return (
        <AuthProvider>
            <ToastProvider>
                <Shell />
            </ToastProvider>
        </AuthProvider>
    );
}
