import { useState } from 'react';
import api from '../api';
import { ConfirmButton, ErrorNote, Field, Loading, Modal, useApiResource, useToast } from '../ui';

const BLANK = {
    title: '',
    category: 'Announcement',
    excerpt: '',
    content: '',
    image: '',
    published_at: new Date().toISOString().slice(0, 10),
    is_published: true,
};

function toDateInput(v) {
    if (!v) return '';
    return String(v).slice(0, 10);
}

function Form({ initial, onDone, onCancel }) {
    const toast = useToast();
    const [form, setForm] = useState({
        ...BLANK,
        ...initial,
        published_at: toDateInput(initial?.published_at) || BLANK.published_at,
    });
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const [uploading, setUploading] = useState(false);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const upload = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await api.post('/uploads', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set('image', res.data.data.url);
            toast('Image uploaded');
        } catch (e) {
            toast(e.message || 'Upload failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors({});
        const payload = {
            ...form,
            published_at: form.published_at || null,
        };
        try {
            if (initial?.id) {
                await api.put(`/announcements/${initial.id}`, payload);
                toast('Announcement updated');
            } else {
                await api.post('/announcements', payload);
                toast('Announcement created');
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
        <form onSubmit={submit} id="announcement-form">
            <Field label="Title" required error={errors.title?.[0]}>
                <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    required
                />
            </Field>
            <div className="row">
                <div className="col-sm-6">
                    <Field label="Category" required error={errors.category?.[0]}>
                        <input
                            className="form-control"
                            value={form.category}
                            onChange={(e) => set('category', e.target.value)}
                            list="cat-options"
                        />
                        <datalist id="cat-options">
                            <option value="Announcement" />
                            <option value="Service Advisory" />
                            <option value="Passenger Reminder" />
                        </datalist>
                    </Field>
                </div>
                <div className="col-sm-6">
                    <Field label="Publish date" error={errors.published_at?.[0]}>
                        <input
                            type="date"
                            className="form-control"
                            value={form.published_at}
                            onChange={(e) => set('published_at', e.target.value)}
                        />
                    </Field>
                </div>
            </div>
            <Field label="Excerpt" hint="Short summary shown on the card. Optional." error={errors.excerpt?.[0]}>
                <input
                    className="form-control"
                    value={form.excerpt || ''}
                    onChange={(e) => set('excerpt', e.target.value)}
                    maxLength={255}
                />
            </Field>
            <Field label="Content" required error={errors.content?.[0]}>
                <textarea
                    className="form-control"
                    rows={6}
                    value={form.content}
                    onChange={(e) => set('content', e.target.value)}
                    required
                />
            </Field>
            <Field label="Image" hint="Upload a JPG/PNG/WebP, or paste an image URL." error={errors.image?.[0]}>
                <div className="d-flex gap-2 align-items-center flex-wrap">
                    <input
                        className="form-control"
                        style={{ maxWidth: 360 }}
                        value={form.image || ''}
                        onChange={(e) => set('image', e.target.value)}
                        placeholder="https://…"
                    />
                    <label className="btn btn-outline-secondary btn-sm mb-0">
                        {uploading ? 'Uploading…' : 'Upload'}
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => upload(e.target.files?.[0])}
                        />
                    </label>
                </div>
                {form.image && (
                    <img
                        src={form.image}
                        alt=""
                        className="mt-2 rounded border"
                        style={{ maxHeight: 90 }}
                    />
                )}
            </Field>
            <Field error={errors.is_published?.[0]}>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="is_published"
                        checked={form.is_published}
                        onChange={(e) => set('is_published', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="is_published">
                        Published (visible on the public site)
                    </label>
                </div>
            </Field>

            <div className="d-flex justify-content-end gap-2 mt-2">
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

export default function Announcements() {
    const toast = useToast();
    const { data, loading, error, reload } = useApiResource(
        () => api.get('/announcements').then((r) => r.data.data),
        [],
    );
    const [editing, setEditing] = useState(null); // object | 'new' | null

    const remove = async (id) => {
        try {
            await api.delete(`/announcements/${id}`);
            toast('Announcement deleted');
            reload();
        } catch (e) {
            toast(e.message || 'Delete failed', 'error');
        }
    };

    const rows = data?.data ?? [];

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="page-title">Announcements</h1>
                <button className="btn btn-primary" onClick={() => setEditing('new')}>
                    <i className="bi bi-plus-lg me-1" />
                    New announcement
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
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Publish date</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center muted py-4">
                                            No announcements yet.
                                        </td>
                                    </tr>
                                )}
                                {rows.map((a) => (
                                    <tr key={a.id}>
                                        <td className="fw-semibold">{a.title}</td>
                                        <td>{a.category}</td>
                                        <td className="muted small">{toDateInput(a.published_at) || '—'}</td>
                                        <td>
                                            {a.is_published ? (
                                                <span className="badge text-bg-success">Published</span>
                                            ) : (
                                                <span className="badge text-bg-secondary">Draft</span>
                                            )}
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => setEditing(a)}
                                            >
                                                Edit
                                            </button>
                                            <ConfirmButton onConfirm={() => remove(a.id)}>
                                                Delete
                                            </ConfirmButton>
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
                    title={editing === 'new' ? 'New announcement' : 'Edit announcement'}
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
