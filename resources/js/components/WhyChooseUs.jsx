import SectionHeading from './ui/SectionHeading';
import { whyChooseUs } from '../data/siteContent';

export default function WhyChooseUs() {
    return (
        <section className="section section--surface" aria-labelledby="why-title">
            <div className="container container-tight">
                <SectionHeading
                    eyebrow="Why PERJODA"
                    title="Why Choose PERJODA?"
                    id="why-title"
                    align="center"
                >
                    The things passengers count on us for, every day.
                </SectionHeading>

                <div className="row g-4">
                    {whyChooseUs.map((feature) => (
                        <div className="col-md-6 col-lg-3" key={feature.title}>
                            <div className="feature-card text-center reveal">
                                <span className="card-icon mx-auto" aria-hidden="true">
                                    <i className={`bi ${feature.icon}`} />
                                </span>
                                <h3 className="card-title">{feature.title}</h3>
                                <p className="card-text">{feature.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
