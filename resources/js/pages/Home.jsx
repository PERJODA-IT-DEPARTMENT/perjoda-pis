import { useMemo } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import QuickInfo from '../components/QuickInfo';
import About from '../components/About';
import MissionVision from '../components/MissionVision';
import Services from '../components/Services';
import Routes from '../components/Routes';
import FareInformation from '../components/FareInformation';
import PassengerInformation from '../components/PassengerInformation';
import Announcements from '../components/Announcements';
import WhyChooseUs from '../components/WhyChooseUs';
import CallToAction from '../components/CallToAction';
import Faq from '../components/Faq';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import useReveal from '../hooks/useReveal';
import useScrollSpy from '../hooks/useScrollSpy';
import { navLinks } from '../data/siteContent';

export default function Home() {
    const sectionIds = useMemo(() => navLinks.map((link) => link.id), []);
    const activeId = useScrollSpy(sectionIds);
    useReveal();

    return (
        <>
            <Navbar activeId={activeId} />
            <main id="main">
                <Hero />
                <QuickInfo />
                <About />
                <MissionVision />
                <Services />
                <Routes />
                <FareInformation />
                <PassengerInformation />
                <Announcements />
                <WhyChooseUs />
                <CallToAction />
                <Faq />
                <Contact />
            </main>
            <Footer />
        </>
    );
}
