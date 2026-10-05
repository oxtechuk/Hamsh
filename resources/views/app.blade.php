@php
    $initialSettings = app(\App\Services\Api\Store\SettingApiService::class)->footer();
    $isAdmin = auth('employee')->check();
    $favUrl = !empty($initialSettings['favicon']) ? $initialSettings['favicon'] : (!empty($initialSettings['logo']) ? $initialSettings['logo'] : '/favicon.svg');

    // Tracking Pixels Configuration (Dynamic with fallback to provided IDs)
    $cachedSettings = app(\App\Services\Cache\BaseCacheService::class)->rememberSettings();
    $metaPixelId = !empty($cachedSettings['meta_pixel_id']) ? $cachedSettings['meta_pixel_id'] : '1412701917496338';
    $tiktokPixelId = !empty($cachedSettings['tiktok_pixel_id']) ? $cachedSettings['tiktok_pixel_id'] : 'DB0V6ORC77U2LIICSES0';
    $snapPixelId = !empty($cachedSettings['snap_pixel_id']) ? $cachedSettings['snap_pixel_id'] : '5954db06-5cce-4123-aa78-fa8be6e6db01';
    $googleAnalyticsId = !empty($cachedSettings['google_analytics_id']) ? $cachedSettings['google_analytics_id'] : null;
    $googleTagManagerId = !empty($cachedSettings['google_tag_manager_id']) ? $cachedSettings['google_tag_manager_id'] : 'GTM-T5Q9WGL4';
@endphp
<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    {{-- ── Google Tag Manager ── --}}
    @if(!empty($googleTagManagerId))
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','{{ $googleTagManagerId }}');</script>
    <!-- End Google Tag Manager -->
    @endif

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

    {{-- ── Google Analytics (GA4) ── --}}
    @if(!empty($googleAnalyticsId))
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ $googleAnalyticsId }}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '{{ $googleAnalyticsId }}');
    </script>
    @endif

    {{-- ── Meta Pixel (Facebook) ── --}}
    @if(!empty($metaPixelId))
    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0'; 
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '{{ $metaPixelId }}');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id={{ $metaPixelId }}&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->
    @endif

    {{-- ── TikTok Pixel ── --}}
    @if(!empty($tiktokPixelId))
    <!-- TikTok Pixel Code Start -->
    <script>
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
    var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
    ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

      ttq.load('{{ $tiktokPixelId }}');
      ttq.page();
    }(window, document, 'ttq');
    </script>
    <!-- TikTok Pixel Code End -->
    @endif

    {{-- ── Snap Pixel ── --}}
    @if(!empty($snapPixelId))
    <!-- Snap Pixel Code -->
    <script type='text/javascript'>
    (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
    {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
    a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
    r.src=n;var u=t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r,u);})(window,document,
    'https://sc-static.net/scevent.min.js');

    snaptr('init', '{{ $snapPixelId }}');
    snaptr('track', 'PAGE_VIEW');
    </script>
    <!-- End Snap Pixel Code -->
    @endif

    <script>
        window.__INITIAL_SETTINGS__ = @json($initialSettings);
        window.__IS_ADMIN__ = {{ $isAdmin ? 'true' : 'false' }};
    </script>

    @viteReactRefresh
    @vite('resources/react/main.tsx')
</head>
<body>
    {{-- ── Google Tag Manager (noscript) ── --}}
    @if(!empty($googleTagManagerId))
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ $googleTagManagerId }}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    @endif

    <div id="root"></div>
</body>
</html>
