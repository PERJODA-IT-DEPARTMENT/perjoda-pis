/**
 * Simple, responsive stop-by-stop visualisation of a single route.
 * Uses the real stops returned by the API; renders nothing fake.
 */
export default function RouteVisualization({ route }) {
    if (!route) return null;

    const stops = Array.isArray(route.stops) ? route.stops : [];

    return (
        <div className="route-viz reveal">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <p className="route-viz__title mb-0">
                    <i className="bi bi-signpost-2 me-2" aria-hidden="true" />
                    {route.name}
                </p>
                {route.operating_hours && (
                    <span className="route-card__hours">
                        <i className="bi bi-clock" aria-hidden="true" />
                        {route.operating_hours}
                    </span>
                )}
            </div>

            {stops.length > 0 ? (
                <ol className="route-line" aria-label={`Stops for ${route.name}`}>
                    {stops.map((stop, index) => {
                        const isEndpoint = index === 0 || index === stops.length - 1;
                        return (
                            <li key={`${stop}-${index}`} className={isEndpoint ? 'is-endpoint' : ''}>
                                {stop}
                            </li>
                        );
                    })}
                </ol>
            ) : (
                <p className="text-muted mt-3 mb-0">
                    Detailed stop information for this route is currently being updated.
                </p>
            )}
        </div>
    );
}
