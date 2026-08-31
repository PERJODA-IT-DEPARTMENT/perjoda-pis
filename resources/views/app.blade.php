<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#0a3ea1">

    <title>PERJODA Transport Cooperative | Reliable Public Transportation</title>
    <meta name="description" content="Official PERJODA Transport Cooperative public transportation information including routes, fares, passenger information, services, announcements, and contact details.">
    <meta name="keywords" content="PERJODA, PERJODA Transport Cooperative, public transportation, Philippines, bus routes, fares, passenger information, commute">
    <meta name="author" content="PERJODA Transport Cooperative">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url('/') }}">

    {{-- Open Graph --}}
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="PERJODA Transport Cooperative">
    <meta property="og:title" content="PERJODA Transport Cooperative | Reliable Public Transportation">
    <meta property="og:description" content="Routes, fares, passenger information, services, and announcements from PERJODA Transport Cooperative — moving people and connecting communities.">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:image" content="{{ asset('images/perjoda-social-card.svg') }}">
    <meta property="og:locale" content="en_PH">

    {{-- Twitter --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="PERJODA Transport Cooperative | Reliable Public Transportation">
    <meta name="twitter:description" content="Routes, fares, passenger information, services, and announcements from PERJODA Transport Cooperative.">
    <meta name="twitter:image" content="{{ asset('images/perjoda-social-card.svg') }}">

    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml">
    <link rel="alternate icon" href="{{ asset('favicon.ico') }}">
    <link rel="apple-touch-icon" href="{{ asset('favicon.svg') }}">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/main.jsx'])
</head>
<body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <div id="root"></div>
    <noscript>
        <div style="max-width:640px;margin:4rem auto;padding:0 1.5rem;font-family:system-ui,sans-serif;text-align:center;">
            <h1>PERJODA</h1>
            <p>This site needs JavaScript enabled to display routes, fares, and announcements.
            For assistance, please contact PERJODA passenger support.</p>
        </div>
    </noscript>
</body>
</html>
