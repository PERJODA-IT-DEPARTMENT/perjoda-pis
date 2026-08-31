import { useSiteContent } from '../context/SiteContentContext';

export default function MissionVision() {
    const { missionVision } = useSiteContent();

    return (
        <section className="section section--surface" aria-labelledby="mv-title">
            <div className="container container-tight">
                <h2 id="mv-title" className="visually-hidden">
                    Our Mission and Vision
                </h2>
                <div className="row g-4">
                    <div className="col-lg-6">
                        <article className="mv-card mv-card--mission reveal h-100">
                            <span className="mv-card__icon" aria-hidden="true">
                                <i className="bi bi-compass" />
                            </span>
                            <h3>Our Mission</h3>
                            <p>{missionVision.mission}</p>
                        </article>
                    </div>
                    <div className="col-lg-6">
                        <article className="mv-card mv-card--vision reveal h-100">
                            <span className="mv-card__icon" aria-hidden="true">
                                <i className="bi bi-binoculars" />
                            </span>
                            <h3>Our Vision</h3>
                            <p className="mb-2">{missionVision.visionIntro}</p>
                            <ul className="mv-card__list">
                                {(missionVision.visionPoints || []).map((point) => (
                                    <li key={point.slice(0, 32)}>{point}</li>
                                ))}
                            </ul>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
}
