import { organisation } from '../../data/siteContent';

/**
 * PERJODA Transport Cooperative lockup: the cooperative emblem + wordmark.
 * The image source lives in siteContent.organisation.logo so it can be
 * swapped in one place.
 *
 * @param {number}  height    logo image height in px
 * @param {boolean} wordmark  show the "PERJODA / TRANSPORT COOPERATIVE" text
 * @param {boolean} chip      wrap the mark in a white rounded chip (for dark backgrounds)
 */
export default function BrandLogo({ height = 42, wordmark = true, chip = false, className = '' }) {
    return (
        <span className={`brand-logo ${className}`}>
            <img
                src={organisation.logo}
                alt={`${organisation.legalName} logo`}
                className={`brand-logo__img ${chip ? 'brand-logo__img--chip' : ''}`}
                style={{ height: `${height}px` }}
                width={Math.round(height * 1.5)}
                height={height}
            />
            {wordmark && (
                <span className="brand-logo__word">
                    <span className="brand-logo__name">PERJODA</span>
                    <span className="brand-logo__sub">Transport Cooperative</span>
                </span>
            )}
        </span>
    );
}
