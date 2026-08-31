import SectionHeading from './ui/SectionHeading';
import { services } from '../data/siteContent';
import scrollToSection from '../utils/scrollToSection';

export default function Services() {
    return (
        <section id="services" className="section" aria-labelledby="services-title">
            <div className="container container-tight">
                <SectionHeading
                    eyebrow="What We Do"
                    title="Our Transportation Services"
                    id="services-title"
                    align="center"
                >
                    Everyday services focused on getting passengers where they need to go, safely and
                    on time.
                </SectionHeading>

                <div className="row g-4">
                    {services.map((service) => (
                        <div className="col-md-6 col-lg-3" key={service.title}>
                            <article className="service-card reveal">
                                <span className="card-icon" aria-hidden="true">
                                    <i className={`bi ${service.icon}`} />
                                </span>
                                <h3 className="card-title">{service.title}</h3>
                                <p className="card-text">{service.text}</p>
                                <button
                                    type="button"
                                    className="learn-more btn-link-plain"
                                    onClick={() => scrollToSection('contact')}
                                >
                                    Learn more
                                    <i className="bi bi-arrow-right" aria-hidden="true" />
                                </button>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
