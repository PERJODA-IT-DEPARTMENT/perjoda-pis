import { useEffect, useState } from 'react';
import api from '../api';
import { ConfirmButton, ErrorNote, Field, Loading, Modal, useApiResource, useToast } from '../ui';

const BLANK = { passenger_type: '', amount: '', note: '', is_active: true, sort_order: 0 };

function FareForm({ initial, onDone, onCancel }) {
    const toast = useToast();
    const [form, setForm] = useState({ ...BLANK, ...initial, amount: initial?.amount ?? '' });
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors({});
        const payload = {
            ...form,
            amount: form.amount === '' ? null : Number(form.amount),
            sort_order: Number(form.sort_order) || 0,
        };
        try {
            if (initial?.id) {
                await api.put(`/fares/${initial.id}`, payload);
                toast('Fare updated');
            } else {
                await api.post('/fares', payload);
                toast('Fare added');
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
            <Field label="Passenger type" required error={errors.passenger_type?.[0]}>
                <input
                    className="form-control"
                    value={form.passenger_type}
                    onChange={(e) => set('passenger_type', e.target.value)}
                    required
                />
            </Field>
            <div className="row">
                <div className="col-6">
                    <Field label="Amount (₱)" hint="Leave blank for “To be announced”." error={errors.amount?.[0]}>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            value={form.amount}
                            onChange={(e) => set('amount', e.target.value)}
                        />
                    </Field>
                </div>
                <div className="col-6">
                    <Field label="Sort order" error={errors.sort_order?.[0]}>
                        <input
                            type="number"
                            className="form-control"
                            value={form.sort_order}
                            onChange={(e) => set('sort_order', e.target.value)}
                        />
                    </Field>
                </div>
            </div>
            <Field label="Note" error={errors.note?.[0]}>
                <input
                    className="form-control"
                    value={form.note || ''}
                    onChange={(e) => set('note', e.target.value)}
                />
            </Field>
            <Field>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="fare-active"
                        checked={form.is_active}
                        onChange={(e) => set('is_active', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="fare-active">
                        Active
                    </label>
                </div>
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

export default function Fares() {
    const toast = useToast();
    const { data, loading, error, reload } = useApiResource(
        () => api.get('/fares').then((r) => r.data),
        [],
    );
    const [editing, setEditing] = useState(null);
    const [notices, setNotices] = useState({ notice: '', reminder: '' });
    const [savingNotices, setSavingNotices] = useState(false);

    useEffect(() => {
        if (data?.notices) setNotices(data.notices);
    }, [data]);

    const remove = async (id) => {
        try {
            await api.delete(`/fares/${id}`);
            toast('Fare deleted');
            reload();
        } catch (e) {
            toast(e.message || 'Delete failed', 'error');
        }
    };

    const saveNotices = async () => {
        setSavingNotices(true);
        try {
            await api.put('/fares-notices', notices);
            toast('Notices saved');
        } catch (e) {
            toast(e.message || 'Could not save', 'error');
        } finally {
            setSavingNotices(false);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="page-title">Fares</h1>
                <button className="btn btn-primary" onClick={() => setEditing('new')}>
                    <i className="bi bi-plus-lg me-1" />
                    Add fare
                </button>
            </div>

            {loading && <Loading />}
            {error && <ErrorNote message={error} onRetry={reload} />}

            {!loading && !error && (
                <>
                    <div className="card mb-4">
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Passenger type</th>
                                        <th>Amount</th>
                                        <th>Note</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(data?.data ?? []).map((f) => (
                                        <tr key={f.id}>
                                            <td className="fw-semibold">{f.passenger_type}</td>
                                            <td>{f.amount != null ? `₱${Number(f.amount).toFixed(2)}` : '—'}</td>
                                            <td className="muted small">{f.note || '—'}</td>
                                            <td>
                                                {f.is_active ? (
                                                    <span className="badge text-bg-success">Active</span>
                                                ) : (
                                                    <span className="badge text-bg-secondary">Hidden</span>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => setEditing(f)}
                                                >
                                                    Edit
                                                </button>
                                                <ConfirmButton onConfirm={() => remove(f.id)}>
                                                    Delete
                                                </ConfirmButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header bg-white fw-semibold">Fare notices (shown beside the table)</div>
                        <div className="card-body">
                            <Field label="Notice">
                                <input
                                    className="form-control"
                                    value={notices.notice || ''}
                                    onChange={(e) => setNotices((n) => ({ ...n, notice: e.target.value }))}
                                />
                            </Field>
                            <Field label="Discount reminder">
                                <input
                                    className="form-control"
                                    value={notices.reminder || ''}
                                    onChange={(e) => setNotices((n) => ({ ...n, reminder: e.target.value }))}
                                />
                            </Field>
                            <button className="btn btn-primary" onClick={saveNotices} disabled={savingNotices}>
                                {savingNotices ? 'Saving…' : 'Save notices'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {editing && (
                <Modal
                    title={editing === 'new' ? 'Add fare' : 'Edit fare'}
                    onClose={() => setEditing(null)}
                >
                    <FareForm
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
