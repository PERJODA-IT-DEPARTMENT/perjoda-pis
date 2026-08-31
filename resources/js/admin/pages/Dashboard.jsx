import { Link } from 'react-router-dom';
import api from '../api';
import { ErrorNote, Loading, useApiResource } from '../ui';

export default function Dashboard() {
    const { data, loading, error, reload } = useApiResource(
        () => api.get('/dashboard').then((r) => r.data.data),
        [],
    );

    if (loading) return <Loading />;
    if (error) return <ErrorNote message={error} onRetry={reload} />;

    const stats = [
        { n: data.announcements_published, l: 'Published announcements', to: '/announcements' },
        { n: data.announcements_total, l: 'Announcements total', to: '/announcements' },
        { n: data.routes_active, l: 'Active routes', to: '/routes' },
        { n: data.fares_active, l: 'Active fares', to: '/fares' },
        { n: data.messages_unhandled, l: 'Unhandled messages', to: '/messages' },
        { n: data.messages_total, l: 'Messages total', to: '/messages' },
    ];

    return (
        <>
            <h1 className="page-title mb-4">Dashboard</h1>
            <div className="row g-3 mb-4">
                {stats.map((s) => (
                    <div className="col-6 col-lg-4" key={s.l}>
                        <Link to={s.to} className="text-decoration-none">
                            <div className="stat-card h-100">
                                <div className="n">{s.n}</div>
                                <div className="l">{s.l}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header bg-white fw-semibold">Latest messages</div>
                <div className="table-responsive">
                    <table className="table mb-0 align-middle">
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>Subject</th>
                                <th>Received</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recent_messages.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center muted py-4">
                                        No messages yet.
                                    </td>
                                </tr>
                            )}
                            {data.recent_messages.map((m) => (
                                <tr key={m.id}>
                                    <td>{m.name}</td>
                                    <td>{m.subject}</td>
                                    <td className="muted small">
                                        {new Date(m.created_at).toLocaleString()}
                                    </td>
                                    <td>
                                        {m.handled_at ? (
                                            <span className="badge text-bg-success">Handled</span>
                                        ) : (
                                            <span className="badge text-bg-warning">New</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
