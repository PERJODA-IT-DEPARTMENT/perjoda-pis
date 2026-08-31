import { useState } from 'react';
import api from '../api';
import { ConfirmButton, ErrorNote, Field, Loading, Modal, useApiResource, useToast } from '../ui';

const BLANK = {
    name: '',
    origin: '',
    destination: '',
    description: '',
    service_type: 'Regular Service',
    operating_hours: '',
    sort_order: 0,
    is_active: true,
    stops: [''],
};

function StopsEditor({ stops, onChange }) {
    const set = (i, v) => onChange(stops.map((s, idx) => (idx === i ? v : s)));
    const add = () => onChange([...stops, '']);
    const remove = (i) => onChange(stops.filter((_, idx) => idx !== i));
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= stops.length) return;
        const next = [...stops];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    };

    return (
        <div>
            {stops.map((s, i) => (
                <div className="d-flex gap-2 mb-2 align-items-center" key={i}>
                    <span className="muted small" style={{ width: 22 }}>
                        {i + 1}
                    </span>
                    <input
                        className="form-control form-control-sm"
                        value={s}
                        onChange={(e) => set(i, e.target.value)}
                        placeholder={`Stop ${i + 1}`}
                    />
                    <button type="button" className="btn btn-sm btn-light" onClick={() => move(i, -1)} title="Move up">
                        <i className="bi bi-arrow-up" />
                    </button>
                    <button type="button" className="btn btn-sm btn-light" onClick={() => move(i, 1)} title="Move down">
                        <i className="bi bi-arrow-down" />
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(i)}
                        title="Remove"
                    >
                        <i className="bi bi-x" />
                    </button>
                </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={add}>
                <i className="bi bi-plus-lg me-1" />
                Add stop
            </button>
        </div>
    );
}

function Form({ initial, onDone, onCancel }) {
    const toast = useToast();
    const [form, setForm] = useState(() => ({
        ...BLANK,
        ...initial,
        stops: initial?.stops?.length ? initial.stops.map((s) => s.name ?? s) : [''],
    }));
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors({});
        const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
        try {
            if (initial?.id) {
                await api.put(`/routes/${initial.id}`, payload);
                toast('Route updated');
            } else {
                await api.post('/routes', payload);
                toast('Route created');
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
            <Field label="Route name" required error={errors.name?.[0]}>
                <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="SM Pala-Pala ↔ EPZA (Rosario)"
                    required
                />
            </Field>
            <div className="row">
                <div className="col-sm-6">
                    <Field label="Origin" error={errors.origin?.[0]}>
                        <input className="form-control" value={form.origin || ''} onChange={(e) => set('origin', e.target.value)} />
                    </Field>
                </div>
                <div className="col-sm-6">
                    <Field label="Destination" error={errors.destination?.[0]}>
                        <input
                            className="form-control"
                            value={form.destination || ''}
                            onChange={(e) => set('destination', e.target.value)}
                        />
                    </Field>
                </div>
            </div>
            <Field label="Description" error={errors.description?.[0]}>
                <textarea
                    className="form-control"
                    rows={2}
                    value={form.description || ''}
                    onChange={(e) => set('description', e.target.value)}
                />
            </Field>
            <div className="row">
                <div className="col-sm-4">
                    <Field label="Service type" error={errors.service_type?.[0]}>
                        <input
                            className="form-control"
                            value={form.service_type || ''}
                            onChange={(e) => set('service_type', e.target.value)}
                        />
                    </Field>
                </div>
                <div className="col-sm-5">
                    <Field label="Operating hours" error={errors.operating_hours?.[0]}>
                        <input
                            className="form-control"
                            value={form.operating_hours || ''}
                            onChange={(e) => set('operating_hours', e.target.value)}
                            placeholder="5:00 AM – 10:00 PM"
                        />
                    </Field>
                </div>
                <div className="col-sm-3">
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
            <Field label="Stops (in travel order)">
                <StopsEditor stops={form.stops} onChange={(s) => set('stops', s)} />
            </Field>
            <Field>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="route-active"
                        checked={form.is_active}
                        onChange={(e) => set('is_active', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="route-active">
                        Active (shown on the public site)
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

export default function RoutesPage() {
    const toast = useToast();
    const { data, loading, error, reload } = useApiResource(
        () => api.get('/routes').then((r) => r.data.data),
        [],
    );
    const [editing, setEditing] = useState(null);

    const remove = async (id) => {
        try {
            await api.delete(`/routes/${id}`);
            toast('Route deleted');
            reload();
        } catch (e) {
            toast(e.message || 'Delete failed', 'error');
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="page-title">Routes &amp; Stops</h1>
                <button className="btn btn-primary" onClick={() => setEditing('new')}>
                    <i className="bi bi-plus-lg me-1" />
                    New route
                </button>
            </div>

            {loading && <Loading />}
            {error && <ErrorNote message={error} onRetry={reload} />}

            {!loading && !error && (
                <div className="row g-3">
                    {(data ?? []).length === 0 && <p className="muted">No routes yet.</p>}
                    {(data ?? []).map((r) => (
                        <div className="col-12" key={r.id}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h2 className="h6 mb-1">
                                                {r.name}{' '}
                                                {r.is_active ? (
                                                    <span className="badge text-bg-success ms-1">Active</span>
                                                ) : (
                                                    <span className="badge text-bg-secondary ms-1">Hidden</span>
                                                )}
                                            </h2>
                                            <p className="muted small mb-2">
                                                {r.operating_hours || 'No hours set'} ·{' '}
                                                {r.stops?.length || 0} stops
                                            </p>
                                        </div>
                                        <div className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => setEditing(r)}
                                            >
                                                Edit
                                            </button>
                                            <ConfirmButton onConfirm={() => remove(r.id)}>
                                                Delete
                                            </ConfirmButton>
                                        </div>
                                    </div>
                                    <div className="small">
                                        {(r.stops ?? []).map((s) => s.name).join('  →  ')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editing && (
                <Modal
                    title={editing === 'new' ? 'New route' : 'Edit route'}
                    size="modal-lg"
                    onClose={() => setEditing(null)}
                >
                    <Form
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
