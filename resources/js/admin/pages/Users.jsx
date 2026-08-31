import { useState } from 'react';
import api from '../api';
import { useAuth } from '../auth';
import { ConfirmButton, ErrorNote, Field, Loading, Modal, useApiResource, useToast } from '../ui';

function UserForm({ initial, onDone, onCancel }) {
    const toast = useToast();
    const [form, setForm] = useState({
        name: initial?.name || '',
        email: initial?.email || '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors({});
        try {
            if (initial?.id) {
                const payload = { name: form.name, email: form.email };
                if (form.password) payload.password = form.password;
                await api.put(`/users/${initial.id}`, payload);
                toast('Account updated');
            } else {
                await api.post('/users', form);
                toast('Staff account created');
            }
            onDone();
        } catch (err) {
            setErrors(err.errors || {});
            toast(err.message || 'Could not save', 'error');
        } finally {
            setBusy(false);
        }
    };

    return (
        <form onSubmit={submit}>
            <Field label="Name" required error={errors.name?.[0]}>
                <input className="form-control" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </Field>
            <Field label="Email" required error={errors.email?.[0]}>
                <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    required
                />
            </Field>
            <Field
                label={initial ? 'New password' : 'Password'}
                hint={initial ? 'Leave blank to keep the current password.' : 'At least 8 characters.'}
                error={errors.password?.[0]}
                required={!initial}
            >
                <input
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    autoComplete="new-password"
                />
            </Field>
            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-light" onClick={onCancel}>
                    Cancel
                </button>
                <button className="btn btn-primary" disabled={busy}>
                    {busy ? 'Saving…' : 'Save'}
                </button>
            </div>
        </form>
    );
}

export default function Users() {
    const toast = useToast();
    const { user } = useAuth();
    const { data, loading, error, reload } = useApiResource(
        () => api.get('/users').then((r) => r.data.data),
        [],
    );
    const [editing, setEditing] = useState(null);

    const remove = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            toast('Account removed');
            reload();
        } catch (e) {
            toast(e.message || 'Delete failed', 'error');
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="page-title">Staff Accounts</h1>
                <button className="btn btn-primary" onClick={() => setEditing('new')}>
                    <i className="bi bi-person-plus me-1" />
                    Add staff
                </button>
            </div>

            {loading && <Loading />}
            {error && <ErrorNote message={error} onRetry={reload} />}

            {!loading && !error && (
                <div className="card">
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Added</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data ?? []).map((u) => (
                                    <tr key={u.id}>
                                        <td className="fw-semibold">
                                            {u.name}
                                            {u.id === user?.id && (
                                                <span className="badge text-bg-light ms-2">You</span>
                                            )}
                                        </td>
                                        <td>{u.email}</td>
                                        <td className="muted small">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => setEditing(u)}
                                            >
                                                Edit
                                            </button>
                                            {u.id !== user?.id && (
                                                <ConfirmButton onConfirm={() => remove(u.id)}>
                                                    Remove
                                                </ConfirmButton>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {editing && (
                <Modal
                    title={editing === 'new' ? 'Add staff account' : 'Edit staff account'}
                    onClose={() => setEditing(null)}
                >
                    <UserForm
                        initial={editing === 'new' ? null : editing}
                        onCancel={() => setEditing(null)}
                        onDone={() => {
                            setEditing(null);
                            reload();
                        }}
                    />
                </Modal>
            )}
        </>
    );
}
