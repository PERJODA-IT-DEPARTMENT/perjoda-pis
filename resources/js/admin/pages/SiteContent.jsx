import { useEffect, useState } from 'react';
import api from '../api';
import { ErrorNote, Field, Loading, useApiResource, useToast } from '../ui';

/* Repeatable list of plain strings */
function StringList({ items, onChange, placeholder, textarea }) {
    const set = (i, v) => onChange(items.map((x, idx) => (idx === i ? v : x)));
    const add = () => onChange([...items, '']);
    const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
    const move = (i, d) => {
        const j = i + d;
        if (j < 0 || j >= items.length) return;
        const n = [...items];
        [n[i], n[j]] = [n[j], n[i]];
        onChange(n);
    };
    return (
        <div>
            {items.map((v, i) => (
                <div className="d-flex gap-2 mb-2" key={i}>
                    {textarea ? (
                        <textarea
                            className="form-control"
                            rows={2}
                            value={v}
                            onChange={(e) => set(i, e.target.value)}
                            placeholder={placeholder}
                        />
                    ) : (
                        <input
                            className="form-control"
                            value={v}
                            onChange={(e) => set(i, e.target.value)}
                            placeholder={placeholder}
                        />
                    )}
                    <div className="d-flex flex-column gap-1">
                        <button type="button" className="btn btn-sm btn-light" onClick={() => move(i, -1)}>
                            <i className="bi bi-arrow-up" />
                        </button>
                        <button type="button" className="btn btn-sm btn-light" onClick={() => move(i, 1)}>
                            <i className="bi bi-arrow-down" />
                        </button>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(i)}>
                        <i className="bi bi-x" />
                    </button>
                </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={add}>
                <i className="bi bi-plus-lg me-1" />
                Add
            </button>
        </div>
    );
}

/* Repeatable list of objects with fixed fields */
function ObjectList({ items, fields, onChange, blank }) {
    const set = (i, k, v) => onChange(items.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));
    const add = () => onChange([...items, { ...blank }]);
    const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
    return (
        <div>
            {items.map((row, i) => (
                <div className="repeat-row" key={i}>
                    <div className="row g-2">
                        {fields.map((f) => (
                            <div className={f.col || 'col-12'} key={f.key}>
                                <label className="form-label small fw-semibold mb-1">{f.label}</label>
                                {f.textarea ? (
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows={2}
                                        value={row[f.key] || ''}
                                        onChange={(e) => set(i, f.key, e.target.value)}
                                    />
                                ) : (
                                    <input
                                        className="form-control form-control-sm"
                                        value={row[f.key] || ''}
                                        onChange={(e) => set(i, f.key, e.target.value)}
                                        placeholder={f.placeholder}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-end mt-2">
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(i)}>
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={add}>
                <i className="bi bi-plus-lg me-1" />
                Add
            </button>
        </div>
    );
}

const TABS = [
    ['contact', 'Contact & Hours'],
    ['about', 'About'],
    ['mission', 'Mission & Vision'],
    ['fleet', 'Fleet'],
    ['faq', 'FAQ'],
    ['fares', 'Fare Notices'],
];

export default function SiteContent() {
    const toast = useToast();
    const { data, loading, error, reload } = useApiResource(
        () => api.get('/site-content').then((r) => r.data.data),
        [],
    );
    const [tab, setTab] = useState('contact');
    const [draft, setDraft] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (data) setDraft(structuredClone(data));
    }, [data]);

    if (loading || !draft) return <Loading />;
    if (error) return <ErrorNote message={error} onRetry={reload} />;

    const d = draft;
    const setGroup = (key, value) => setDraft((p) => ({ ...p, [key]: value }));
    const setField = (group, key, value) =>
        setDraft((p) => ({ ...p, [group]: { ...p[group], [key]: value } }));

    const save = async (payload, label) => {
        setBusy(true);
        try {
            const res = await api.put('/site-content', payload);
            setDraft(structuredClone(res.data.data));
            toast(`${label} saved`);
        } catch (e) {
            toast(e.message || 'Could not save', 'error');
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <h1 className="page-title mb-3">Site Content</h1>
            <p className="muted">
                Edits here update the public website immediately. Route, fare, and announcement data
                are managed on their own pages.
            </p>

            <ul className="nav nav-pills flex-wrap gap-1 mb-4">
                {TABS.map(([k, label]) => (
                    <li className="nav-item" key={k}>
                        <button
                            className={`nav-link ${tab === k ? 'active' : ''}`}
                            onClick={() => setTab(k)}
                        >
                            {label}
                        </button>
                    </li>
                ))}
            </ul>

            {tab === 'contact' && (
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            {[
                                ['name', 'Short name'],
                                ['legalName', 'Full legal name'],
                                ['tagline', 'Tagline'],
                                ['email', 'Email'],
                                ['phone', 'Phone'],
                                ['mobile', 'Mobile'],
                                ['officeHours', 'Office hours'],
                                ['supportHours', 'Support hours'],
                            ].map(([k, label]) => (
                                <div className="col-md-6" key={k}>
                                    <Field label={label}>
                                        <input
                                            className="form-control"
                                            value={d.organisation[k] || ''}
                                            onChange={(e) => setField('organisation', k, e.target.value)}
                                        />
                                    </Field>
                                </div>
                            ))}
                            <div className="col-12">
                                <Field label="Office address">
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        value={d.organisation.address || ''}
                                        onChange={(e) => setField('organisation', 'address', e.target.value)}
                                    />
                                </Field>
                            </div>
                        </div>
                        <hr />
                        <p className="fw-semibold small text-uppercase muted">Quick info bar</p>
                        <div className="row">
                            {[
                                ['operatingHours', 'Operating hours'],
                                ['routeSummary', 'Route summary'],
                                ['serviceSummary', 'Service summary'],
                                ['supportSummary', 'Support summary'],
                            ].map(([k, label]) => (
                                <div className="col-md-6" key={k}>
                                    <Field label={label}>
                                        <input
                                            className="form-control"
                                            value={d.quickInfo[k] || ''}
                                            onChange={(e) => setField('quickInfo', k, e.target.value)}
                                        />
                                    </Field>
                                </div>
                            ))}
                        </div>
                        <button
                            className="btn btn-primary"
                            disabled={busy}
                            onClick={() =>
                                save({ organisation: d.organisation, quickInfo: d.quickInfo }, 'Contact details')
                            }
                        >
                            Save contact &amp; hours
                        </button>
                    </div>
                </div>
            )}

            {tab === 'about' && (
                <div className="card">
                    <div className="card-body">
                        <Field label="Paragraphs">
                            <StringList
                                items={d.about.paragraphs}
                                textarea
                                onChange={(v) => setGroup('about', { ...d.about, paragraphs: v })}
                            />
                        </Field>
                        <hr />
                        <Field label="Value cards (icon uses Bootstrap Icons class, e.g. bi-shield-check)">
                            <ObjectList
                                items={d.about.values}
                                blank={{ icon: 'bi-star', title: '', text: '' }}
                                onChange={(v) => setGroup('about', { ...d.about, values: v })}
                                fields={[
                                    { key: 'icon', label: 'Icon', col: 'col-md-3' },
                                    { key: 'title', label: 'Title', col: 'col-md-4' },
                                    { key: 'text', label: 'Text', col: 'col-md-5', textarea: true },
                                ]}
                            />
                        </Field>
                        <button
                            className="btn btn-primary"
                            disabled={busy}
                            onClick={() => save({ about: d.about }, 'About')}
                        >
                            Save About
                        </button>
                    </div>
                </div>
            )}

            {tab === 'mission' && (
                <div className="card">
                    <div className="card-body">
                        <Field label="Mission">
                            <textarea
                                className="form-control"
                                rows={3}
                                value={d.missionVision.mission || ''}
                                onChange={(e) => setField('missionVision', 'mission', e.target.value)}
                            />
                        </Field>
                        <Field label="Vision intro line">
                            <input
                                className="form-control"
                                value={d.missionVision.visionIntro || ''}
                                onChange={(e) => setField('missionVision', 'visionIntro', e.target.value)}
                            />
                        </Field>
                        <Field label="Vision points">
                            <StringList
                                items={d.missionVision.visionPoints || []}
                                textarea
                                onChange={(v) =>
                                    setGroup('missionVision', { ...d.missionVision, visionPoints: v })
                                }
                            />
                        </Field>
                        <button
                            className="btn btn-primary"
                            disabled={busy}
                            onClick={() => save({ missionVision: d.missionVision }, 'Mission & Vision')}
                        >
                            Save Mission &amp; Vision
                        </button>
                    </div>
                </div>
            )}

            {tab === 'fleet' && (
                <div className="card">
                    <div className="card-body">
                        <ObjectList
                            items={d.fleetStats}
                            blank={{ count: '', label: '', icon: 'bi-bus-front' }}
                            onChange={(v) => setGroup('fleetStats', v)}
                            fields={[
                                { key: 'count', label: 'Count', col: 'col-md-2' },
                                { key: 'label', label: 'Label', col: 'col-md-6' },
                                { key: 'icon', label: 'Icon', col: 'col-md-4' },
                            ]}
                        />
                        <button
                            className="btn btn-primary mt-2"
                            disabled={busy}
                            onClick={() => save({ fleetStats: d.fleetStats }, 'Fleet')}
                        >
                            Save Fleet
                        </button>
                    </div>
                </div>
            )}

            {tab === 'faq' && (
                <div className="card">
                    <div className="card-body">
                        <ObjectList
                            items={d.faqs}
                            blank={{ q: '', a: '' }}
                            onChange={(v) => setGroup('faqs', v)}
                            fields={[
                                { key: 'q', label: 'Question', col: 'col-12' },
                                { key: 'a', label: 'Answer', col: 'col-12', textarea: true },
                            ]}
                        />
                        <button
                            className="btn btn-primary mt-2"
                            disabled={busy}
                            onClick={() => save({ faqs: d.faqs }, 'FAQ')}
                        >
                            Save FAQ
                        </button>
                    </div>
                </div>
            )}

            {tab === 'fares' && (
                <div className="card">
                    <div className="card-body">
                        <Field label="Notice">
                            <input
                                className="form-control"
                                value={d.fareNotices.notice || ''}
                                onChange={(e) => setField('fareNotices', 'notice', e.target.value)}
                            />
                        </Field>
                        <Field label="Discount reminder">
                            <input
                                className="form-control"
                                value={d.fareNotices.reminder || ''}
                                onChange={(e) => setField('fareNotices', 'reminder', e.target.value)}
                            />
                        </Field>
                        <button
                            className="btn btn-primary"
                            disabled={busy}
                            onClick={() => save({ fareNotices: d.fareNotices }, 'Fare notices')}
                        >
                            Save fare notices
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
