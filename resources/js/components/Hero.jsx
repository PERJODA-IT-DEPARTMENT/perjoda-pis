import { heroPills } from '../data/siteContent';
import scrollToSection from '../utils/scrollToSection';
import HeroArt from './HeroArt';

export default function Hero() {
    return (
        <section id="home" className="hero" aria-labelledby="hero-title">
            <div className="hero__scrim" aria-hidden="true" />
            <div className="container container-tight hero__inner">
                <div className="row align-items-center g-5">
                    <div className="col-md-6">
                        <h1 id="hero-title">Moving People. Connecting Communities.</h1>
                        <p className="hero__lead mt-3">
                            Reliable transportation services built around safety, convenience, and a
                            better passenger experience.
                        </p>

                        <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 mt-4">
                            <button
                                type="button"
                                className="btn btn-accent btn-lg"
                                onClick={() => scrollToSection('services')}
                            >
                                Explore Our Services
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-light btn-lg"
                                onClick={() => scrollToSection('routes')}
                            >
                                View Route
                            </button>
                        </div>

                        <div className="hero__pills mt-4" aria-label="What PERJODA stands for">
                            {heroPills.map((pill) => (
                                <span className="hero__pill" key={pill}>
                                    <i className="bi bi-check-circle-fill" aria-hidden="true" />
                                    {pill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-6 hero__art d-none d-md-block">
                        <HeroArt />
                    </div>
                </div>
            </div>
        </section>
    );
}
