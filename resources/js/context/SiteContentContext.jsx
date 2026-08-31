import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import {
    organisation as defaultOrg,
    aboutParagraphs as defaultParagraphs,
    aboutValues as defaultValues,
    missionVision as defaultMissionVision,
    fleetStats as defaultFleet,
    faqs as defaultFaqs,
} from '../data/siteContent';

const DEFAULTS = {
    organisation: defaultOrg,
    quickInfo: {
        operatingHours: '4:00 AM – 10:00 PM',
        routeSummary: 'SM Pala-Pala ↔ EPZA (Rosario)',
        serviceSummary: 'Daily Transportation',
        supportSummary: 'Passenger Assistance',
    },
    about: { paragraphs: defaultParagraphs, values: defaultValues },
    missionVision: defaultMissionVision,
    fleetStats: defaultFleet,
    faqs: defaultFaqs,
};

const SiteContentContext = createContext(DEFAULTS);

/** Shallow-merge each group so a partial/late API response never blanks a section. */
function merge(remote) {
    if (!remote) return DEFAULTS;
    return {
        organisation: { ...DEFAULTS.organisation, ...(remote.organisation || {}) },
        quickInfo: { ...DEFAULTS.quickInfo, ...(remote.quickInfo || {}) },
        about: {
            paragraphs: remote.about?.paragraphs?.length
                ? remote.about.paragraphs
                : DEFAULTS.about.paragraphs,
            values: remote.about?.values?.length ? remote.about.values : DEFAULTS.about.values,
        },
        missionVision: { ...DEFAULTS.missionVision, ...(remote.missionVision || {}) },
        fleetStats: remote.fleetStats?.length ? remote.fleetStats : DEFAULTS.fleetStats,
        faqs: remote.faqs?.length ? remote.faqs : DEFAULTS.faqs,
    };
}

export function SiteContentProvider({ children }) {
    const [remote, setRemote] = useState(null);

    useEffect(() => {
        let active = true;
        api.get('/site-content')
            .then((res) => active && setRemote(res.data?.data ?? null))
            .catch(() => {
                /* keep static defaults on failure */
            });
        return () => {
            active = false;
        };
    }, []);

    const value = useMemo(() => merge(remote), [remote]);

    return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export const useSiteContent = () => useContext(SiteContentContext);
