import { useEffect, useState } from 'react';
import SectionHeading from './ui/SectionHeading';
import StatePanel from './ui/StatePanel';
import RouteVisualization from './RouteVisualization';
import useResource from '../hooks/useResource';
import scrollToSection from '../utils/scrollToSection';

function RouteCard({ route, isSelected, onSelect, single }) {
    return (
        <article className={`route-card reveal ${isSelected ? 'route-card--active' : ''}`}>
            <div className="route-card__head">
                <i className="bi bi-bus-front text-primary" aria-hidden="true" />
                <span>{route.name}</span>
            </div>
            <span className="route-card__badge">{route.service_type || 'Regular Service'}</span>
            {route.description && <p className="card-text mb-3">{route.description}</p>}
            <p className="route-card__hours mb-3">
                <i className="bi bi-clock" aria-hidden="true" />
                {route.operating_hours || 'Operating hours to be announced'}
            </p>
            <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={onSelect}
                aria-controls="route-visualisation"
            >
                {single ? 'View Route Map' : isSelected ? 'Showing on map' : 'View on map'}
                <i className="bi bi-arrow-down-short ms-1" aria-hidden="true" />
            </button>
        </article>
    );
}

export default function Routes() {
    const { data: routes, loading, error, isEmpty, reload } = useResource('/routes');
    const [selectedId, setSelectedId] = useState(null);

    const list = Array.isArray(routes) ? routes : [];
    const single = list.length === 1;

    useEffect(() => {
        if (list.length > 0 && selectedId === null) {
            setSelectedId(list[0].id);
        }
    }, [list, selectedId]);

    const selectedRoute = list.find((route) => route.id === selectedId) || null;

    const handleSelect = (id) => {
        setSelectedId(id);
        scrollToSection('route-visualisation');
    };

    return (
        <section id="routes" className="section section--surface" aria-labelledby="routes-title">
            <div className="container container-tight">
                <SectionHeading
                    eyebrow="Where We Go"
                    title={single ? 'Our Route' : 'Our Routes'}
                    id="routes-title"
                >
                    {single
                        ? 'Get to know the route we serve and plan your journey with ease.'
                        : 'Explore the routes we serve and plan your journey with ease.'}
                </SectionHeading>

                {loading && <StatePanel variant="loading" message="Loading route information…" />}

                {error && (
                    <StatePanel
                        variant="error"
                        title="Unable to load route information"
                        message={error}
                        onRetry={reload}
                    />
                )}

                {isEmpty && (
                    <StatePanel
                        variant="empty"
                        title="No route information"
                        message="Route information is currently unavailable. Please check back soon."
                    />
                )}

                {!loading && !error && list.length > 0 && (
                    <>
                        <div className="row g-4 justify-content-center">
                            {list.map((route) => (
                                <div
                                    className={single ? 'col-lg-8' : 'col-md-6 col-lg-4'}
                                    key={route.id}
                                >
                                    <RouteCard
                                        route={route}
                                        single={single}
                                        isSelected={selectedId === route.id}
                                        onSelect={() => handleSelect(route.id)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="row mt-5" id="route-visualisation">
                            <div className="col-lg-9 col-xl-7 mx-auto">
                                <h3 className="h6 text-uppercase text-muted mb-3">
                                    Route Visualization
                                </h3>
                                {selectedRoute ? (
                                    <RouteVisualization route={selectedRoute} />
                                ) : (
                                    <p className="text-muted">
                                        Select a route above to see its stops.
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
