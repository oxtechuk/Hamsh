@php
    $initialSettings = app(\App\Services\Api\Store\SettingApiService::class)->footer();
    $isAdmin = auth('employee')->check();
    if ($isAdmin) {
        $initialSettings['maintenance']['is_admin'] = true;
    }
@endphp
<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="{{ !empty($initialSettings['favicon']) ? $initialSettings['favicon'] : '/favicon.svg' }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ !empty($initialSettings['site_name']) ? $initialSettings['site_name'] : config('app.name', 'هامش') }}</title>

    {{-- Preload primary critical fonts for zero layout shift & instant paint --}}
    <link rel="preload" href="/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Regular.ttf" as="font" type="font/ttf" crossorigin />
    <link rel="preload" href="/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Bold.ttf" as="font" type="font/ttf" crossorigin />

    <script>
        window.__INITIAL_SETTINGS__ = @json($initialSettings);
        window.__IS_ADMIN__ = {{ $isAdmin ? 'true' : 'false' }};
    </script>

    @viteReactRefresh
    @vite('resources/react/main.tsx')
</head>
<body>
    <div id="root"></div>
</body>
</html>
