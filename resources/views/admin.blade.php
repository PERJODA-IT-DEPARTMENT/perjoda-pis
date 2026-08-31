<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <meta name="theme-color" content="#0a3ea1">
    <title>PERJODA Admin</title>
    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml">
    @viteReactRefresh
    @vite(['resources/css/admin.css', 'resources/js/admin.jsx'])
</head>
<body>
    <div id="admin-root"></div>
</body>
</html>
