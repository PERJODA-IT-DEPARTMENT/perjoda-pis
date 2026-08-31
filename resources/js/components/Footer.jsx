import { navLinks, socialLinks } from '../data/siteContent';
import { useSiteContent } from '../context/SiteContentContext';
import scrollToSection from '../utils/scrollToSection';
import LegalModals from './LegalModals';
import BrandLogo from './ui/BrandLogo';

const SUPPORT_LINKS = [
    { label: 'FAQs', target: 'faq' },
    { label: 'Passenger Guidelines', target: 'passenger-info' },
    { label: 'Lost & Found', target: 'passenger-info' },
    { label: 'Contact Us', target: 'contact' },
];

export default function Footer() {
    const { organisation } = useSiteContent();
    const year = new Date().getFullYear();

    const jump = (event, id) => {
        event.preventDefault();
        scrollToSection(id);
    };

    return (
        <footer className="site-footer" aria-labelledby="footer-title">
            <h2 id="footer-title" className="visually-hidden">
                Site footer
            </h2>
            <div className="container container-tight">
                <div className="row g-4 g-lg-5">
                    <div className="col-lg-4">
                        <span className="footer-brand mb-3">
                            <BrandLogo height={52} />
                        </span>
                        <p className="footer-brand-blurb">
                            PERJODA Transport Cooperative — a public transportation organization
                            focused on safe, reliable, and accessible travel, operating a modern
                            fleet of electric jeepneys and buses to move people and connect
                            communities.
                        </p>
                    </div>

                    <div className="col-6 col-lg-3">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            {navLinks.map((link) => (
                                <li key={link.id}>
                                    <a href={`#${link.id}`} onClick={(e) => jump(e, link.id)}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-6 col-lg-3">
                        <h3>Passenger Support</h3>
                        <ul className="footer-links">
                            {SUPPORT_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={`#${link.target}`}
                                        onClick={(e) => jump(e, link.target)}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-2">
                        <h3>Follow Us</h3>
                        <div className="social-row">
                            {socialLinks.map((social) => (
                                <span
                                    key={social.label}
                                    className="social-btn"
                                    role="img"
                                    aria-label={`${social.label} (link coming soon)`}
                                    title="Social links coming soon"
                                >
                                    <i className={`bi ${social.icon}`} aria-hidden="true" />
                                </span>
                            ))}
                        </div>
                        <p className="small mt-2 mb-0" style={{ color: '#8fa4bd' }}>
                            Official social media links coming soon.
                        </p>
                    </div>
                </div>

                <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
                    <p className="mb-0">
                        © {year} {organisation.legalName}. All Rights Reserved.
                    </p>
                    <div className="d-flex gap-3">
                        <button
                            type="button"
                            className="btn-link-plain"
                            data-bs-toggle="modal"
                            data-bs-target="#privacyModal"
                        >
                            Privacy Policy
                        </button>
                        <button
                            type="button"
                            className="btn-link-plain"
                            data-bs-toggle="modal"
                            data-bs-target="#termsModal"
                        >
                            Terms of Use
                        </button>
                    </div>
                </div>
            </div>

            <LegalModals />
        </footer>
    );
}
