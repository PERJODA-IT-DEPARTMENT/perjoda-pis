import SectionHeading from './ui/SectionHeading';
import StatePanel from './ui/StatePanel';
import useResource from '../hooks/useResource';

export default function FareInformation() {
    const { data: fares, meta, loading, error, isEmpty, reload } = useResource('/fares');
    const list = Array.isArray(fares) ? fares : [];

    return (
        <section id="fares" className="section" aria-labelledby="fares-title">
            <div className="container container-tight">
                <SectionHeading eyebrow="Plan Your Budget" title="Fare Information" id="fares-title">
                    Current fares for every passenger type, in one place.
                </SectionHeading>

                <div className="row g-4">
                    <div className="col-lg-8">
                        {loading && <StatePanel variant="loading" message="Loading fare information…" />}

                        {error && (
                            <StatePanel
                                variant="error"
                                title="Unable to load fares"
                                message={error}
                                onRetry={reload}
                            />
                        )}

                        {isEmpty && (
                            <StatePanel
                                variant="empty"
                                title="No fare information"
                                message="Fare information is currently being updated. Please check back soon."
                            />
                        )}

                        {!loading && !error && list.length > 0 && (
                            <div className="fare-table reveal">
                                <table className="table align-middle mb-0">
                                    <caption className="visually-hidden">
                                        PERJODA fares by passenger type
                                    </caption>
                                    <thead>
                                        <tr>
                                            <th scope="col">Passenger Type</th>
                                            <th scope="col" className="text-end">
                                                Fare
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map((fare) => (
                                            <tr key={fare.passenger_type}>
                                                <th scope="row" className="fw-semibold text-dark">
                                                    {fare.passenger_type}
                                                    {fare.note && (
                                                        <span className="d-block fw-normal fare-note">
                                                            {fare.note}
                                                        </span>
                                                    )}
                                                </th>
                                                <td className="text-end fare-amount">{fare.fare}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="col-lg-4">
                        <div className="d-flex flex-column gap-3">
                            <div className="notice">
                                <i className="bi bi-info-circle-fill" aria-hidden="true" />
                                <span>
                                    {meta?.notice ||
                                        'Fares shown are for informational purposes and may be subject to change.'}
                                </span>
                            </div>
                            <div className="notice">
                                <i className="bi bi-person-vcard" aria-hidden="true" />
                                <span>
                                    {meta?.reminder ||
                                        'Students, senior citizens, and persons with disability are entitled to a 20% fare discount upon presentation of a valid ID.'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
