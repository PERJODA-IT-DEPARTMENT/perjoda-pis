import { useState } from 'react';
import SectionHeading from './ui/SectionHeading';
import StatePanel from './ui/StatePanel';
import useResource from '../hooks/useResource';

function formatDate(value) {
    if (!value) return '';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
}

function AnnouncementCard({ announcement }) {
    const [expanded, setExpanded] = useState(false);
    const bodyId = `announcement-body-${announcement.id}`;

    return (
        <article className="announcement-card reveal h-100 d-flex flex-column">
            <div className="announcement-card__meta">
                <span
                    className={`tag ${/advisory|alert/i.test(announcement.category) ? 'tag--alert' : ''}`}
                >
                    {announcement.category}
                </span>
                <span className="announcement-card__date">
                    <i className="bi bi-calendar3" aria-hidden="true" />
                    {formatDate(announcement.published_at)}
                </span>
            </div>
            <h3 className="card-title">{announcement.title}</h3>
            <p className="card-text flex-grow-1" id={bodyId}>
                {expanded ? announcement.content : announcement.excerpt}
            </p>
            <button
                type="button"
                className="learn-more btn-link-plain align-self-start"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                aria-controls={bodyId}
            >
                {expanded ? 'Show less' : 'Read more'}
                <i
                    className={`bi ${expanded ? 'bi-chevron-up' : 'bi-arrow-right'}`}
                    aria-hidden="true"
                />
            </button>
        </article>
    );
}

export default function Announcements() {
    const { data, loading, error, isEmpty, reload } = useResource('/announcements', {
        params: { limit: 6 },
    });
    const list = Array.isArray(data) ? data : [];

    return (
        <section id="announcements" className="section" aria-labelledby="announcements-title">
            <div className="container container-tight">
                <SectionHeading
                    eyebrow="Stay Updated"
                    title="Latest Announcements"
                    id="announcements-title"
                >
                    Service advisories and updates from PERJODA.
                </SectionHeading>

                {loading && <StatePanel variant="loading" message="Loading announcements…" />}

                {error && (
                    <StatePanel
                        variant="error"
                        title="Unable to load announcements"
                        message={error}
                        onRetry={reload}
                    />
                )}

                {isEmpty && (
                    <StatePanel
                        variant="empty"
                        title="No announcements yet"
                        message="No announcements are currently available. Please check back soon."
                    />
                )}

                {!loading && !error && list.length > 0 && (
                    <div className="row g-4">
                        {list.map((announcement) => (
                            <div className="col-md-6 col-lg-4" key={announcement.id}>
                                <AnnouncementCard announcement={announcement} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
