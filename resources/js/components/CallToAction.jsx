import scrollToSection from '../utils/scrollToSection';

export default function CallToAction() {
    return (
        <section className="section" aria-labelledby="cta-title">
            <div className="container container-tight">
                <div className="cta reveal">
                    <h2 id="cta-title">Your Journey Starts With Us.</h2>
                    <p>Stay informed about our routes, services, and transportation updates.</p>
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 gap-sm-3">
                        <button
                            type="button"
                            className="btn btn-accent btn-lg"
                            onClick={() => scrollToSection('routes')}
                        >
                            View Our Route
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-light btn-lg"
                            onClick={() => scrollToSection('contact')}
                        >
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
