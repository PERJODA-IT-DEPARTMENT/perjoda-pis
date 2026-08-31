import SectionHeading from './ui/SectionHeading';
import { passengerInfo } from '../data/siteContent';

export default function PassengerInformation() {
    return (
        <section
            id="passenger-info"
            className="section section--surface"
            aria-labelledby="passenger-info-title"
        >
            <div className="container container-tight">
                <SectionHeading
                    eyebrow="For Passengers"
                    title="Passenger Information"
                    id="passenger-info-title"
                    align="center"
                >
                    A quick guide to help you travel with confidence.
                </SectionHeading>

                <div className="row g-4">
                    {passengerInfo.map((item) => (
                        <div className="col-md-6 col-lg-4" key={item.title}>
                            <article className="info-card reveal">
                                <span className="card-icon" aria-hidden="true">
                                    <i className={`bi ${item.icon}`} />
                                </span>
                                <h3 className="card-title">{item.title}</h3>
                                <p className="card-text">{item.text}</p>
                            </article>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
