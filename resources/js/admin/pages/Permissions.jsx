import { useState } from 'react';
import api from '../api';
import { ErrorNote, Loading, useApiResource, useToast } from '../ui';

const TOGGLABLE_ROLES = ['admin', 'staff'];
const ROLE_LABEL = { admin: 'Admin', staff: 'Staff' };

function Switch({ checked, disabled, onChange, label }) {
    return (
        <div className="form-check form-switch d-inline-flex m-0">
            <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                aria-label={label}
            />
        </div>
    );
}

export default function Permissions() {
    const toast = useToast();
    const { data, loading, error, reload, setData } = useApiResource(
        () => api.get('/permissions').then((r) => r.data.data),
        [],
    );
    const [pending, setPending] = useState(null); // `${role}:${key}` currently saving

    if (loading || !data) return <Loading />;
    if (error) return <ErrorNote message={error} onRetry={reload} />;

    const { keys, roles } = data;

    const toggle = async (role, key) => {
        const current = roles[role] || [];
        const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
        const id = `${role}:${key}`;
        setPending(id);
        try {
            const res = await api.put('/permissions', { role, permissions: next });
            setData((d) => ({ ...d, roles: res.data.data.roles }));
        } catch (e) {
            toast(e.message || 'Could not update permission', 'error');
        } finally {
            setPending(null);
        }
    };

    return (
        <>
            <h1 className="page-title mb-3">Permissions</h1>
            <p className="muted">
                Switch admin panel areas on or off for the Admin and Staff roles. Superadmin always has
                full access and can&apos;t be limited here.
            </p>

            <div className="card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Area</th>
                                <th className="text-center">Superadmin</th>
                                {TOGGLABLE_ROLES.map((role) => (
                                    <th className="text-center" key={role}>
                                        {ROLE_LABEL[role]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {keys.map(({ key, label }) => (
                                <tr key={key}>
                                    <td className="fw-semibold">{label}</td>
                                    <td className="text-center">
                                        <Switch checked disabled label={`${label} — always on for Superadmin`} />
                                    </td>
                                    {TOGGLABLE_ROLES.map((role) => (
                                        <td className="text-center" key={role}>
                                            <Switch
                                                checked={(roles[role] || []).includes(key)}
                                                disabled={pending === `${role}:${key}`}
                                                onChange={() => toggle(role, key)}
                                                label={`${label} for ${ROLE_LABEL[role]}`}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
