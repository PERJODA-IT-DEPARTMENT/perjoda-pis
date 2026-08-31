import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view so the navbar can highlight the
 * matching link. Uses scroll position (not only IntersectionObserver) so that
 * very tall sections still register as "active" while they fill the viewport.
 *
 * @param {string[]} ids  section ids in document order
 */
export default function useScrollSpy(ids) {
    const [activeId, setActiveId] = useState(ids[0] ?? null);

    useEffect(() => {
        if (!ids.length) return undefined;

        const compute = () => {
            const marker = window.scrollY + window.innerHeight * 0.3;
            let current = ids[0];

            for (const id of ids) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top + window.scrollY <= marker) {
                    current = id;
                }
            }

            // Near the very bottom, force the last section (short footer-adjacent
            // sections may never reach the marker).
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
                current = ids[ids.length - 1];
            }

            setActiveId(current);
        };

        compute();
        window.addEventListener('scroll', compute, { passive: true });
        window.addEventListener('resize', compute);
        return () => {
            window.removeEventListener('scroll', compute);
            window.removeEventListener('resize', compute);
        };
    }, [ids]);

    return activeId;
}
