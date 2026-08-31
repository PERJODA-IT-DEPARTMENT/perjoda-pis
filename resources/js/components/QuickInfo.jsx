import { useSiteContent } from '../context/SiteContentContext';

export default function QuickInfo() {
    const { quickInfo } = useSiteContent();

    const items = [
        { icon: 'bi-clock-history', label: 'Operating Hours', value: quickInfo.operatingHours },
        { icon: 'bi-signpost-split', label: 'Route', value: quickInfo.routeSummary },
        { icon: 'bi-bus-front', label: 'Service', value: quickInfo.serviceSummary },
        { icon: 'bi-headset', label: 'Support', value: quickInfo.supportSummary },
    ];

    return (
        <div className="container container-tight quick-info">
            <div className="quick-info__card reveal">
                <div className="row g-0">
                    {items.map((item) => (
                        <div className="col-12 col-sm-6 col-lg-3" key={item.label}>
                            <div className="quick-info__item h-100">
                                <span className="quick-info__icon" aria-hidden="true">
                                    <i className={`bi ${item.icon}`} />
                                </span>
                                <div>
                                    <p className="quick-info__label">{item.label}</p>
                                    <p className="quick-info__value mb-0">{item.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
