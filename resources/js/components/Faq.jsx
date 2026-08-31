import SectionHeading from './ui/SectionHeading';
import { useSiteContent } from '../context/SiteContentContext';
import scrollToSection from '../utils/scrollToSection';

/** Infer a "jump to section" link from the answer / question wording. */
function inferTarget(text) {
    const t = text.toLowerCase();
    if (t.includes('route section') || t.includes('route')) {
        return { target: 'routes', label: 'Go to Route' };
    }
    if (t.includes('fare')) return { target: 'fares', label: 'Go to Fare Information' };
    if (t.includes('announcement')) return { target: 'announcements', label: 'Go to Announcements' };
    if (t.includes('passenger information') || t.includes('ticket')) {
        return { target: 'passenger-info', label: 'Go to Passenger Information' };
    }
    if (t.includes('contact')) return { target: 'contact', label: 'Go to Contact' };
    return null;
}

export default function Faq() {
    const { faqs } = useSiteContent();

    return (
        <section id="faq" className="section" aria-labelledby="faq-title">
            <div className="container container-tight">
                <SectionHeading
                    eyebrow="Good to Know"
                    title="Frequently Asked Questions"
                    id="faq-title"
                    align="center"
                >
                    Quick answers to the questions passengers ask most.
                </SectionHeading>

                <div className="row">
                    <div className="col-lg-9 col-xl-8 mx-auto">
                        <div className="accordion" id="faqAccordion">
                            {faqs.map((faq, index) => {
                                const headingId = `faq-heading-${index}`;
                                const collapseId = `faq-collapse-${index}`;
                                const jump = faq.target
                                    ? { target: faq.target, label: faq.targetLabel || 'Learn more' }
                                    : inferTarget(`${faq.q} ${faq.a}`);
                                return (
                                    <div className="accordion-item" key={faq.q}>
                                        <h3 className="accordion-header" id={headingId}>
                                            <button
                                                className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#${collapseId}`}
                                                aria-expanded={index === 0 ? 'true' : 'false'}
                                                aria-controls={collapseId}
                                            >
                                                {faq.q}
                                            </button>
                                        </h3>
                                        <div
                                            id={collapseId}
                                            className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                                            aria-labelledby={headingId}
                                            data-bs-parent="#faqAccordion"
                                        >
                                            <div className="accordion-body">
                                                <p className="mb-2">{faq.a}</p>
                                                {jump && (
                                                    <button
                                                        type="button"
                                                        className="learn-more btn-link-plain"
                                                        onClick={() => scrollToSection(jump.target)}
                                                    >
                                                        {jump.label}
                                                        <i
                                                            className="bi bi-arrow-right"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
