/**
 * Editorial content for the static sections of the PERJODA site.
 * Placeholder text — safe to replace with official copy later.
 * API-driven content (routes, fares, announcements) is NOT here.
 */

export const organisation = {
    name: 'PERJODA',
    legalName: 'PERJODA Transport Cooperative',
    // Swap this file to replace the logo everywhere it is used.
    logo: '/images/logo/perjoda-logo.png',
    tagline: 'Moving People. Connecting Communities.',
    address: 'PERJODA Administrative Office, 231 Arnaldo Highway Barangay Santiago City of General Trias, Cavite, Philippines',
    phone: '(046) 000 0000',
    mobile: '+63 900 000 0000',
    email: 'info@perjoda.com',
    officeHours: 'Monday to Saturday, 8:00 AM – 5:00 PM',
    supportHours: 'Available during transportation operating hours',
};

export const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'routes', label: 'Route' },
    { id: 'fares', label: 'Fares' },
    { id: 'passenger-info', label: 'Passenger Info' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'contact', label: 'Contact' },
];

export const heroPills = ['Reliable', 'Safe', 'Connected', 'Passenger-focused'];

export const quickInfo = [
    { icon: 'bi-clock-history', label: 'Operating Hours', value: '4:00 AM – 10:00 PM' },
    { icon: 'bi-signpost-split', label: 'Route', value: 'SM Pala-Pala ↔ EPZA (Rosario)' },
    { icon: 'bi-bus-front', label: 'Service', value: 'Daily Transportation' },
    { icon: 'bi-headset', label: 'Support', value: 'Passenger Assistance' },
];

export const aboutValues = [{
        icon: 'bi-shield-check',
        title: 'Safety',
        text: 'Putting passenger and road safety at the heart of our operations.',
    },
    {
        icon: 'bi-check2-circle',
        title: 'Reliability',
        text: 'Providing dependable transportation services for everyday journeys.',
    },
    {
        icon: 'bi-people',
        title: 'Service',
        text: 'Creating a better experience for passengers and the communities we serve.',
    },
];

export const aboutParagraphs = [
    'PERJODA Transport Cooperative is a public transportation organization committed to providing reliable, safe, and accessible travel for the communities it serves. Our work is built around the everyday needs of passengers — getting to work and school, running errands, and staying connected with family.',
    'We focus on dependable schedules, well-managed routes, and clear passenger information so that every trip feels predictable and stress-free. Safety guides how we operate, from the condition of our units to the conduct of our drivers and conductors.',
    'Our fleet combines battery-electric E-future jeepneys with Ankai and Forland buses, giving passengers cleaner, quieter, and more comfortable rides while we keep transportation moving and communities connected.',
];

export const fleetStats = [
    { count: '13', label: 'Electric E-future jeepneys', icon: 'bi-ev-front' },
    { count: '10', label: 'Ankai passenger buses', icon: 'bi-bus-front' },
    { count: '2', label: 'Forland passenger buses', icon: 'bi-truck-front' },
];

export const missionVision = {
    mission: 'PERJODA Transport Cooperative is committed to creating a better, safer, and more comfortable riding experience for every commuter.',
    visionIntro: 'To be a leader in the transport industry, guided by these commitments:',
    visionPoints: [
        'Build a well-developed and extensive service operation powered by a modern mode of transportation.',
        'Sustain high standards and professionalism among our employees and stakeholders, raising the level of superior-quality transport service that helps build stronger socio-economic conditions.',
        'Create economic opportunity by continuously strengthening the capital formation of the cooperative through both internal and external sources.',
    ],
};

export const services = [{
        icon: 'bi-bus-front',
        title: 'Public Transportation',
        text: 'Reliable transportation services connecting passengers to their destinations.',
    },
    {
        icon: 'bi-diagram-3',
        title: 'Route Operations',
        text: 'Organized transportation operations designed for dependable daily service.',
    },
    {
        icon: 'bi-info-circle',
        title: 'Passenger Services',
        text: 'Information and support that make everyday journeys easier.',
    },
    {
        icon: 'bi-cpu',
        title: 'Technology-Enabled Operations',
        text: 'Modern technology supporting efficient transportation operations and better service.',
    },
];

export const passengerInfo = [{
        icon: 'bi-map',
        title: 'Before Your Trip',
        text: 'Plan your route and prepare your fare before boarding so you can travel with ease.',
    },
    {
        icon: 'bi-person-badge',
        title: 'While Boarding',
        text: 'Follow the instructions of the driver and conductor, and board in an orderly manner.',
    },
    {
        icon: 'bi-ticket-perforated',
        title: 'Keep Your Ticket',
        text: 'Keep your ticket for the whole trip in case it is needed for verification or assistance.',
    },
    {
        icon: 'bi-shield-check',
        title: 'Passenger Safety',
        text: 'Follow safety instructions and stay properly seated or positioned while the vehicle is moving.',
    },
    {
        icon: 'bi-bag-check',
        title: 'Lost & Found',
        text: 'Left something on board? Contact passenger support with the route, date, and time of your trip so we can help locate your item.',
    },
    {
        icon: 'bi-headset',
        title: 'Need Assistance?',
        text: 'Our passenger support team is available during operating hours. Reach us through the contact details below.',
    },
];

export const whyChooseUs = [{
        icon: 'bi-check2-circle',
        title: 'Reliable Service',
        text: 'Dependable transportation for everyday journeys.',
    },
    {
        icon: 'bi-people',
        title: 'Passenger Focused',
        text: 'Services designed around passenger convenience.',
    },
    {
        icon: 'bi-shield-check',
        title: 'Safe Operations',
        text: 'Safety remains a priority throughout transportation operations.',
    },
    {
        icon: 'bi-cpu',
        title: 'Modern Approach',
        text: 'Technology helps improve transportation operations and passenger service.',
    },
];

export const faqs = [{
        q: 'What route does PERJODA serve?',
        a: 'PERJODA currently operates the SM Pala-Pala ↔ EPZA (Rosario) route. You can see its operating hours and full list of stops in the Route section above.',
        target: 'routes',
        targetLabel: 'Go to Route',
    },
    {
        q: 'Where can I check fares?',
        a: 'Current fare information for regular, student, senior citizen, and PWD passengers is listed in the Fare Information section.',
        target: 'fares',
        targetLabel: 'Go to Fare Information',
    },
    {
        q: 'What should I do if I lose my ticket?',
        a: 'Please inform the conductor as soon as possible. Keeping your ticket for the whole trip helps with verification and assistance if any concern comes up.',
        target: 'passenger-info',
        targetLabel: 'Go to Passenger Information',
    },
    {
        q: 'How can I report a concern?',
        a: 'You can send us a message using the contact form, or reach our passenger support team using the contact details provided.',
        target: 'contact',
        targetLabel: 'Go to Contact',
    },
    {
        q: 'Where can I find service announcements?',
        a: 'Service advisories and updates are posted in the Latest Announcements section, which is updated as new information becomes available.',
        target: 'announcements',
        targetLabel: 'Go to Announcements',
    },
];

export const socialLinks = [
    { icon: 'bi-facebook', label: 'PERJODA on Facebook' },
    { icon: 'bi-instagram', label: 'PERJODA on Instagram' },
    { icon: 'bi-youtube', label: 'PERJODA on YouTube' },
];