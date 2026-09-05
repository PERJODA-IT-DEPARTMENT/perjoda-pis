import { useRef, useState } from 'react';
import SectionHeading from './ui/SectionHeading';
import { useSiteContent } from '../context/SiteContentContext';

export default function Showcase() {
    const { showcase } = useSiteContent();
    const { title, description, videos } = showcase;
    const count = videos?.length || 0;

    const [active, setActive] = useState(0);
    const [muted, setMuted] = useState(true);
    const [orientations, setOrientations] = useState({});
    const videoRefs = useRef([]);

    const playAt = (index) => {
        const el = videoRefs.current[index];
        if (!el) return;
        el.currentTime = 0;
        el.play().catch(() => {});
    };

    const goTo = (i) => {
        videoRefs.current[active]?.pause();
        const next = ((i % count) + count) % count;
        setActive(next);
        // The element is already mounted (all slides render, only the active
        // one is visible) so play immediately rather than waiting on an effect.
        requestAnimationFrame(() => playAt(next));
    };
    const next = () => goTo(active + 1);
    const prev = () => goTo(active - 1);

    const handleLoadedMetadata = (index) => (e) => {
        const { videoWidth, videoHeight } = e.target;
        if (!videoWidth || !videoHeight) return;
        const orientation = videoHeight > videoWidth ? 'portrait' : 'landscape';
        setOrientations((prev) => (prev[index] === orientation ? prev : { ...prev, [index]: orientation }));
    };

    if (count === 0) {
        return (
            <section id="showcase" className="section" aria-labelledby="showcase-title">
                <div className="container container-tight">
                    <SectionHeading
                        eyebrow="Our Operations"
                        title={title || 'See PERJODA in Motion'}
                        id="showcase-title"
                        align="center"
                    >
                        {description ||
                            'A closer look at our fleet, our routes, and the everyday journeys we make possible.'}
                    </SectionHeading>
                    <div className="showcase-frame showcase-frame--landscape reveal">
                        <div className="showcase-placeholder">
                            <i className="bi bi-play-circle" aria-hidden="true" />
                            <p>Our operations showcase video is coming soon.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const orientation = orientations[active] || 'landscape';

    return (
        <section id="showcase" className="section" aria-labelledby="showcase-title">
            <div className="container container-tight">
                <SectionHeading
                    eyebrow="Our Operations"
                    title={title || 'See PERJODA in Motion'}
                    id="showcase-title"
                    align="center"
                >
                    {description ||
                        'A closer look at our fleet, our routes, and the everyday journeys we make possible.'}
                </SectionHeading>

                <div className="showcase-toolbar">
                    <button type="button" className="showcase-mute-btn" onClick={() => setMuted((m) => !m)}>
                        <i
                            className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}
                            aria-hidden="true"
                        />
                        {muted ? 'Unmute' : 'Mute'}
                    </button>
                </div>

                <div className="showcase-slider reveal">
                    {count > 1 && (
                        <button
                            type="button"
                            className="showcase-nav showcase-nav--prev"
                            onClick={prev}
                            aria-label="Previous video"
                        >
                            <i className="bi bi-chevron-left" aria-hidden="true" />
                        </button>
                    )}

                    <div className={`showcase-frame showcase-frame--${orientation}`}>
                        {videos.map((v, i) => (
                            <video
                                key={v.videoUrl}
                                ref={(el) => (videoRefs.current[i] = el)}
                                className={`showcase-video ${i === active ? 'is-active' : ''}`}
                                muted={muted}
                                loop={count === 1}
                                playsInline
                                preload={i === active ? 'auto' : 'metadata'}
                                autoPlay={i === active}
                                onLoadedMetadata={handleLoadedMetadata(i)}
                                onEnded={() => i === active && count > 1 && next()}
                            >
                                <source src={v.videoUrl} />
                            </video>
                        ))}
                        {videos[active]?.title && (
                            <div className="showcase-caption">{videos[active].title}</div>
                        )}
                    </div>

                    {count > 1 && (
                        <button
                            type="button"
                            className="showcase-nav showcase-nav--next"
                            onClick={next}
                            aria-label="Next video"
                        >
                            <i className="bi bi-chevron-right" aria-hidden="true" />
                        </button>
                    )}
                </div>

                {count > 1 && (
                    <div className="showcase-dots" role="tablist" aria-label="Showcase videos">
                        {videos.map((v, i) => (
                            <button
                                key={v.videoUrl}
                                type="button"
                                role="tab"
                                aria-selected={i === active}
                                aria-label={`Show video ${i + 1}${v.title ? `: ${v.title}` : ''}`}
                                className={`showcase-dot ${i === active ? 'is-active' : ''}`}
                                onClick={() => goTo(i)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
