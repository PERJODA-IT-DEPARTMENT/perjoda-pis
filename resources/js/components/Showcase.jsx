import { useEffect, useRef, useState } from 'react';
import SectionHeading from './ui/SectionHeading';
import { useSiteContent } from '../context/SiteContentContext';

export default function Showcase() {
    const { showcase } = useSiteContent();
    const { title, description, videos } = showcase;
    const count = videos?.length || 0;

    const [active, setActive] = useState(0);
    const [muted, setMuted] = useState(true);
    const videoRefs = useRef([]);

    useEffect(() => {
        if (active >= count) setActive(0);
    }, [count, active]);

    useEffect(() => {
        videoRefs.current.forEach((el, i) => {
            if (!el) return;
            if (i === active) {
                el.currentTime = 0;
                el.play().catch(() => {});
            } else {
                el.pause();
            }
        });
    }, [active, count]);

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
                    <div className="showcase-frame reveal">
                        <div className="showcase-placeholder">
                            <i className="bi bi-play-circle" aria-hidden="true" />
                            <p>Our operations showcase video is coming soon.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const goTo = (i) => setActive(((i % count) + count) % count);
    const next = () => goTo(active + 1);
    const prev = () => goTo(active - 1);

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

                <div className="showcase-frame reveal">
                    {videos.map((v, i) => (
                        <video
                            key={v.videoUrl + i}
                            ref={(el) => (videoRefs.current[i] = el)}
                            className={`showcase-video ${i === active ? 'is-active' : ''}`}
                            muted={muted}
                            loop={count === 1}
                            playsInline
                            preload={i === active ? 'auto' : 'none'}
                            onEnded={() => i === active && count > 1 && next()}
                        >
                            <source src={v.videoUrl} />
                        </video>
                    ))}

                    <button
                        type="button"
                        className="showcase-mute-btn"
                        onClick={() => setMuted((m) => !m)}
                        aria-label={muted ? 'Unmute video' : 'Mute video'}
                    >
                        <i
                            className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}
                            aria-hidden="true"
                        />
                    </button>

                    {videos[active]?.title && <div className="showcase-caption">{videos[active].title}</div>}

                    {count > 1 && (
                        <>
                            <button
                                type="button"
                                className="showcase-nav showcase-nav--prev"
                                onClick={prev}
                                aria-label="Previous video"
                            >
                                <i className="bi bi-chevron-left" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                className="showcase-nav showcase-nav--next"
                                onClick={next}
                                aria-label="Next video"
                            >
                                <i className="bi bi-chevron-right" aria-hidden="true" />
                            </button>

                            <div className="showcase-dots" role="tablist" aria-label="Showcase videos">
                                {videos.map((v, i) => (
                                    <button
                                        key={v.videoUrl + i}
                                        type="button"
                                        role="tab"
                                        aria-selected={i === active}
                                        aria-label={`Show video ${i + 1}${v.title ? `: ${v.title}` : ''}`}
                                        className={`showcase-dot ${i === active ? 'is-active' : ''}`}
                                        onClick={() => goTo(i)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
