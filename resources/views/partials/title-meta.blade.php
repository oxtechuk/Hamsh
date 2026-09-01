<meta charset="utf-8" />
<title>{{ title }} | FabKin Admin & Dashboards Template </title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta content="Admin & Dashboards Template" name="description" />
<meta content="Pixeleyez" name="author" />

<!-- layout setup -->
<script type="module" src="{{ asset('assets/js/layout-setup.js') }}"></script>

@php
    $siteSettings = app(\App\Services\Cache\BaseCacheService::class)->rememberSettings();
    $favPath = $siteSettings->get('site_favicon') ?: $siteSettings->get('site_logo');
    $favUrl = $favPath && \Illuminate\Support\Facades\Storage::disk('public')->exists($favPath)
        ? asset('storage/' . $favPath)
        : asset('images/logo_without_bg.svg');
@endphp
<!-- App favicon -->
<link rel="icon" type="image/svg+xml" href="{{ $favUrl }}" />
<link rel="shortcut icon" href="{{ $favUrl }}">