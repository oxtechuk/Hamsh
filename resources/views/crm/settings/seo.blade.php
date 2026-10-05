@extends('partials.Layouts.crm-master')
@section('title', __('إعدادات SEO') . ' | AutoCRM')

@section('content')
    <div class="container-fluid" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
        <div class="mb-2">
            <h4 class="mb-1 fw-bold">{{ __('إعدادات تحسين محركات البحث (SEO)') }}</h4>
            <p class="text-muted mb-0 small">{{ __('إدارة الكلمات المفتاحية والأوصاف لمحركات البحث وأدوات التتبع') }}</p>
        </div>

        @include('partials.settings-subnav')

        <form action="{{ route('crm.settings.update') }}" method="POST">
            @csrf
            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm mb-4 rounded-4">
                        <div class="card-header bg-transparent border-0 pt-4 px-4">
                            <h5 class="card-title mb-0 fw-bold">{{ __('بيانات الميتا (Meta Tags)') }}</h5>
                        </div>
                        <div class="card-body p-4">
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted">{{ __('العنوان الافتراضي للموقع (Meta Title)') }}</label>
                                <input type="text" name="meta_title" class="form-control bg-light border-0 shadow-none py-2" value="{{ $settings['meta_title'] ?? '' }}">
                                <small class="text-muted">{{ __('يظهر في عناوين صفحات المتصفح ومحركات البحث') }}</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted">{{ __('الوصف الافتراضي (Meta Description)') }}</label>
                                <textarea name="meta_description" class="form-control bg-light border-0 shadow-none" rows="4">{{ $settings['meta_description'] ?? '' }}</textarea>
                                <small class="text-muted">{{ __('وصف مختصر يظهر في نتائج البحث (يفضل ألا يتجاوز 160 حرفاً)') }}</small>
                            </div>
                            <div class="mb-0">
                                <label class="form-label fw-bold small text-muted">{{ __('الكلمات المفتاحية (Keywords)') }}</label>
                                <textarea name="meta_keywords" class="form-control bg-light border-0 shadow-none" rows="3" placeholder="{{ __('سيارات، بيع سيارات، تقسيط...') }}">{{ $settings['meta_keywords'] ?? '' }}</textarea>
                                <small class="text-muted">{{ __('افصل بين الكلمات بفاصلة (,) ') }}</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm mb-4 rounded-4">
                        <div class="card-header bg-transparent border-0 pt-4 px-4">
                            <h5 class="card-title mb-0 fw-bold">{{ __('تحليلات وأدوات التتبع') }}</h5>
                        </div>
                        <div class="card-body p-4">
                            @php
                                $gtmId = $settings['google_tag_manager_id'] ?? 'GTM-T5Q9WGL4';
                                $gaId = $settings['google_analytics_id'] ?? '';
                                $pixelId = $settings['meta_pixel_id'] ?? '1412701917496338';
                                $metaCapiToken = $settings['meta_capi_token'] ?? '';
                                $tiktokId = $settings['tiktok_pixel_id'] ?? 'DB0V6ORC77U2LIICSES0';
                                $tiktokToken = $settings['tiktok_access_token'] ?? '';
                                $snapId = $settings['snap_pixel_id'] ?? '5954db06-5cce-4123-aa78-fa8be6e6db01';
                                $snapToken = $settings['snap_capi_token'] ?? '';
                            @endphp

                            {{-- Google Tag Manager (GTM) --}}
                            <div class="mb-4">
                                <label class="form-label fw-bold small text-muted d-flex align-items-center gap-2">
                                    <i class="bi bi-tag-fill text-primary"></i>
                                    {{ __('معرف Google Tag Manager (GTM)') }}
                                    @if($gtmId)
                                        <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 ms-auto" style="font-size:10px;">
                                            <i class="bi bi-check-circle-fill me-1"></i>{{ __('مفعل') }}
                                        </span>
                                    @else
                                        <span class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-1 ms-auto" style="font-size:10px;">
                                            <i class="bi bi-dash-circle me-1"></i>{{ __('غير مفعل') }}
                                        </span>
                                    @endif
                                </label>
                                <input type="text" name="google_tag_manager_id"
                                    class="form-control bg-light border-0 shadow-none py-2"
                                    placeholder="GTM-XXXXXXX"
                                    value="{{ $gtmId }}" dir="ltr">
                                <small class="text-muted">{{ __('مثال: GTM-T5Q9WGL4') }}</small>
                            </div>

                            <hr class="my-4 text-muted opacity-25">

                            {{-- Google Analytics --}}
                            <div class="mb-4">
                                <label class="form-label fw-bold small text-muted d-flex align-items-center gap-2">
                                    <i class="bi bi-google text-primary"></i>
                                    {{ __('معرف Google Analytics (GA4)') }}
                                    @if($gaId)
                                        <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 ms-auto" style="font-size:10px;">
                                            <i class="bi bi-check-circle-fill me-1"></i>{{ __('مفعل') }}
                                        </span>
                                    @else
                                        <span class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-1 ms-auto" style="font-size:10px;">
                                            <i class="bi bi-dash-circle me-1"></i>{{ __('غير مفعل') }}
                                        </span>
                                    @endif
                                </label>
                                <input type="text" name="google_analytics_id"
                                    class="form-control bg-light border-0 shadow-none py-2"
                                    placeholder="G-XXXXXXXXXX"
                                    value="{{ $gaId }}" dir="ltr">
                                <small class="text-muted">{{ __('مثال: G-1234567890') }}</small>
                            </div>

                            <hr class="my-4 text-muted opacity-25">

                            {{-- Meta / Facebook Pixel --}}
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted d-flex align-items-center gap-2">
                                    <i class="bi bi-facebook text-primary" style="color:#1877F2 !important;"></i>
                                    {{ __('معرف Meta Pixel (Facebook)') }}
                                    @if($pixelId)
                                        <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 ms-auto" style="font-size:10px;">
                                            <i class="bi bi-check-circle-fill me-1"></i>{{ __('مفعل') }}
                                        </span>
                                    @else
                                        <span class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-1 ms-auto" style="font-size:10px;">
                                            <i class="bi bi-dash-circle me-1"></i>{{ __('غير مفعل') }}
                                        </span>
                                    @endif
                                </label>
                                <input type="text" name="meta_pixel_id"
                                    class="form-control bg-light border-0 shadow-none py-2"
                                    placeholder="1412701917496338"
                                    value="{{ $pixelId }}" dir="ltr">
                                <small class="text-muted">{{ __('مثال: 1412701917496338') }}</small>
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-bold small text-muted">
                                    {{ __('رمز الوصول Meta Conversions API (CAPI)') }}
                                </label>
                                <textarea name="meta_capi_token" rows="2"
                                    class="form-control bg-light border-0 shadow-none py-2 font-monospace"
                                    placeholder="EAAP..." dir="ltr" style="font-size: 11px;">{{ $metaCapiToken }}</textarea>
                                <small class="text-muted">{{ __('لتتبع التحويلات من الخادم مباشرة وتخطي حواجز الإعلانات') }}</small>
                            </div>

                            <hr class="my-4 text-muted opacity-25">

                            {{-- TikTok Pixel --}}
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted d-flex align-items-center gap-2">
                                    <i class="bi bi-tiktok text-dark"></i>
                                    {{ __('معرف TikTok Pixel') }}
                                    @if($tiktokId)
                                        <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 ms-auto" style="font-size:10px;">
                                            <i class="bi bi-check-circle-fill me-1"></i>{{ __('مفعل') }}
                                        </span>
                                    @else
                                        <span class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-1 ms-auto" style="font-size:10px;">
                                            <i class="bi bi-dash-circle me-1"></i>{{ __('غير مفعل') }}
                                        </span>
                                    @endif
                                </label>
                                <input type="text" name="tiktok_pixel_id"
                                    class="form-control bg-light border-0 shadow-none py-2"
                                    placeholder="DB0V6ORC77U2LIICSES0"
                                    value="{{ $tiktokId }}" dir="ltr">
                                <small class="text-muted">{{ __('مثال: DB0V6ORC77U2LIICSES0') }}</small>
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-bold small text-muted">
                                    {{ __('رمز وصول TikTok Events API') }}
                                </label>
                                <input type="text" name="tiktok_access_token"
                                    class="form-control bg-light border-0 shadow-none py-2 font-monospace"
                                    placeholder="2460e78c60..."
                                    value="{{ $tiktokToken }}" dir="ltr" style="font-size: 11px;">
                            </div>

                            <hr class="my-4 text-muted opacity-25">

                            {{-- Snapchat Pixel --}}
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted d-flex align-items-center gap-2">
                                    <i class="bi bi-snapchat text-warning"></i>
                                    {{ __('معرف Snap Pixel') }}
                                    @if($snapId)
                                        <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 ms-auto" style="font-size:10px;">
                                            <i class="bi bi-check-circle-fill me-1"></i>{{ __('مفعل') }}
                                        </span>
                                    @else
                                        <span class="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-1 ms-auto" style="font-size:10px;">
                                            <i class="bi bi-dash-circle me-1"></i>{{ __('غير مفعل') }}
                                        </span>
                                    @endif
                                </label>
                                <input type="text" name="snap_pixel_id"
                                    class="form-control bg-light border-0 shadow-none py-2"
                                    placeholder="5954db06-5cce-4123-aa78-fa8be6e6db01"
                                    value="{{ $snapId }}" dir="ltr">
                                <small class="text-muted">{{ __('مثال: 5954db06-5cce-4123-aa78-fa8be6e6db01') }}</small>
                            </div>
                            <div class="mb-0">
                                <label class="form-label fw-bold small text-muted">
                                    {{ __('رمز Snap Conversions API (CAPI)') }}
                                </label>
                                <textarea name="snap_capi_token" rows="2"
                                    class="form-control bg-light border-0 shadow-none py-2 font-monospace"
                                    placeholder="eyJhbGciOi..." dir="ltr" style="font-size: 11px;">{{ $snapToken }}</textarea>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div class="card-body p-4">
                            <button type="submit" class="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm">
                                <i class="bi bi-save me-1"></i> {{ __('حفظ الإعدادات') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
@endsection
