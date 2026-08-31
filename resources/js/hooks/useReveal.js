import { useEffect } from 'react';

/**
 * Fade/slide elements in as they scroll into view.
 *
 * - Marks <html> with `reveal-ready` so the hidden starting state only ever
 *   applies when JS is running (content is never stuck invisible otherwise).
 * - Watches for `.reveal` nodes added later by API-driven sections.
 * - Falls back to "everything visible" when reduced motion is preferred or
 *   IntersectionObserver is unavailable.
 */
export default function useReveal() {
    useEffect(() => {
        const root = document.documentElement;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const revealAll = () => {
            document.querySelectorAll('.reveal').forEach((node) => node.classList.add('is-visible'));
        };

        if (prefersReduced || !('IntersectionObserver' in window)) {
            root.classList.add('reveal-ready');
            revealAll();
            return undefined;
        }

        root.classList.add('reveal-ready');

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
        );

        const observe = (node) => {
            if (node.dataset.revealBound) return;
            node.dataset.revealBound = '1';
            io.observe(node);
        };

        document.querySelectorAll('.reveal').forEach(observe);

        // Catch `.reveal` elements rendered after the first paint (routes, fares…).
        const mo = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== 1) return;
                    if (node.matches?.('.reveal')) observe(node);
                    node.querySelectorAll?.('.reveal').forEach(observe);
                });
            });
        });
        mo.observe(document.body, { childList: true, subtree: true });

        // Safety net: reveal anything still hidden shortly after load.
        const safety = window.setTimeout(revealAll, 2500);

        return () => {
            io.disconnect();
            mo.disconnect();
            window.clearTimeout(safety);
        };
    }, []);
}
