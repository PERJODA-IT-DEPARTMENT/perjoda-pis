import SectionHeading from './ui/SectionHeading';
import { useSiteContent } from '../context/SiteContentContext';

function AboutVisual() {
    return (
        <div className="about-visual reveal" aria-hidden="true">
            <svg viewBox="0 0 480 420" role="presentation">
                <rect width="480" height="420" fill="#0a3ea1" />
                <circle cx="380" cy="70" r="120" fill="#1552cc" opacity="0.35" />
                <circle cx="90" cy="360" r="140" fill="#fcd116" opacity="0.18" />
                <g stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" fill="none">
                    <path d="M40 300 C 150 220, 330 380, 440 260" />
                    <circle cx="40" cy="300" r="8" fill="#fcd116" stroke="none" />
                    <circle cx="240" cy="300" r="6" fill="#ffffff" stroke="none" />
                    <circle cx="440" cy="260" r="8" fill="#fcd116" stroke="none" />
                </g>
                <g transform="translate(150 150)">
                    <rect x="0" y="0" width="200" height="110" rx="18" fill="#ffffff" />
                    <rect x="0" y="0" width="200" height="22" rx="11" fill="#1552cc" />
                    <rect x="16" y="38" width="38" height="34" rx="6" fill="#bcd4f2" />
                    <rect x="62" y="38" width="38" height="34" rx="6" fill="#bcd4f2" />
                    <rect x="108" y="38" width="38" height="34" rx="6" fill="#bcd4f2" />
                    <rect x="154" y="38" width="30" height="34" rx="6" fill="#bcd4f2" />
                    <circle cx="46" cy="110" r="16" fill="#10233b" />
                    <circle cx="156" cy="110" r="16" fill="#10233b" />
                </g>
            </svg>
        </div>
    );
}

export default function About() {
    const { about, fleetStats } = useSiteContent();
    const { paragraphs, values } = about;

    return (
        <section id="about" className="section" aria-labelledby="about-title">
            <div className="container container-tight">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6 order-lg-1 order-2">
                        <AboutVisual />
                    </div>
                    <div className="col-lg-6 order-lg-2 order-1">
                        <SectionHeading
                            eyebrow="About Us"
                            title="About PERJODA Transport Cooperative"
                            id="about-title"
                        >
                            Reliable, safe, and accessible transportation for the communities we
                            serve.
                        </SectionHeading>
                        {paragraphs.map((text) => (
                            <p key={text.slice(0, 24)} className="text-secondary-emphasis">
                                {text}
                            </p>
                        ))}

                        <div className="fleet-strip" aria-label="PERJODA fleet at a glance">
                            {fleetStats.map((stat) => (
                                <div className="fleet-strip__item" key={stat.label}>
                                    <i className={`bi ${stat.icon}`} aria-hidden="true" />
                                    <div>
                                        <span className="fleet-strip__count">{stat.count}</span>
                                        <span className="fleet-strip__label">{stat.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="value-list">
                            {values.map((value) => (
                                <div className="value-item" key={value.title}>
                                    <i className={`bi ${value.icon}`} aria-hidden="true" />
                                    <div>
                                        <h3>{value.title}</h3>
                                        <p>{value.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
