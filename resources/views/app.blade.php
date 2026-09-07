@php
    $initialSettings = app(\App\Services\Api\Store\SettingApiService::class)->footer();
    $isAdmin = auth('employee')->check();
    $favUrl = !empty($initialSettings['favicon']) ? $initialSettings['favicon'] : (!empty($initialSettings['logo']) ? $initialSettings['logo'] : '/favicon.svg');
@endphp
<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="{{ $favUrl }}" />
    <link rel="shortcut icon" href="{{ $favUrl }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ !empty($initialSettings['site_name']) ? $initialSettings['site_name'] : config('app.name', 'هامش') }}</title>

    {{-- Preload primary critical fonts for zero layout shift & instant paint --}}
    <link rel="preload" href="/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Regular.ttf" as="font" type="font/ttf" crossorigin />
    <link rel="preload" href="/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Bold.ttf" as="font" type="font/ttf" crossorigin />

    {{-- Dynamic Brand Theme Colors --}}
    @php
        $theme = $initialSettings['theme'] ?? [];
        $primaryColor = $theme['primary_color'] ?? '#DDBB72';
        $secondaryColor = $theme['secondary_color'] ?? '#303A54';
        $buttonBg = $theme['button_bg_color'] ?? $primaryColor;
        $buttonText = $theme['button_text_color'] ?? '#20283A';
        $textPrimary = $theme['text_primary_color'] ?? '#07111F';
        $textSecondary = $theme['text_secondary_color'] ?? '#595959';
        $background = $theme['background_color'] ?? '#F5F2EC';
        $footerBg = $theme['footer_bg_color'] ?? '#121317';
    @endphp
    <style id="dynamic-brand-theme">
        :root {
            --brand-primary-color: {{ $primaryColor }};
            --brand-secondary-color: {{ $secondaryColor }};
            --brand-button-bg: {{ $buttonBg }};
            --brand-button-text: {{ $buttonText }};
            --brand-text-primary: {{ $textPrimary }};
            --brand-text-secondary: {{ $textSecondary }};
            --brand-gray-color: {{ $textSecondary }};
            --brand-footer-color: {{ $footerBg }};
            --background: {{ $background }};
        }
    </style>

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
