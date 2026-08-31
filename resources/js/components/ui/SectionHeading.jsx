/**
 * Consistent section header: eyebrow label + heading + optional intro.
 */
export default function SectionHeading({ eyebrow, title, children, align = 'start', id }) {
    return (
        <div
            className={`section-heading mb-4 mb-lg-5 ${align === 'center' ? 'mx-auto text-center' : ''}`}
        >
            {eyebrow && (
                <span className="eyebrow">
                    <i className="bi bi-dash-lg" aria-hidden="true" />
                    {eyebrow}
                </span>
            )}
            <h2 id={id}>{title}</h2>
            {children && <p>{children}</p>}
        </div>
    );
}
