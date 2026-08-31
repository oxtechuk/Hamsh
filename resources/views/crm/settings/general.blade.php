@extends('partials.Layouts.crm-master')
@section('title', __('إعدادات الموقع') . ' | AutoCRM')

@section('content')
    <div class="container-fluid" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">

        <div class="mb-4">
            <h4 class="mb-1 fw-bold">{{ __('إعدادات الموقع') }}</h4>
            <p class="text-muted mb-0 small">{{ __('تحكم في محتوى وإعدادات الموقع الفعالة من مكان واحد') }}</p>
        </div>

        @include('partials.settings-subnav')

        <form action="{{ route('crm.settings.update') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <input type="hidden" name="hero_slides_submitted" value="1">

            <div class="row g-4 align-items-start">

                {{-- ===== LEFT NAV ===== --}}
                <div class="col-lg-3">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style="top:80px;">
                        <div class="card-body p-2">

                            <p class="nav-group-label">{{ __('عام') }}</p>
                            <nav class="nav flex-column gap-1 mb-1">
                                <button type="button" class="settings-nav-btn active" data-tab="basic">
                                    <i class="bi bi-info-circle"></i> {{ __('المعلومات الأساسية') }}
                                </button>
                                <button type="button" class="settings-nav-btn" data-tab="appearance">
                                    <i class="bi bi-palette"></i> {{ __('الشعار والمظهر') }}
                                </button>
                                <button type="button" class="settings-nav-btn" data-tab="contact">
                                    <i class="bi bi-telephone"></i> {{ __('التواصل والشبكات') }}
                                </button>
                                <button type="button" class="settings-nav-btn" data-tab="maintenance">
                                    <i class="bi bi-tools"></i> {{ __('وضع الصيانة') }}
                                </button>
                            </nav>

                            <p class="nav-group-label">{{ __('الصفحة الرئيسية') }}</p>
                            <nav class="nav flex-column gap-1 mb-1">
                                <button type="button" class="settings-nav-btn" data-tab="hero-slides">
                                    <i class="bi bi-images"></i> {{ __('شرائح الهيرو (السلايدر)') }}
                                </button>
                                <button type="button" class="settings-nav-btn" data-tab="homepage-sections">
                                    <i class="bi bi-layout-text-window"></i> {{ __('نصوص الأقسام') }}
                                </button>
                                <button type="button" class="settings-nav-btn" data-tab="homepage-stats">
                                    <i class="bi bi-bar-chart-line"></i> {{ __('الإحصائيات العامة') }}
                                </button>
                                <button type="button" class="settings-nav-btn" data-tab="finance-stats">
                                    <i class="bi bi-currency-dollar"></i> {{ __('إحصائيات التمويل') }}
                                </button>
                            </nav>

                            <p class="nav-group-label">{{ __('صفحة العروض') }}</p>
                            <nav class="nav flex-column gap-1 mb-1">
                                <button type="button" class="settings-nav-btn" data-tab="offers-hero">
                                    <i class="bi bi-image"></i> {{ __('هيرو صفحة العروض') }}
                                </button>
                                <button type="button" class="settings-nav-btn" data-tab="bento">
                                    <i class="bi bi-grid-3x3-gap"></i> {{ __('سيارات العروض المميزة') }}
                                </button>
                            </nav>

                            <p class="nav-group-label">{{ __('صفحة من نحن والتواصل') }}</p>
                            <nav class="nav flex-column gap-1 mb-1">
                                <button type="button" class="settings-nav-btn" data-tab="about-sections">
                                    <i class="bi bi-file-text"></i> {{ __('نصوص الأقسام') }}
                                </button>
                                <button type="button" class="settings-nav-btn" data-tab="about-stats">
                                    <i class="bi bi-bar-chart-line"></i> {{ __('الإحصائيات') }}
                                </button>
                                <button type="button" class="settings-nav-btn" data-tab="about-branches">
                                    <i class="bi bi-geo-alt"></i> {{ __('فروع التواجد') }}
                                </button>
                                <button type="button" class="settings-nav-btn" data-tab="main-gallery">
                                    <i class="bi bi-images"></i> {{ __('معرض الصور') }}
                                </button>
                            </nav>

                        </div>
                    </div>
                </div>

                {{-- ===== CONTENT ===== --}}
                <div class="col-lg-6">
                    <div id="settingsTabContent">

                        {{-- =============================== --}}
                        {{-- TAB: المعلومات الأساسية --}}
                        {{-- =============================== --}}
                        <div class="settings-pane active" id="tab-basic">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0">
                                    <h6 class="fw-bold mb-0">{{ __('المعلومات الأساسية') }}</h6>
                                    <p class="text-muted small mb-0">{{ __('اسم الموقع، نص التذييل، وإعدادات الطلبات') }}</p>
                                </div>
                                <div class="card-body p-4">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('اسم الموقع — عربي') }}</label>
                                            <input type="text" name="site_name[ar]" class="form-control bg-light border-0"
                                                value="{{ $settings['site_name']['ar'] ?? '' }}"
                                                placeholder="مثال: هامش كار">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('اسم الموقع — إنجليزي') }}</label>
                                            <input type="text" name="site_name[en]" class="form-control bg-light border-0"
                                                value="{{ $settings['site_name']['en'] ?? '' }}"
                                                placeholder="e.g.: Hamsh Car">
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label fw-semibold small text-muted">{{ __('نص التذييل (Footer Text)') }}</label>
                                            <textarea name="footer_text" class="form-control bg-light border-0" rows="3"
                                                placeholder="{{ __('النص الذي يظهر في أسفل جميع الصفحات...') }}">{{ $settings['footer_text'] ?? '' }}</textarea>
                                        </div>
                                        <div class="col-12">
                                            <div class="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                                                <div>
                                                    <p class="fw-semibold mb-0 small">{{ __('التوزيع التلقائي للطلبات') }}</p>
                                                    <p class="text-muted small mb-0">{{ __('توزيع طلبات الحجز تلقائياً (Round-Robin) على موظفي المبيعات') }}</p>
                                                </div>
                                                <div class="form-check form-switch fs-5 mb-0">
                                                    <input type="hidden" name="auto_assign_bookings" value="0">
                                                    <input class="form-check-input" type="checkbox"
                                                        name="auto_assign_bookings" value="1" {{ ($settings['auto_assign_bookings'] ?? '0') == '1' ? 'checked' : '' }}>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                                                <div>
                                                    <p class="fw-semibold mb-0 small">{{ __('تشغيل البوب اب لكرت السيارة') }}</p>
                                                    <p class="text-muted small mb-0">{{ __('فتح نافذة منبثقة لمعاينة السيارة وطلب التمويل عند الضغط على كرت السيارة') }}</p>
                                                </div>
                                                <div class="form-check form-switch fs-5 mb-0">
                                                    <input type="hidden" name="car_popup_enabled" value="0">
                                                    <input class="form-check-input" type="checkbox" name="car_popup_enabled"
                                                        value="1" {{ ($settings['car_popup_enabled'] ?? '0') == '1' ? 'checked' : '' }}>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: الشعار والمظهر --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-appearance">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0">
                                    <h6 class="fw-bold mb-0">{{ __('الشعار والمظهر') }}</h6>
                                    <p class="text-muted small mb-0">{{ __('اللوجو، الأيقونة، وصورة السيارة الافتراضية') }}</p>
                                </div>
                                <div class="card-body p-4">
                                    <div class="row g-4">
                                        <div class="col-md-4">
                                            <label class="form-label fw-semibold small text-muted d-block mb-2">{{ __('شعار الموقع (Logo)') }}</label>
                                            <div class="upload-preview rounded-3 mb-2 bg-dark p-2">
                                                @if(isset($settings['site_logo']))
                                                    <img src="{{ asset('storage/' . $settings['site_logo']) }}" alt="Logo"
                                                        class="img-fluid" style="max-height:60px;">
                                                @else
                                                    <i class="bi bi-image fs-2 text-white opacity-25"></i>
                                                @endif
                                            </div>
                                            <input type="file" name="site_logo" class="form-control bg-light border-0 form-control-sm"
                                                accept="image/*">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-semibold small text-muted d-block mb-2">{{ __('أيقونة (Favicon)') }}</label>
                                            <div class="upload-preview rounded-3 mb-2">
                                                @if(isset($settings['site_favicon']))
                                                    <img src="{{ asset('storage/' . $settings['site_favicon']) }}" alt="Favicon"
                                                        width="32">
                                                @else
                                                    <i class="bi bi-app-indicator fs-2 opacity-25"></i>
                                                @endif
                                            </div>
                                            <input type="file" name="site_favicon" class="form-control bg-light border-0 form-control-sm"
                                                accept="image/*">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-semibold small text-muted d-block mb-2">{{ __('صورة السيارة الافتراضية') }}</label>
                                            <div class="upload-preview rounded-3 mb-2 bg-light d-flex align-items-center justify-content-center"
                                                style="height:60px;">
                                                @if(isset($settings['default_car_image']))
                                                    <img src="{{ asset('storage/' . $settings['default_car_image']) }}"
                                                        alt="Default Car" class="img-fluid rounded-3" style="max-height:50px;">
                                                @else
                                                    <i class="bi bi-car-front fs-2 opacity-25"></i>
                                                @endif
                                            </div>
                                            <input type="file" name="default_car_image"
                                                class="form-control bg-light border-0 form-control-sm" accept="image/*">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: التواصل والشبكات --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-contact">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0">
                                    <h6 class="fw-bold mb-0">{{ __('بيانات التواصل والشبكات') }}</h6>
                                    <p class="text-muted small mb-0">{{ __('تظهر في الهيدر، الفوتر، وشريط الموبايل وصفحة التواصل') }}</p>
                                </div>
                                <div class="card-body p-4">
                                    <div class="row g-3 mb-4">
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('البريد الإلكتروني') }}</label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-0"><i class="bi bi-envelope"></i></span>
                                                <input type="email" name="contact_email"
                                                    class="form-control bg-light border-0"
                                                    value="{{ $settings['contact_email'] ?? '' }}" placeholder="info@example.com">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('رقم الهاتف') }}</label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-0"><i class="bi bi-telephone"></i></span>
                                                <input type="text" name="contact_phone"
                                                    class="form-control bg-light border-0" dir="ltr"
                                                    value="{{ $settings['contact_phone'] ?? '' }}" placeholder="055XXXXXXX">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('رقم الواتساب') }}</label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-0"><i class="bi bi-whatsapp"></i></span>
                                                <input type="text" name="contact_whatsapp"
                                                    class="form-control bg-light border-0" dir="ltr"
                                                    value="{{ $settings['contact_whatsapp'] ?? '' }}" placeholder="9665XXXXXXXX">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('العنوان الرئيسي للمعرض') }}</label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-0"><i class="bi bi-geo-alt"></i></span>
                                                <input type="text" name="contact_address"
                                                    class="form-control bg-light border-0"
                                                    value="{{ $settings['contact_address'] ?? '' }}" placeholder="الرياض، طريق الملك فهد">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="d-flex align-items-center justify-content-between mb-3 border-top pt-3">
                                        <h6 class="fw-bold mb-0 small text-dark"><i class="bi bi-share me-2"></i>{{ __('روابط التواصل الاجتماعي') }}</h6>
                                        <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3"
                                            onclick="addSocialRow()">
                                            <i class="bi bi-plus-lg me-1"></i> {{ __('إضافة حساب') }}
                                        </button>
                                    </div>

                                    <div id="social-container" class="d-flex flex-column gap-2">
                                        @foreach($socialMedia as $idx => $social)
                                            <div class="social-row d-flex align-items-center gap-2 p-3 bg-light rounded-3"
                                                id="social-row-{{ $idx }}">
                                                <input type="text" name="social_icon[]"
                                                    class="form-control border-0 bg-white shadow-none"
                                                    placeholder="bi-facebook" value="{{ $social['icon'] ?? '' }}"
                                                    style="max-width:150px;">
                                                <input type="color" name="social_color[]"
                                                    class="form-control form-control-color border-0 bg-white shadow-none p-1"
                                                    value="{{ $social['color'] ?? '#333333' }}" style="width:40px;height:38px;">
                                                <input type="text" name="social_link[]"
                                                    class="form-control border-0 bg-white shadow-none text-start flex-grow-1"
                                                    dir="ltr" placeholder="https://..." value="{{ $social['link'] ?? '' }}">
                                                <button type="button"
                                                    class="btn btn-sm btn-light text-danger rounded-circle p-1 lh-1"
                                                    onclick="removeSocialRow({{ $idx }})"><i class="bi bi-x-lg"></i></button>
                                            </div>
                                        @endforeach
                                    </div>
                                    <div id="no-social-msg"
                                        class="text-center py-4 bg-light rounded-3 {{ count($socialMedia) > 0 ? 'd-none' : '' }}">
                                        <span class="text-muted small">{{ __('لا توجد حسابات بعد') }}</span>
                                    </div>
                                    <p class="text-muted small mt-2 mb-0"><i
                                            class="bi bi-info-circle me-1"></i>{{ __('أيقونات Bootstrap Icons:') }}
                                        <code>bi-facebook</code>, <code>bi-instagram</code>, <code>bi-tiktok</code>, <code>bi-twitter-x</code>, <code>bi-snapchat</code>…</p>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: وضع الصيانة --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-maintenance">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 class="fw-bold mb-0">{{ __('وضع الصيانة (Maintenance Mode)') }}</h6>
                                            <p class="text-muted small mb-0">{{ __('التحكم في إتاحة الواجهة الأمامية للموقع للمستخدمين والزوار') }}</p>
                                        </div>
                                        <span id="maintenance-status-badge" class="badge {{ (isset($settings['maintenance_mode_enabled']) && in_array($settings['maintenance_mode_enabled'], [1, '1', true, 'true'], true)) ? 'bg-danger text-white' : 'bg-success-subtle text-success' }} px-3 py-2 rounded-pill">
                                            <i class="bi {{ (isset($settings['maintenance_mode_enabled']) && in_array($settings['maintenance_mode_enabled'], [1, '1', true, 'true'], true)) ? 'bi-exclamation-triangle-fill me-1' : 'bi-check-circle-fill me-1' }}"></i>
                                            {{ (isset($settings['maintenance_mode_enabled']) && in_array($settings['maintenance_mode_enabled'], [1, '1', true, 'true'], true)) ? __('وضع الصيانة مفعّل') : __('الموقع يعمل بصورة طبيعية') }}
                                        </span>
                                    </div>
                                </div>
                                <div class="card-body p-4">
                                    <div id="maintenance-active-alert" class="alert alert-danger d-flex align-items-center rounded-3 p-3 mb-4 {{ (isset($settings['maintenance_mode_enabled']) && in_array($settings['maintenance_mode_enabled'], [1, '1', true, 'true'], true)) ? '' : 'd-none' }}" role="alert">
                                        <i class="bi bi-shield-exclamation fs-3 me-3"></i>
                                        <div>
                                            <div class="fw-bold">{{ __('تنبيه: الواجهة الأمامية معطلة حالياً') }}</div>
                                            <div class="small">{{ __('الزوار يرون شاشة الصيانة فقط عند تصفح المتجر. يمكنك الاستمرار في استخدام لوحة التحكم كالمعتاد.') }}</div>
                                        </div>
                                    </div>

                                    <div class="row g-4">
                                        {{-- سويتش تفعيل وضع الصيانة --}}
                                        <div class="col-12">
                                            <div class="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 border">
                                                <div>
                                                    <p class="fw-bold mb-0 text-dark">{{ __('تفعيل وضع الصيانة للواجهة الأمامية') }}</p>
                                                    <p class="text-muted small mb-0">{{ __('عند التفعيل، سيتم توجيه جميع زوار الموقع فوراً إلى صفحة الصيانة') }}</p>
                                                </div>
                                                <div class="form-check form-switch fs-4 mb-0">
                                                    <input type="hidden" name="maintenance_mode_enabled" value="0">
                                                    <input class="form-check-input" type="checkbox" id="maintenance_mode_toggle" name="maintenance_mode_enabled"
                                                        value="1" onchange="toggleMaintenanceAjax(this)" {{ (isset($settings['maintenance_mode_enabled']) && in_array($settings['maintenance_mode_enabled'], [1, '1', true, 'true'], true)) ? 'checked' : '' }}>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- صورة شاشة الصيانة --}}
                                        <div class="col-12">
                                            <label class="form-label fw-semibold small text-muted d-block mb-2">{{ __('صورة وضع الصيانة (Maintenance Image)') }}</label>
                                            <div class="d-flex flex-column flex-md-row align-items-start gap-3">
                                                <div class="upload-preview rounded-3 p-2 bg-light border text-center position-relative" style="width:160px;height:120px;">
                                                    @if(isset($settings['maintenance_image']) && !empty($settings['maintenance_image']))
                                                        <img src="{{ asset('storage/' . $settings['maintenance_image']) }}" alt="Maintenance" class="w-100 h-100 object-fit-contain rounded-2">
                                                        <button type="submit" name="delete_maintenance_image" value="1"
                                                            class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-1 lh-1 p-1"
                                                            title="{{ __('حذف الصورة') }}"
                                                            onclick="return confirm('{{ __('هل تريد حذف صورة وضع الصيانة؟') }}')"
                                                            style="width:24px;height:24px;font-size:11px;">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    @else
                                                        <div class="d-flex flex-column align-items-center justify-content-center h-100 text-muted opacity-50">
                                                            <i class="bi bi-tools fs-1 mb-1"></i>
                                                            <span class="small">{{ __('لا توجد صورة') }}</span>
                                                        </div>
                                                    @endif
                                                </div>
                                                <div class="flex-grow-1">
                                                    <input type="file" name="maintenance_image" class="form-control bg-light border-0 form-control-sm mb-2" accept="image/*">
                                                    <p class="text-muted small mb-0">
                                                        <i class="bi bi-info-circle me-1"></i>
                                                        {{ __('ارفع صورة أو رسم توضيحي مناسب لشاشة الصيانة (PNG, JPG, SVG, WebP). إذا لم ترفع صورة، سيتم استخدام أيقونة وشعار المتجر الافتراضي.') }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- عنوان الصيانة --}}
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('عنوان الصيانة — عربي') }}</label>
                                            <input type="text" name="maintenance_title[ar]" class="form-control bg-light border-0"
                                                value="{{ is_array($settings['maintenance_title'] ?? null) ? ($settings['maintenance_title']['ar'] ?? '') : ($settings['maintenance_title'] ?? '') }}"
                                                placeholder="{{ __('الموقع قيد الصيانة والتطوير حالياً') }}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('عنوان الصيانة — إنجليزي') }}</label>
                                            <input type="text" name="maintenance_title[en]" class="form-control bg-light border-0"
                                                value="{{ is_array($settings['maintenance_title'] ?? null) ? ($settings['maintenance_title']['en'] ?? '') : '' }}"
                                                placeholder="Our website is currently under maintenance">
                                        </div>

                                        {{-- رسالة الصيانة --}}
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('نص الرسالة التوضيحية — عربي') }}</label>
                                            <textarea name="maintenance_message[ar]" class="form-control bg-light border-0" rows="3"
                                                placeholder="{{ __('نعمل حالياً على تحديث وتطوير الموقع لتقديم تجربة أفضل، سنعود قريباً.') }}">{{ is_array($settings['maintenance_message'] ?? null) ? ($settings['maintenance_message']['ar'] ?? '') : ($settings['maintenance_message'] ?? '') }}</textarea>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('نص الرسالة التوضيحية — إنجليزي') }}</label>
                                            <textarea name="maintenance_message[en]" class="form-control bg-light border-0" rows="3"
                                                placeholder="We are currently upgrading our system to serve you better. We will be back shortly.">{{ is_array($settings['maintenance_message'] ?? null) ? ($settings['maintenance_message']['en'] ?? '') : '' }}</textarea>
                                        </div>

                                        {{-- إظهار أزرار التواصل --}}
                                        <div class="col-12">
                                            <div class="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                                                <div>
                                                    <p class="fw-semibold mb-0 small">{{ __('إظهار أزرار التواصل في شاشة الصيانة') }}</p>
                                                    <p class="text-muted small mb-0">{{ __('عرض زر واتساب ورقم الاتصال بالمعرض حتى يتمكن العملاء من التواصل المباشر أثناء الصيانة') }}</p>
                                                </div>
                                                <div class="form-check form-switch fs-5 mb-0">
                                                    <input type="hidden" name="maintenance_show_contact" value="0">
                                                    <input class="form-check-input" type="checkbox" name="maintenance_show_contact"
                                                        value="1" {{ ($settings['maintenance_show_contact'] ?? '1') == '1' ? 'checked' : '' }}>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: شرائح الهيرو (السلايدر) --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-hero-slides">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="fw-bold mb-0">{{ __('شرائح الهيرو (سلايدر الرئيسية)') }}</h6>
                                        <p class="text-muted small mb-0">{{ __('الصور الإعلانية والروابط ونصوص الأزرار في أعلى الصفحة الرئيسية') }}</p>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3"
                                        onclick="addHeroSlide()">
                                        <i class="bi bi-plus-lg me-1"></i> {{ __('إضافة شريحة') }}
                                    </button>
                                </div>
                                <div class="card-body p-4">
                                    @php
                                        $heroSlides = isset($settings['hero_slides'])
                                            ? (is_array($settings['hero_slides']) ? $settings['hero_slides'] : (json_decode($settings['hero_slides'], true) ?: []))
                                            : [];
                                    @endphp
                                    <div id="hero-slides-container" class="d-flex flex-column gap-3">
                                        @foreach($heroSlides as $idx => $slide)
                                            <div class="hero-slide-item card border border-light-subtle rounded-3 shadow-sm"
                                                id="hero-slide-{{ $idx }}">
                                                <div class="card-body p-3">
                                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                                        <span class="small fw-semibold text-muted">{{ __('شريحة') }}
                                                            {{ $idx + 1 }}</span>
                                                        <button type="button"
                                                            class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1"
                                                            onclick="removeHeroSlide({{ $idx }})"><i
                                                                class="bi bi-x-lg"></i></button>
                                                    </div>
                                                    <div class="row g-3">
                                                        <div class="col-md-4">
                                                            <input type="hidden" name="hero_slides[{{ $idx }}][image_path]"
                                                                value="{{ $slide['image'] ?? '' }}">
                                                            @if(isset($slide['image']))
                                                                <div class="rounded-3 overflow-hidden mb-2" style="height:90px;">
                                                                    <img src="{{ asset('storage/' . $slide['image']) }}"
                                                                        class="w-100 h-100 object-fit-cover"></div>
                                                            @endif
                                                            <input type="file" name="hero_slides[{{ $idx }}][image]"
                                                                class="form-control bg-light border-0 form-control-sm"
                                                                accept="image/*">
                                                        </div>
                                                        <div class="col-md-8">
                                                            <div class="row g-2">
                                                                <div class="col-12">
                                                                    <label class="form-label fw-semibold small text-muted mb-1">{{ __('رابط الشريحة') }}</label>
                                                                    <input type="text" name="hero_slides[{{ $idx }}][link]"
                                                                        class="form-control bg-light border-0 text-start form-control-sm"
                                                                        dir="ltr" value="{{ $slide['link'] ?? '' }}"
                                                                        placeholder="/cars أو https://...">
                                                                </div>
                                                                <div class="col-12">
                                                                    <label class="form-label fw-semibold small text-muted mb-1">{{ __('نص الزر') }}</label>
                                                                    <input type="text"
                                                                        name="hero_slides[{{ $idx }}][button_text]"
                                                                        class="form-control bg-light border-0 form-control-sm"
                                                                        value="{{ $slide['button_text'] ?? __('اكتشف السيارات') }}">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                    <div id="no-slides-msg"
                                        class="text-center py-5 bg-light rounded-3 {{ count($heroSlides) > 0 ? 'd-none' : '' }}">
                                        <i class="bi bi-images fs-1 text-muted opacity-25 d-block mb-1"></i>
                                        <span class="text-muted small">{{ __('لا توجد شرائح بعد. اضغط "إضافة شريحة" للبدء.') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: نصوص أقسام الرئيسية --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-homepage-sections">
                            @php $sec = $homepageSections; @endphp
                            <div class="d-flex flex-column gap-3">
                                @php
                                    $hSections = [
                                        ['id' => 'budget', 'icon' => 'bi-wallet2', 'label' => __('قسم الميزانية'), 'fields' => ['badge', 'title', 'description', 'button_text']],
                                        ['id' => 'finance', 'icon' => 'bi-currency-dollar', 'label' => __('قسم حلول التمويل'), 'fields' => ['badge', 'title', 'subtitle', 'button_text']],
                                        ['id' => 'featured_cars', 'icon' => 'bi-star', 'label' => __('السيارات المميزة'), 'fields' => ['badge', 'title', 'subtitle', 'button_text']],
                                        ['id' => 'offers', 'icon' => 'bi-tag', 'label' => __('العروض الحصرية'), 'fields' => ['badge', 'title', 'button_text']],
                                        ['id' => 'brands', 'icon' => 'bi-award', 'label' => __('الماركات التجارية'), 'fields' => ['title', 'subtitle']],
                                    ];
                                    $hFieldLabels = [
                                        'badge' => __('الشارة (Badge)'),
                                        'title' => __('العنوان'),
                                        'subtitle' => __('الوصف الفرعي'),
                                        'description' => __('الوصف'),
                                        'button_text' => __('نص الزر'),
                                    ];
                                    $isTextarea = ['subtitle', 'description'];
                                @endphp

                                @foreach($hSections as $hIdx => $hSec)
                                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                                        <button type="button"
                                            class="btn text-start p-4 d-flex align-items-center gap-3 collapsed-section-toggle border-0 bg-white rounded-4"
                                            onclick="toggleSection('h-{{ $hSec['id'] }}', this)">
                                            <i class="bi {{ $hSec['icon'] }} text-danger"></i>
                                            <span class="fw-semibold">{{ $hSec['label'] }}</span>
                                            <i class="bi bi-chevron-down ms-auto text-muted small toggle-chevron"></i>
                                        </button>
                                        <div class="section-body {{ $hIdx === 0 ? '' : 'd-none' }} border-top"
                                            id="h-{{ $hSec['id'] }}">
                                            <div class="p-4">
                                                <div class="row g-3">
                                                    @foreach($hSec['fields'] as $field)
                                                        @php $isTA = in_array($field, $isTextarea); @endphp
                                                        <div class="col-md-6">
                                                            <label class="form-label fw-semibold small text-muted">{{ $hFieldLabels[$field] }} — {{ __('عربي') }}</label>
                                                            @if($isTA)
                                                                <textarea name="homepage_sections[{{ $hSec['id'] }}][{{ $field }}][ar]"
                                                                    class="form-control bg-light border-0"
                                                                    rows="3">{{ $sec[$hSec['id']][$field]['ar'] ?? '' }}</textarea>
                                                            @else
                                                                <input type="text"
                                                                    name="homepage_sections[{{ $hSec['id'] }}][{{ $field }}][ar]"
                                                                    class="form-control bg-light border-0"
                                                                    value="{{ $sec[$hSec['id']][$field]['ar'] ?? '' }}">
                                                            @endif
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="form-label fw-semibold small text-muted">{{ $hFieldLabels[$field] }} — {{ __('إنجليزي') }}</label>
                                                            @if($isTA)
                                                                <textarea name="homepage_sections[{{ $hSec['id'] }}][{{ $field }}][en]"
                                                                    class="form-control bg-light border-0"
                                                                    rows="3">{{ $sec[$hSec['id']][$field]['en'] ?? '' }}</textarea>
                                                            @else
                                                                <input type="text"
                                                                    name="homepage_sections[{{ $hSec['id'] }}][{{ $field }}][en]"
                                                                    class="form-control bg-light border-0"
                                                                    value="{{ $sec[$hSec['id']][$field]['en'] ?? '' }}">
                                                            @endif
                                                        </div>
                                                    @endforeach
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: إحصائيات الرئيسية --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-homepage-stats">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="fw-bold mb-0">{{ __('إحصائيات الصفحة الرئيسية') }}</h6>
                                        <p class="text-muted small mb-0">{{ __('الأرقام التي تظهر في قسم الإنجازات') }}</p>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3"
                                        onclick="addStatRow('stats', 'stat_value', 'stat_label')">
                                        <i class="bi bi-plus-lg me-1"></i> {{ __('إضافة') }}
                                    </button>
                                </div>
                                <div class="card-body p-4">
                                    <div id="stats-container" class="d-flex flex-column gap-2">
                                        @foreach($homepageStats as $idx => $stat)
                                            <div class="stat-row d-flex align-items-center gap-2 p-3 bg-light rounded-3"
                                                id="stat-row-{{ $idx }}">
                                                <input type="text" name="stat_value[]"
                                                    class="form-control border-0 bg-white fw-bold text-center"
                                                    value="{{ $stat['value'] ?? '' }}" placeholder="+500"
                                                    style="max-width:90px;">
                                                <input type="text" name="stat_label[]"
                                                    class="form-control border-0 bg-white flex-grow-1"
                                                    value="{{ $stat['label'] ?? '' }}" placeholder="{{ __('التسمية') }}">
                                                <button type="button"
                                                    class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1"
                                                    onclick="removeStatRow({{ $idx }}, 'stat-row')"><i
                                                        class="bi bi-x-lg"></i></button>
                                            </div>
                                        @endforeach
                                    </div>
                                    <div id="no-stats-msg"
                                        class="text-center py-4 bg-light rounded-3 {{ count($homepageStats) > 0 ? 'd-none' : '' }}">
                                        <span class="text-muted small">{{ __('لا توجد إحصائيات بعد') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: إحصائيات التمويل --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-finance-stats">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="fw-bold mb-0">{{ __('إحصائيات قسم التمويل') }}</h6>
                                        <p class="text-muted small mb-0">{{ __('الأرقام التي تظهر في قسم حلول التمويل') }}</p>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3"
                                        onclick="addFinanceStatRow()">
                                        <i class="bi bi-plus-lg me-1"></i> {{ __('إضافة') }}
                                    </button>
                                </div>
                                <div class="card-body p-4">
                                    <div id="finance-stats-container" class="d-flex flex-column gap-2">
                                        @foreach($financeStats as $idx => $stat)
                                            <div class="finance-stat-row d-flex align-items-center gap-2 p-3 bg-light rounded-3"
                                                id="finance-stat-row-{{ $idx }}">
                                                <input type="text" name="finance_stat_value[]"
                                                    class="form-control border-0 bg-white fw-bold text-center"
                                                    value="{{ $stat['value'] ?? '' }}" placeholder="500"
                                                    style="max-width:90px;">
                                                <input type="text" name="finance_stat_label[]"
                                                    class="form-control border-0 bg-white flex-grow-1"
                                                    value="{{ $stat['label'] ?? '' }}" placeholder="{{ __('التسمية') }}">
                                                <button type="button"
                                                    class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1"
                                                    onclick="removeFinanceStatRow({{ $idx }})"><i
                                                        class="bi bi-x-lg"></i></button>
                                            </div>
                                        @endforeach
                                    </div>
                                    <div id="no-finance-stats-msg"
                                        class="text-center py-4 bg-light rounded-3 {{ count($financeStats) > 0 ? 'd-none' : '' }}">
                                        <span class="text-muted small">{{ __('لا توجد إحصائيات بعد') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: هيرو صفحة العروض --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-offers-hero">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0">
                                    <h6 class="fw-bold mb-0">{{ __('هيرو صفحة العروض') }}</h6>
                                    <p class="text-muted small mb-0">{{ __('العنوان والصورة والعرض الرئيسي في صفحة العروض') }}</p>
                                </div>
                                <div class="card-body p-4">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('العنوان — عربي') }}</label>
                                            <input type="text" name="store_offers_hero[title][ar]"
                                                class="form-control bg-light border-0"
                                                value="{{ $offersHero['title']['ar'] ?? '' }}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('العنوان — إنجليزي') }}</label>
                                            <input type="text" name="store_offers_hero[title][en]"
                                                class="form-control bg-light border-0"
                                                value="{{ $offersHero['title']['en'] ?? '' }}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('العنوان الملون — عربي') }}</label>
                                            <input type="text" name="store_offers_hero[colored_title][ar]"
                                                class="form-control bg-light border-0"
                                                value="{{ $offersHero['colored_title']['ar'] ?? '' }}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('العنوان الملون — إنجليزي') }}</label>
                                            <input type="text" name="store_offers_hero[colored_title][en]"
                                                class="form-control bg-light border-0"
                                                value="{{ $offersHero['colored_title']['en'] ?? '' }}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('الوصف — عربي') }}</label>
                                            <textarea name="store_offers_hero[subtitle][ar]" rows="3"
                                                class="form-control bg-light border-0">{{ $offersHero['subtitle']['ar'] ?? '' }}</textarea>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('الوصف — إنجليزي') }}</label>
                                            <textarea name="store_offers_hero[subtitle][en]" rows="3"
                                                class="form-control bg-light border-0">{{ $offersHero['subtitle']['en'] ?? '' }}</textarea>
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label fw-semibold small text-muted d-block mb-2">{{ __('صورة الهيرو البديلة') }}</label>
                                            @if(!empty($offersHero['image']))
                                                <div class="mb-2 rounded-3 overflow-hidden bg-light" style="max-height:120px;">
                                                    <img src="{{ asset('storage/' . $offersHero['image']) }}"
                                                        class="img-fluid w-100 object-fit-cover" style="max-height:120px;">
                                                </div>
                                                <input type="hidden" name="store_offers_hero[image]"
                                                    value="{{ $offersHero['image'] }}">
                                            @endif
                                            <input type="file" name="offers_hero_image"
                                                class="form-control bg-light border-0" accept="image/*">
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label fw-semibold small text-muted">{{ __('العرض الرئيسي البارز') }}</label>
                                            <select name="main_offer_id" class="form-select bg-light border-0">
                                                <option value="">{{ __('بدون عرض رئيسي (استخدام الهيرو الافتراضي)') }}</option>
                                                @foreach($offers as $offer)
                                                    <option value="{{ $offer->id }}" {{ ($mainOfferId ?? null) == $offer->id ? 'selected' : '' }}>
                                                        {{ $offer->title }}
                                                    </option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: سيارات العروض المميزة (Bento) --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-bento">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0">
                                    <h6 class="fw-bold mb-0">{{ __('سيارات العروض المميزة') }}</h6>
                                    <p class="text-muted small mb-0">{{ __('اختر السيارات التي تظهر في قسم العروض البارزة') }}</p>
                                </div>
                                <div class="card-body p-4">
                                    <select name="bento_cars[]" class="form-select bg-light border-0" multiple
                                        style="min-height:220px;">
                                        @foreach($cars as $car)
                                            <option value="{{ $car->id }}" {{ in_array($car->id, $bentoCars) ? 'selected' : '' }}>{{ $car->name }}</option>
                                        @endforeach
                                    </select>
                                    <p class="text-muted small mt-2 mb-0"><i class="bi bi-info-circle me-1"></i>{{ __('اضغط مع الاستمرار على Ctrl لتحديد أكثر من سيارة') }}</p>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: أقسام صفحة من نحن --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-about-sections">
                            @php $asec = $aboutSections; @endphp
                            <div class="d-flex flex-column gap-3">
                                @php
                                    $aboutSectionsDef = [
                                        [
                                            'id' => 'hero',
                                            'icon' => 'bi-house',
                                            'label' => __('قسم الهيرو'),
                                            'fields' => ['badge', 'title', 'colored_title', 'subtitle'],
                                            'fieldLabels' => ['badge' => __('الشارة'), 'title' => __('العنوان'), 'colored_title' => __('العنوان الملون'), 'subtitle' => __('الوصف')],
                                            'textarea' => ['subtitle'],
                                        ],
                                        [
                                            'id' => 'story',
                                            'icon' => 'bi-book',
                                            'label' => __('قصة الشركة والرؤية والرسالة'),
                                            'fields' => ['badge', 'title', 'content', 'mission_title', 'mission_text', 'vision_title', 'vision_text', 'message_title', 'message_text'],
                                            'fieldLabels' => ['badge' => __('الشارة'), 'title' => __('عنوان القسم'), 'content' => __('النص'), 'mission_title' => __('عنوان المهمة'), 'mission_text' => __('نص المهمة'), 'vision_title' => __('عنوان الرؤية'), 'vision_text' => __('نص الرؤية'), 'message_title' => __('عنوان الرسالة'), 'message_text' => __('نص الرسالة')],
                                            'textarea' => ['content', 'mission_text', 'vision_text', 'message_text'],
                                        ],
                                        [
                                            'id' => 'partners',
                                            'icon' => 'bi-briefcase',
                                            'label' => __('قسم الشركاء'),
                                            'fields' => ['badge', 'title', 'subtitle'],
                                            'fieldLabels' => ['badge' => __('الشارة'), 'title' => __('العنوان'), 'subtitle' => __('الوصف')],
                                            'textarea' => ['subtitle'],
                                        ],
                                        [
                                            'id' => 'testimonials',
                                            'icon' => 'bi-chat-quote',
                                            'label' => __('قسم التقييمات'),
                                            'fields' => ['badge', 'title', 'rating_text'],
                                            'fieldLabels' => ['badge' => __('الشارة'), 'title' => __('العنوان'), 'rating_text' => __('نص التقييم')],
                                            'textarea' => [],
                                        ],
                                    ];
                                @endphp

                                @foreach($aboutSectionsDef as $aIdx => $aDef)
                                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                                        <button type="button"
                                            class="btn text-start p-4 d-flex align-items-center gap-3 collapsed-section-toggle border-0 bg-white rounded-4"
                                            onclick="toggleSection('a-{{ $aDef['id'] }}', this)">
                                            <i class="bi {{ $aDef['icon'] }} text-danger"></i>
                                            <span class="fw-semibold">{{ $aDef['label'] }}</span>
                                            <i class="bi bi-chevron-down ms-auto text-muted small toggle-chevron"></i>
                                        </button>
                                        <div class="section-body {{ $aIdx === 0 ? '' : 'd-none' }} border-top"
                                            id="a-{{ $aDef['id'] }}">
                                            <div class="p-4">
                                                <div class="row g-3">
                                                    @foreach($aDef['fields'] as $aField)
                                                        @php $isTA = in_array($aField, $aDef['textarea']); @endphp
                                                        <div class="col-md-6">
                                                            <label class="form-label fw-semibold small text-muted">{{ $aDef['fieldLabels'][$aField] }} — {{ __('عربي') }}</label>
                                                            @if($isTA)
                                                                <textarea name="about_sections[{{ $aDef['id'] }}][{{ $aField }}][ar]"
                                                                    class="form-control bg-light border-0"
                                                                    rows="3">{{ $asec[$aDef['id']][$aField]['ar'] ?? '' }}</textarea>
                                                            @else
                                                                <input type="text"
                                                                    name="about_sections[{{ $aDef['id'] }}][{{ $aField }}][ar]"
                                                                    class="form-control bg-light border-0"
                                                                    value="{{ $asec[$aDef['id']][$aField]['ar'] ?? '' }}">
                                                            @endif
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="form-label fw-semibold small text-muted">{{ $aDef['fieldLabels'][$aField] }} — {{ __('إنجليزي') }}</label>
                                                            @if($isTA)
                                                                <textarea name="about_sections[{{ $aDef['id'] }}][{{ $aField }}][en]"
                                                                    class="form-control bg-light border-0"
                                                                    rows="3">{{ $asec[$aDef['id']][$aField]['en'] ?? '' }}</textarea>
                                                            @else
                                                                <input type="text"
                                                                    name="about_sections[{{ $aDef['id'] }}][{{ $aField }}][en]"
                                                                    class="form-control bg-light border-0"
                                                                    value="{{ $asec[$aDef['id']][$aField]['en'] ?? '' }}">
                                                            @endif
                                                        </div>
                                                    @endforeach

                                                    @if($aDef['id'] === 'hero')
                                                        <div class="col-12">
                                                            <label class="form-label fw-semibold small text-muted d-block mb-2">{{ __('صور الهيرو (حد أقصى 2 صور)') }}</label>
                                                            <div class="d-flex gap-3">
                                                                @for($i = 0; $i < 2; $i++)
                                                                    <div class="flex-grow-1">
                                                                        @if(!empty($asec['hero']['gallery_images'][$i]))
                                                                            <div class="mb-2 rounded-3 overflow-hidden bg-light"
                                                                                style="max-height:120px;">
                                                                                <img src="{{ asset('storage/' . $asec['hero']['gallery_images'][$i]) }}"
                                                                                    class="img-fluid w-100 object-fit-cover"
                                                                                    style="max-height:120px;">
                                                                            </div>
                                                                            <input type="hidden"
                                                                                name="about_sections[hero][gallery_images][{{ $i }}]"
                                                                                value="{{ $asec['hero']['gallery_images'][$i] }}">
                                                                        @endif
                                                                        <input type="file" name="about_hero_gallery[]"
                                                                            class="form-control bg-light border-0 form-control-sm" accept="image/*">
                                                                    </div>
                                                                @endfor
                                                            </div>
                                                        </div>
                                                    @endif
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: إحصائيات من نحن --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-about-stats">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="fw-bold mb-0">{{ __('إحصائيات صفحة من نحن') }}</h6>
                                        <p class="text-muted small mb-0">{{ __('الأرقام التي تظهر في صفحة من نحن') }}</p>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3"
                                        onclick="addAboutStatRow()">
                                        <i class="bi bi-plus-lg me-1"></i> {{ __('إضافة') }}
                                    </button>
                                </div>
                                <div class="card-body p-4">
                                    <div id="about-stats-container" class="d-flex flex-column gap-2">
                                        @foreach($aboutStats as $idx => $stat)
                                            <div class="about-stat-row d-flex align-items-center gap-2 p-3 bg-light rounded-3"
                                                id="about-stat-row-{{ $idx }}">
                                                <input type="text" name="about_stat_value[]"
                                                    class="form-control border-0 bg-white fw-bold text-center"
                                                    value="{{ $stat['value'] ?? '' }}" placeholder="+500"
                                                    style="max-width:90px;">
                                                <input type="text" name="about_stat_label[]"
                                                    class="form-control border-0 bg-white flex-grow-1"
                                                    value="{{ $stat['label'] ?? '' }}" placeholder="{{ __('التسمية') }}">
                                                <button type="button"
                                                    class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1"
                                                    onclick="removeAboutStatRow({{ $idx }})"><i class="bi bi-x-lg"></i></button>
                                            </div>
                                        @endforeach
                                    </div>
                                    <div id="no-about-stats-msg"
                                        class="text-center py-4 bg-light rounded-3 {{ count($aboutStats) > 0 ? 'd-none' : '' }}">
                                        <span class="text-muted small">{{ __('لا توجد إحصائيات بعد') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: فروع التواجد --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-about-branches">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="fw-bold mb-0">{{ __('فروع التواجد') }}</h6>
                                        <p class="text-muted small mb-0">{{ __('مواقع الفروع ومعلومات الاتصال في صفحة التواصل') }}</p>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3"
                                        onclick="addBranchRow()">
                                        <i class="bi bi-plus-lg me-1"></i> {{ __('إضافة فرع') }}
                                    </button>
                                </div>
                                <div class="card-body p-4">
                                    <div id="branches-container" class="d-flex flex-column gap-3">
                                        @foreach($aboutBranches as $idx => $branch)
                                            <div class="branch-row card border border-light-subtle rounded-3"
                                                id="branch-row-{{ $idx }}">
                                                <div class="card-body p-3">
                                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                                        <span class="fw-semibold small text-muted">{{ __('فرع') }}
                                                            {{ $idx + 1 }}</span>
                                                        <button type="button"
                                                            class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1"
                                                            onclick="removeBranchRow({{ $idx }})"><i
                                                                class="bi bi-x-lg"></i></button>
                                                    </div>
                                                    <div class="row g-2">
                                                        <div class="col-md-6">
                                                            <label class="form-label fw-semibold small text-muted mb-1">{{ __('المدينة') }}</label>
                                                            <input type="text" name="branch_city[]"
                                                                class="form-control bg-light border-0 form-control-sm"
                                                                value="{{ $branch['city'] ?? '' }}"
                                                                placeholder="{{ __('الرياض') }}">
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="form-label fw-semibold small text-muted mb-1">{{ __('اسم الفرع') }}</label>
                                                            <input type="text" name="branch_name[]"
                                                                class="form-control bg-light border-0 form-control-sm"
                                                                value="{{ $branch['name'] ?? '' }}"
                                                                placeholder="{{ __('الفرع الرئيسي') }}">
                                                        </div>
                                                        <div class="col-12">
                                                            <label class="form-label fw-semibold small text-muted mb-1">{{ __('العنوان التفصيلي') }}</label>
                                                            <input type="text" name="branch_address[]"
                                                                class="form-control bg-light border-0 form-control-sm"
                                                                value="{{ $branch['address'] ?? '' }}"
                                                                placeholder="{{ __('طريق الملك فهد، مجمع...') }}">
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="form-label fw-semibold small text-muted mb-1">{{ __('رقم الهاتف') }}</label>
                                                            <input type="text" name="branch_phone[]"
                                                                class="form-control bg-light border-0 form-control-sm"
                                                                value="{{ $branch['phone'] ?? '' }}"
                                                                placeholder="+966 5X XXX XXXX">
                                                        </div>
                                                        <div class="col-md-6">
                                                            <label class="form-label fw-semibold small text-muted mb-1">{{ __('أوقات العمل') }}</label>
                                                            <input type="text" name="branch_hours[]"
                                                                class="form-control bg-light border-0 form-control-sm"
                                                                value="{{ $branch['working_hours'] ?? '' }}"
                                                                placeholder="{{ __('السبت - الخميس، 9 صباحاً - 8 مساءً') }}">
                                                        </div>
                                                        <div class="col-12">
                                                            <label class="form-label fw-semibold small text-muted mb-1">{{ __('رابط الخريطة') }}</label>
                                                            <input type="text" name="branch_map_link[]"
                                                                class="form-control bg-light border-0 form-control-sm text-start"
                                                                dir="ltr" value="{{ $branch['map_link'] ?? '' }}"
                                                                placeholder="https://maps.google.com/...">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                    <div id="no-branches-msg"
                                        class="text-center py-5 bg-light rounded-3 {{ count($aboutBranches) > 0 ? 'd-none' : '' }}">
                                        <i class="bi bi-geo-alt fs-1 text-muted opacity-25 d-block mb-1"></i>
                                        <span class="text-muted small">{{ __('لا توجد فروع بعد. اضغط "إضافة فرع" للبدء.') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {{-- =============================== --}}
                        {{-- TAB: معرض الصور --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-main-gallery">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="fw-bold mb-0">{{ __('المعرض الرئيسي') }}</h6>
                                        <p class="text-muted small mb-0">{{ __('صور المعرض في صفحة من نحن') }}</p>
                                    </div>
                                    <span class="badge bg-light text-muted rounded-pill px-3">{{ count($settings['main_gallery'] ?? []) }} {{ __('صورة') }}</span>
                                </div>
                                <div class="card-body p-4">
                                    <input type="file" name="main_gallery[]" class="form-control bg-light border-0 mb-4"
                                        multiple accept="image/*">
                                    @if(!empty($settings['main_gallery']))
                                        @php $gallery = is_array($settings['main_gallery']) ? $settings['main_gallery'] : (json_decode($settings['main_gallery'], true) ?: []); @endphp
                                        <div class="row g-2">
                                            @foreach($gallery as $img)
                                                <div class="col-4 col-md-3 position-relative">
                                                    <div class="rounded-3 overflow-hidden" style="height:100px;">
                                                        <img src="{{ asset('storage/' . $img) }}"
                                                            class="w-100 h-100 object-fit-cover">
                                                    </div>
                                                    <button type="submit" name="delete_gallery_image" value="{{ $img }}"
                                                        class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-1 lh-1 p-1"
                                                        onclick="return confirm('{{ __('حذف هذه الصورة؟') }}')"
                                                        style="width:24px;height:24px;font-size:11px;"><i
                                                            class="bi bi-x"></i></button>
                                                </div>
                                            @endforeach
                                        </div>
                                    @else
                                        <div class="text-center py-4 bg-light rounded-3">
                                            <span class="text-muted small">{{ __('لا توجد صور بعد') }}</span>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        </div>

                    </div>{{-- /settingsTabContent --}}
                </div>

                {{-- ===== SAVE SIDEBAR ===== --}}
                <div class="col-lg-3">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top"
                        style="top:80px; background:#0a0a0a;">
                        <div class="card-body p-4 position-relative">
                            <i class="bi bi-save position-absolute text-white opacity-10"
                                style="font-size:80px;right:-10px;bottom:-20px;"></i>
                            <h5 class="fw-bold mb-2 text-white">{{ __('حفظ التغييرات') }}</h5>
                            <p class="small text-white opacity-50 mb-4">{{ __('تأكد من مراجعة جميع الأقسام قبل الحفظ.') }}</p>
                            @can('manage-settings')
                                <button type="submit" class="btn w-100 py-3 fw-bold rounded-3"
                                    style="background:#EB5E28;color:#fff;">
                                    <i class="bi bi-check2-circle me-2"></i> {{ __('تحديث الإعدادات') }}
                                </button>
                            @endcan
                            <div class="mt-3 pt-3 border-top border-secondary">
                                <p class="text-white opacity-50 small mb-0 text-center" id="active-tab-label">
                                    {{ __('المعلومات الأساسية') }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </form>
    </div>
@endsection

@section('css')
    <style>
        .nav-group-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .08em;
            color: #94a3b8;
            padding: 12px 12px 4px;
            margin: 0;
        }

        .settings-nav-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            border: none;
            background: transparent;
            text-align: start;
            padding: 9px 12px;
            border-radius: 8px;
            font-size: 13.5px;
            color: #4b5563;
            transition: background .15s, color .15s;
            cursor: pointer;
        }

        .settings-nav-btn:hover {
            background: #f1f5f9;
            color: #111;
        }

        .settings-nav-btn.active {
            background: #fff0f0;
            color: rgba(235, 94, 40, 1);
            font-weight: 600;
        }

        .settings-nav-btn i {
            font-size: 15px;
            flex-shrink: 0;
        }

        .settings-pane {
            display: block;
        }

        .settings-pane.d-none {
            display: none !important;
        }

        .upload-preview {
            min-height: 100px;
            background: #f8fafc;
            border: 1.5px dashed #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .object-fit-cover {
            object-fit: cover;
        }

        .collapsed-section-toggle {
            width: 100%;
            cursor: pointer;
        }

        .collapsed-section-toggle:hover {
            background: #f8fafc !important;
        }

        .toggle-chevron {
            transition: transform .2s;
        }

        .collapsed-section-toggle.open .toggle-chevron {
            transform: rotate(180deg);
        }
    </style>
@endsection

@section('scripts')
    <script>
        // ===== Tab Navigation =====
        document.querySelectorAll('.settings-nav-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.settings-nav-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.settings-pane').forEach(p => p.classList.add('d-none'));
                this.classList.add('active');
                const target = document.getElementById('tab-' + this.dataset.tab);
                if (target) { target.classList.remove('d-none'); }
                const label = document.getElementById('active-tab-label');
                if (label) { label.textContent = this.textContent.trim(); }
            });
        });

        // ===== Collapsible Sections =====
        function toggleSection(id, btn) {
            const body = document.getElementById(id);
            if (!body) return;
            const isOpen = !body.classList.contains('d-none');
            body.classList.toggle('d-none', isOpen);
            btn.classList.toggle('open', !isOpen);
        }

        // ===== Hero Slides =====
        function addHeroSlide() {
            const container = document.getElementById('hero-slides-container');
            const items = container.querySelectorAll('.hero-slide-item');
            const idx = items.length > 0 ? parseInt(items[items.length - 1].id.split('-').pop()) + 1 : 0;
            document.getElementById('no-slides-msg').classList.add('d-none');
            const div = document.createElement('div');
            div.className = 'hero-slide-item card border border-light-subtle rounded-3 shadow-sm';
            div.id = 'hero-slide-' + idx;
            div.innerHTML = `
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="small fw-semibold text-muted">{{ __('شريحة جديدة') }}</span>
                    <button type="button" class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1" onclick="removeHeroSlide(${idx})"><i class="bi bi-x-lg"></i></button>
                </div>
                <div class="row g-3">
                    <div class="col-md-4">
                        <input type="file" name="hero_slides[${idx}][image]" class="form-control bg-light border-0 form-control-sm" accept="image/*" required>
                    </div>
                    <div class="col-md-8">
                        <div class="row g-2">
                            <div class="col-12">
                                <label class="form-label fw-semibold small text-muted mb-1">{{ __('الرابط') }}</label>
                                <input type="text" name="hero_slides[${idx}][link]" class="form-control bg-light border-0 text-start form-control-sm" dir="ltr" placeholder="/cars أو https://...">
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-semibold small text-muted mb-1">{{ __('نص الزر') }}</label>
                                <input type="text" name="hero_slides[${idx}][button_text]" class="form-control bg-light border-0 form-control-sm" value="{{ __('اكتشف السيارات') }}">
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
            container.appendChild(div);
        }
        function removeHeroSlide(idx) {
            document.getElementById('hero-slide-' + idx)?.remove();
            if (!document.querySelector('.hero-slide-item')) document.getElementById('no-slides-msg').classList.remove('d-none');
        }

        // ===== Social Media =====
        let socialCount = {{ count($socialMedia) }};
        function addSocialRow() {
            const idx = socialCount++;
            document.getElementById('no-social-msg').classList.add('d-none');
            const div = document.createElement('div');
            div.className = 'social-row d-flex align-items-center gap-2 p-3 bg-light rounded-3';
            div.id = 'social-row-' + idx;
            div.innerHTML = `
            <input type="text" name="social_icon[]" class="form-control border-0 bg-white" placeholder="bi-facebook" style="max-width:150px;">
            <input type="color" name="social_color[]" class="form-control form-control-color border-0 bg-white p-1" value="#333333" style="width:40px;height:38px;">
            <input type="text" name="social_link[]" class="form-control border-0 bg-white text-start flex-grow-1" dir="ltr" placeholder="https://...">
            <button type="button" class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1" onclick="removeSocialRow(${idx})"><i class="bi bi-x-lg"></i></button>`;
            document.getElementById('social-container').appendChild(div);
        }
        function removeSocialRow(idx) {
            document.getElementById('social-row-' + idx)?.remove();
            if (!document.querySelector('.social-row')) document.getElementById('no-social-msg').classList.remove('d-none');
        }

        // ===== Homepage Stats =====
        let statCount = {{ count($homepageStats) }};
        function addStatRow() {
            const idx = statCount++;
            document.getElementById('no-stats-msg').classList.add('d-none');
            const div = document.createElement('div');
            div.className = 'stat-row d-flex align-items-center gap-2 p-3 bg-light rounded-3';
            div.id = 'stat-row-' + idx;
            div.innerHTML = `
            <input type="text" name="stat_value[]" class="form-control border-0 bg-white fw-bold text-center" placeholder="+500" style="max-width:90px;">
            <input type="text" name="stat_label[]" class="form-control border-0 bg-white flex-grow-1" placeholder="{{ __('التسمية') }}">
            <button type="button" class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1" onclick="removeStatRow(${idx}, 'stat-row')"><i class="bi bi-x-lg"></i></button>`;
            document.getElementById('stats-container').appendChild(div);
        }
        function removeStatRow(idx, prefix) {
            document.getElementById((prefix || 'stat-row') + '-' + idx)?.remove();
            if (!document.querySelector('.stat-row')) document.getElementById('no-stats-msg').classList.remove('d-none');
        }

        // ===== About Stats =====
        let aboutStatCount = {{ count($aboutStats) }};
        function addAboutStatRow() {
            const idx = aboutStatCount++;
            document.getElementById('no-about-stats-msg').classList.add('d-none');
            const div = document.createElement('div');
            div.className = 'about-stat-row d-flex align-items-center gap-2 p-3 bg-light rounded-3';
            div.id = 'about-stat-row-' + idx;
            div.innerHTML = `
            <input type="text" name="about_stat_value[]" class="form-control border-0 bg-white fw-bold text-center" placeholder="+500" style="max-width:90px;">
            <input type="text" name="about_stat_label[]" class="form-control border-0 bg-white flex-grow-1" placeholder="{{ __('التسمية') }}">
            <button type="button" class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1" onclick="removeAboutStatRow(${idx})"><i class="bi bi-x-lg"></i></button>`;
            document.getElementById('about-stats-container').appendChild(div);
        }
        function removeAboutStatRow(idx) {
            document.getElementById('about-stat-row-' + idx)?.remove();
            if (!document.querySelector('.about-stat-row')) document.getElementById('no-about-stats-msg').classList.remove('d-none');
        }

        // ===== Finance Stats =====
        let financeStatCount = {{ count($financeStats) }};
        function addFinanceStatRow() {
            const idx = financeStatCount++;
            document.getElementById('no-finance-stats-msg').classList.add('d-none');
            const div = document.createElement('div');
            div.className = 'finance-stat-row d-flex align-items-center gap-2 p-3 bg-light rounded-3';
            div.id = 'finance-stat-row-' + idx;
            div.innerHTML = `
            <input type="text" name="finance_stat_value[]" class="form-control border-0 bg-white fw-bold text-center" placeholder="500" style="max-width:90px;">
            <input type="text" name="finance_stat_label[]" class="form-control border-0 bg-white flex-grow-1" placeholder="{{ __('التسمية') }}">
            <button type="button" class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1" onclick="removeFinanceStatRow(${idx})"><i class="bi bi-x-lg"></i></button>`;
            document.getElementById('finance-stats-container').appendChild(div);
        }
        function removeFinanceStatRow(idx) {
            document.getElementById('finance-stat-row-' + idx)?.remove();
            if (!document.querySelector('.finance-stat-row')) document.getElementById('no-finance-stats-msg').classList.remove('d-none');
        }

        // ===== Branches =====
        let branchCount = {{ count($aboutBranches) }};
        function addBranchRow() {
            const idx = branchCount++;
            document.getElementById('no-branches-msg').classList.add('d-none');
            const div = document.createElement('div');
            div.className = 'branch-row card border border-light-subtle rounded-3';
            div.id = 'branch-row-' + idx;
            div.innerHTML = `
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="fw-semibold small text-muted">{{ __('فرع جديد') }}</span>
                    <button type="button" class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1" onclick="removeBranchRow(${idx})"><i class="bi bi-x-lg"></i></button>
                </div>
                <div class="row g-2">
                    <div class="col-md-6"><label class="form-label fw-semibold small text-muted mb-1">{{ __('المدينة') }}</label><input type="text" name="branch_city[]" class="form-control bg-light border-0 form-control-sm" placeholder="{{ __('الرياض') }}"></div>
                    <div class="col-md-6"><label class="form-label fw-semibold small text-muted mb-1">{{ __('اسم الفرع') }}</label><input type="text" name="branch_name[]" class="form-control bg-light border-0 form-control-sm" placeholder="{{ __('الفرع الرئيسي') }}"></div>
                    <div class="col-12"><label class="form-label fw-semibold small text-muted mb-1">{{ __('العنوان') }}</label><input type="text" name="branch_address[]" class="form-control bg-light border-0 form-control-sm"></div>
                    <div class="col-md-6"><label class="form-label fw-semibold small text-muted mb-1">{{ __('الهاتف') }}</label><input type="text" name="branch_phone[]" class="form-control bg-light border-0 form-control-sm"></div>
                    <div class="col-md-6"><label class="form-label fw-semibold small text-muted mb-1">{{ __('أوقات العمل') }}</label><input type="text" name="branch_hours[]" class="form-control bg-light border-0 form-control-sm"></div>
                    <div class="col-12"><label class="form-label fw-semibold small text-muted mb-1">{{ __('رابط الخريطة') }}</label><input type="text" name="branch_map_link[]" class="form-control bg-light border-0 form-control-sm text-start" dir="ltr" placeholder="https://maps.google.com/..."></div>
                </div>
            </div>`;
            document.getElementById('branches-container').appendChild(div);
        }
        function removeBranchRow(idx) {
            document.getElementById('branch-row-' + idx)?.remove();
            if (!document.querySelector('.branch-row')) document.getElementById('no-branches-msg').classList.remove('d-none');
        }

        // Open first section in each accordion on load
        document.querySelectorAll('.collapsed-section-toggle').forEach((btn, i) => {
            if (i === 0 || (i > 0 && btn.closest('.settings-pane') !== document.querySelectorAll('.collapsed-section-toggle')[i - 1].closest('.settings-pane'))) {
                btn.classList.add('open');
            }
        });

        // ===== Instant Maintenance Mode Toggle =====
        function toggleMaintenanceAjax(input) {
            const isEnabled = input.checked;
            const badge = document.getElementById('maintenance-status-badge');
            const alertBox = document.getElementById('maintenance-active-alert');
            
            fetch('{{ route("crm.settings.maintenance.toggle") }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ enabled: isEnabled ? 1 : 0 })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (data.enabled) {
                        badge.className = 'badge bg-danger text-white px-3 py-2 rounded-pill';
                        badge.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-1"></i> {{ __("وضع الصيانة مفعّل") }}';
                        alertBox.classList.remove('d-none');
                    } else {
                        badge.className = 'badge bg-success-subtle text-success px-3 py-2 rounded-pill';
                        badge.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> {{ __("الموقع يعمل بصورة طبيعية") }}';
                        alertBox.classList.add('d-none');
                    }
                }
            })
            .catch(err => {
                console.error(err);
                input.checked = !isEnabled;
                alert('{{ __("حدث خطأ أثناء تغيير وضع الصيانة") }}');
            });
        }
    </script>
@endsection