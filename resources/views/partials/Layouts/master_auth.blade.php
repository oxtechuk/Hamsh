<!DOCTYPE html>
<html lang="en">

<meta charset="utf-8" />
<title>@yield('title', ' | hamsh  CRM')</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta content="hamsh  CRM" name="description" />
<meta content="hamsh " name="author" />

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

@yield('css')
@include('partials.head-css')

<body>

    @yield('content')

    @include('partials.vendor-scripts')

    @yield('js')

</body>

</html>