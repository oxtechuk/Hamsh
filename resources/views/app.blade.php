<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ config('app.name', 'هامش') }}</title>

    {{-- Preload primary critical fonts for zero layout shift & instant paint --}}
    <link rel="preload" href="/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Regular.ttf" as="font" type="font/ttf" crossorigin />
    <link rel="preload" href="/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Bold.ttf" as="font" type="font/ttf" crossorigin />

    @viteReactRefresh
    @vite('resources/react/main.tsx')
</head>
<body>
    <div id="root"></div>
</body>
</html>
