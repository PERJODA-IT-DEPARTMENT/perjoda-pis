/**
 * Smoothly scrolls to a section by id, respecting reduced-motion settings
 * and keeping the sticky navbar clear of the target.
 */
export default function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });

    // Move keyboard focus to the section for accessibility.
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
}
