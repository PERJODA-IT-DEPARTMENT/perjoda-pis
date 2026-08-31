import { useState } from 'react';
import api from '../api';
import { ConfirmButton, ErrorNote, Loading, Modal, useApiResource, useToast } from '../ui';

export default function Messages() {
    const toast = useToast();
    const [filter, setFilter] = useState('all');
    const { data, loading, error, reload } = useApiResource(
        () => api.get('/contact-messages', { params: { filter } }).then((r) => r.data.data),
        [filter],
    );
    const [open, setOpen] = useState(null);

    const setHandled = async (m, handled) => {
        try {
            await api.patch(`/contact-messages/${m.id}`, { handled });
            toast(handled ? 'Marked as handled' : 'Reopened');
            reload();
            setOpen((o) => (o && o.id === m.id ? { ...o, handled_at: handled ? new Date().toISOString() : null } : o));
        } catch (e) {
            toast(e.message || 'Update failed', 'error');
        }
    };

    const remove = async (id) => {
        try {
            await api.delete(`/contact-messages/${id}`);
            toast('Message deleted');
            setOpen(null);
            reload();
        } catch (e) {
            toast(e.message || 'Delete failed', 'error');
        }
    };

    const rows = data?.data ?? [];

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="page-title">Messages</h1>
                <select
                    className="form-select form-select-sm"
                    style={{ width: 180 }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All messages</option>
                    <option value="unhandled">Unhandled only</option>
                </select>
            </div>

            {loading && <Loading />}
            {error && <ErrorNote message={error} onRetry={reload} />}

            {!loading && !error && (
                <div className="card">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>From</th>
                                    <th>Subject</th>
                                    <th>Received</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center muted py-4">
                                            No messages.
                                        </td>
                                    </tr>
                                )}
                                {rows.map((m) => (
                                    <tr key={m.id}>
                                        <td>
                                            <div className="fw-semibold">{m.name}</div>
                                            <div className="muted small">{m.email}</div>
                                        </td>
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
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => setOpen(m)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => setHandled(m, !m.handled_at)}
                                            >
                                                {m.handled_at ? 'Reopen' : 'Mark handled'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {open && (
                <Modal
                    title={open.subject}
                    onClose={() => setOpen(null)}
                    footer={
                        <div className="d-flex justify-content-between w-100">
                            <ConfirmButton onConfirm={() => remove(open.id)}>Delete</ConfirmButton>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setHandled(open, !open.handled_at)}
                            >
                                {open.handled_at ? 'Reopen' : 'Mark handled'}
                            </button>
                        </div>
                    }
                >
                    <dl className="row small mb-3">
                        <dt className="col-4">Name</dt>
                        <dd className="col-8">{open.name}</dd>
                        <dt className="col-4">Email</dt>
                        <dd className="col-8">
                            <a href={`mailto:${open.email}`}>{open.email}</a>
                        </dd>
                        <dt className="col-4">Contact number</dt>
                        <dd className="col-8">{open.contact_number || '—'}</dd>
                        <dt className="col-4">Received</dt>
                        <dd className="col-8">{new Date(open.created_at).toLocaleString()}</dd>
                    </dl>
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        {open.message}
                    </p>
                </Modal>
            )}
        </>
    );
}
