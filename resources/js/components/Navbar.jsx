import { useEffect, useRef, useState } from 'react';
import { Collapse } from 'bootstrap';
import { navLinks } from '../data/siteContent';
import scrollToSection from '../utils/scrollToSection';
import BrandLogo from './ui/BrandLogo';

const SECTION_IDS = navLinks.map((link) => link.id);

export default function Navbar({ activeId }) {
    const [scrolled, setScrolled] = useState(false);
    const collapseRef = useRef(null);
    const collapseInstance = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (collapseRef.current) {
            collapseInstance.current = Collapse.getOrCreateInstance(collapseRef.current, { toggle: false });
        }
    }, []);

    const handleNav = (event, id) => {
        event.preventDefault();
        collapseInstance.current?.hide();
        scrollToSection(id);
    };

    return (
        <nav
            className={`site-nav navbar navbar-expand-lg sticky-top py-2 ${scrolled ? 'is-scrolled' : ''}`}
            aria-label="Primary"
        >
            <div className="container container-tight">
                <a
                    className="navbar-brand"
                    href="#home"
                    onClick={(e) => handleNav(e, 'home')}
                    aria-label="PERJODA Transport Cooperative — home"
                >
                    <BrandLogo height={44} />
                </a>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#primaryNav"
                    aria-controls="primaryNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation menu"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="primaryNav" ref={collapseRef}>
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
                        {navLinks.map((link) => (
                            <li className="nav-item" key={link.id}>
                                <a
                                    className={`nav-link ${activeId === link.id ? 'active' : ''}`}
                                    href={`#${link.id}`}
                                    aria-current={activeId === link.id ? 'page' : undefined}
                                    onClick={(e) => handleNav(e, link.id)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                            <a
                                href="#routes"
                                className="btn btn-primary btn-sm px-3"
                                onClick={(e) => handleNav(e, 'routes')}
                            >
                                View Route
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export { SECTION_IDS };
