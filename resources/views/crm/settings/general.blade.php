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
            <input type="hidden" name="home_promo_banner_submitted" value="1">

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
                                <button type="button" class="settings-nav-btn" data-tab="brand-colors">
                                    <i class="bi bi-palette2"></i> {{ __('الهوية البصرية والألوان') }}
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
                                <button type="button" class="settings-nav-btn" data-tab="promo-banner">
                                    <i class="bi bi-badge-ad"></i> {{ __('البانر الإعلاني (منتصف الصفحة)') }}
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
                                <button type="button" class="settings-nav-btn" data-tab="finance-limits">
                                    <i class="bi bi-calculator"></i> {{ __('نسب الاستقطاع والتمويل (DBR)') }}
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
                        {{-- TAB: الهوية البصرية والألوان --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-brand-colors">
                            <div class="card border-0 shadow-sm rounded-4 mb-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="fw-bold mb-0">{{ __('الهوية البصرية وتخصيص الألوان') }}</h6>
                                        <p class="text-muted small mb-0">{{ __('التحكم في ألوان المتجر الرئيسية والثانوية، أزرار التفاعل، النصوص والخلفيات بشكل ديناميكي') }}</p>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3" onclick="resetBrandColors()">
                                        <i class="bi bi-arrow-counterclockwise me-1"></i> {{ __('استعادة الافتراضي') }}
                                    </button>
                                </div>
                                <div class="card-body p-4">
                                    <div class="row g-4">
                                        {{-- اللون الأساسي --}}
                                        <div class="col-md-6">
                                            <div class="p-3 bg-light rounded-3 border">
                                                <label class="form-label fw-bold small text-dark d-flex justify-content-between align-items-center mb-2">
                                                    <span><i class="bi bi-circle-fill text-warning me-1"></i> {{ __('اللون الأساسي (Primary Color)') }}</span>
                                                    <span class="badge bg-white text-muted border text-xs">{{ __('الذهبي الافتراضي: #DDBB72') }}</span>
                                                </label>
                                                <div class="d-flex align-items-center gap-2">
                                                    <input type="color" id="theme_primary_picker" class="form-control form-control-color border-0 p-1 bg-white shadow-sm"
                                                        value="{{ $settings['theme_primary_color'] ?? '#DDBB72' }}" style="width:48px;height:42px;cursor:pointer;"
                                                        oninput="syncColorInput('theme_primary_picker', 'theme_primary_color')">
                                                    <input type="text" name="theme_primary_color" id="theme_primary_color"
                                                        class="form-control bg-white border-0 fw-mono text-uppercase"
                                                        value="{{ $settings['theme_primary_color'] ?? '#DDBB72' }}" placeholder="#DDBB72"
                                                        oninput="syncColorInput('theme_primary_color', 'theme_primary_picker')">
                                                </div>
                                                <p class="text-muted small mb-0 mt-1">{{ __('يُستخدم في الأشرطة المميزة، الأسعار، العناوين، والشارات.') }}</p>
                                            </div>
                                        </div>

                                        {{-- اللون الثانوي --}}
                                        <div class="col-md-6">
                                            <div class="p-3 bg-light rounded-3 border">
                                                <label class="form-label fw-bold small text-dark d-flex justify-content-between align-items-center mb-2">
                                                    <span><i class="bi bi-circle-fill text-primary me-1"></i> {{ __('اللون الثانوي (Secondary Color)') }}</span>
                                                    <span class="badge bg-white text-muted border text-xs">{{ __('الكحلي الافتراضي: #303A54') }}</span>
                                                </label>
                                                <div class="d-flex align-items-center gap-2">
                                                    <input type="color" id="theme_secondary_picker" class="form-control form-control-color border-0 p-1 bg-white shadow-sm"
                                                        value="{{ $settings['theme_secondary_color'] ?? '#303A54' }}" style="width:48px;height:42px;cursor:pointer;"
                                                        oninput="syncColorInput('theme_secondary_picker', 'theme_secondary_color')">
                                                    <input type="text" name="theme_secondary_color" id="theme_secondary_color"
                                                        class="form-control bg-white border-0 fw-mono text-uppercase"
                                                        value="{{ $settings['theme_secondary_color'] ?? '#303A54' }}" placeholder="#303A54"
                                                        oninput="syncColorInput('theme_secondary_color', 'theme_secondary_picker')">
                                                </div>
                                                <p class="text-muted small mb-0 mt-1">{{ __('يُستخدم في البطاقات، العناصر الثانوية، والأقسام الفرعية.') }}</p>
                                            </div>
                                        </div>

                                        {{-- لون خلفية الأزرار --}}
                                        <div class="col-md-6">
                                            <div class="p-3 bg-light rounded-3 border">
                                                <label class="form-label fw-bold small text-dark d-flex justify-content-between align-items-center mb-2">
                                                    <span><i class="bi bi-square-fill text-warning me-1"></i> {{ __('لون خلفية الأزرار (Button Background)') }}</span>
                                                    <span class="badge bg-white text-muted border text-xs">{{ __('الافتراضي: #DDBB72') }}</span>
                                                </label>
                                                <div class="d-flex align-items-center gap-2">
                                                    <input type="color" id="theme_btn_bg_picker" class="form-control form-control-color border-0 p-1 bg-white shadow-sm"
                                                        value="{{ $settings['theme_button_bg_color'] ?? '#DDBB72' }}" style="width:48px;height:42px;cursor:pointer;"
                                                        oninput="syncColorInput('theme_btn_bg_picker', 'theme_button_bg_color')">
                                                    <input type="text" name="theme_button_bg_color" id="theme_button_bg_color"
                                                        class="form-control bg-white border-0 fw-mono text-uppercase"
                                                        value="{{ $settings['theme_button_bg_color'] ?? '#DDBB72' }}" placeholder="#DDBB72"
                                                        oninput="syncColorInput('theme_button_bg_color', 'theme_btn_bg_picker')">
                                                </div>
                                                <p class="text-muted small mb-0 mt-1">{{ __('لون خلفية أزرار الدعوة للإجراء (CTA) والتفاعل في كافة الصفحات.') }}</p>
                                            </div>
                                        </div>

                                        {{-- لون نص الأزرار --}}
                                        <div class="col-md-6">
                                            <div class="p-3 bg-light rounded-3 border">
                                                <label class="form-label fw-bold small text-dark d-flex justify-content-between align-items-center mb-2">
                                                    <span><i class="bi bi-fonts me-1"></i> {{ __('لون نص الأزرار (Button Text Color)') }}</span>
                                                    <span class="badge bg-white text-muted border text-xs">{{ __('الافتراضي: #20283A') }}</span>
                                                </label>
                                                <div class="d-flex align-items-center gap-2">
                                                    <input type="color" id="theme_btn_text_picker" class="form-control form-control-color border-0 p-1 bg-white shadow-sm"
                                                        value="{{ $settings['theme_button_text_color'] ?? '#20283A' }}" style="width:48px;height:42px;cursor:pointer;"
                                                        oninput="syncColorInput('theme_btn_text_picker', 'theme_button_text_color')">
                                                    <input type="text" name="theme_button_text_color" id="theme_button_text_color"
                                                        class="form-control bg-white border-0 fw-mono text-uppercase"
                                                        value="{{ $settings['theme_button_text_color'] ?? '#20283A' }}" placeholder="#20283A"
                                                        oninput="syncColorInput('theme_button_text_color', 'theme_btn_text_picker')">
                                                </div>
                                                <p class="text-muted small mb-0 mt-1">{{ __('لون الكتابة والنصوص داخل الأزرار الرئيسية لضمان الوضوح والتباين.') }}</p>
                                            </div>
                                        </div>

                                        {{-- لون النصوص الرئيسي --}}
                                        <div class="col-md-6">
                                            <div class="p-3 bg-light rounded-3 border">
                                                <label class="form-label fw-bold small text-dark d-flex justify-content-between align-items-center mb-2">
                                                    <span><i class="bi bi-type-bold me-1"></i> {{ __('لون النصوص الرئيسي (Heading & Text Color)') }}</span>
                                                    <span class="badge bg-white text-muted border text-xs">{{ __('الافتراضي: #07111F') }}</span>
                                                </label>
                                                <div class="d-flex align-items-center gap-2">
                                                    <input type="color" id="theme_text_primary_picker" class="form-control form-control-color border-0 p-1 bg-white shadow-sm"
                                                        value="{{ $settings['theme_text_primary_color'] ?? '#07111F' }}" style="width:48px;height:42px;cursor:pointer;"
                                                        oninput="syncColorInput('theme_text_primary_picker', 'theme_text_primary_color')">
                                                    <input type="text" name="theme_text_primary_color" id="theme_text_primary_color"
                                                        class="form-control bg-white border-0 fw-mono text-uppercase"
                                                        value="{{ $settings['theme_text_primary_color'] ?? '#07111F' }}" placeholder="#07111F"
                                                        oninput="syncColorInput('theme_text_primary_color', 'theme_text_primary_picker')">
                                                </div>
                                                <p class="text-muted small mb-0 mt-1">{{ __('لون العناوين الرئيسية وأسماء السيارات والنصوص الأساسية.') }}</p>
                                            </div>
                                        </div>

                                        {{-- لون النصوص الفرعية والمساعدة --}}
                                        <div class="col-md-6">
                                            <div class="p-3 bg-light rounded-3 border">
                                                <label class="form-label fw-bold small text-dark d-flex justify-content-between align-items-center mb-2">
                                                    <span><i class="bi bi-type me-1"></i> {{ __('لون النصوص الفرعية (Secondary/Muted Text)') }}</span>
                                                    <span class="badge bg-white text-muted border text-xs">{{ __('الافتراضي: #595959') }}</span>
                                                </label>
                                                <div class="d-flex align-items-center gap-2">
                                                    <input type="color" id="theme_text_sec_picker" class="form-control form-control-color border-0 p-1 bg-white shadow-sm"
                                                        value="{{ $settings['theme_text_secondary_color'] ?? '#595959' }}" style="width:48px;height:42px;cursor:pointer;"
                                                        oninput="syncColorInput('theme_text_sec_picker', 'theme_text_secondary_color')">
                                                    <input type="text" name="theme_text_secondary_color" id="theme_text_secondary_color"
                                                        class="form-control bg-white border-0 fw-mono text-uppercase"
                                                        value="{{ $settings['theme_text_secondary_color'] ?? '#595959' }}" placeholder="#595959"
                                                        oninput="syncColorInput('theme_text_secondary_color', 'theme_text_sec_picker')">
                                                </div>
                                                <p class="text-muted small mb-0 mt-1">{{ __('لون النصوص التوضيحية والوصف والبيانات الإحصائية.') }}</p>
                                            </div>
                                        </div>

                                        {{-- لون خلفية المتجر --}}
                                        <div class="col-md-6">
                                            <div class="p-3 bg-light rounded-3 border">
                                                <label class="form-label fw-bold small text-dark d-flex justify-content-between align-items-center mb-2">
                                                    <span><i class="bi bi-paint-bucket me-1"></i> {{ __('لون خلفية الموقع (Site Background)') }}</span>
                                                    <span class="badge bg-white text-muted border text-xs">{{ __('الافتراضي: #F5F2EC') }}</span>
                                                </label>
                                                <div class="d-flex align-items-center gap-2">
                                                    <input type="color" id="theme_bg_picker" class="form-control form-control-color border-0 p-1 bg-white shadow-sm"
                                                        value="{{ $settings['theme_background_color'] ?? '#F5F2EC' }}" style="width:48px;height:42px;cursor:pointer;"
                                                        oninput="syncColorInput('theme_bg_picker', 'theme_background_color')">
                                                    <input type="text" name="theme_background_color" id="theme_background_color"
                                                        class="form-control bg-white border-0 fw-mono text-uppercase"
                                                        value="{{ $settings['theme_background_color'] ?? '#F5F2EC' }}" placeholder="#F5F2EC"
                                                        oninput="syncColorInput('theme_background_color', 'theme_bg_picker')">
                                                </div>
                                                <p class="text-muted small mb-0 mt-1">{{ __('لون أرضية وصفحات المتجر الأساسية.') }}</p>
                                            </div>
                                        </div>

                                        {{-- لون الفوتر --}}
                                        <div class="col-md-6">
                                            <div class="p-3 bg-light rounded-3 border">
                                                <label class="form-label fw-bold small text-dark d-flex justify-content-between align-items-center mb-2">
                                                    <span><i class="bi bi-layout-sidebar-inset-reverse me-1"></i> {{ __('لون تذييل الموقع (Footer Background)') }}</span>
                                                    <span class="badge bg-white text-muted border text-xs">{{ __('الافتراضي: #121317') }}</span>
                                                </label>
                                                <div class="d-flex align-items-center gap-2">
                                                    <input type="color" id="theme_footer_bg_picker" class="form-control form-control-color border-0 p-1 bg-white shadow-sm"
                                                        value="{{ $settings['theme_footer_bg_color'] ?? '#121317' }}" style="width:48px;height:42px;cursor:pointer;"
                                                        oninput="syncColorInput('theme_footer_bg_picker', 'theme_footer_bg_color')">
                                                    <input type="text" name="theme_footer_bg_color" id="theme_footer_bg_color"
                                                        class="form-control bg-white border-0 fw-mono text-uppercase"
                                                        value="{{ $settings['theme_footer_bg_color'] ?? '#121317' }}" placeholder="#121317"
                                                        oninput="syncColorInput('theme_footer_bg_color', 'theme_footer_bg_picker')">
                                                </div>
                                                <p class="text-muted small mb-0 mt-1">{{ __('لون خلفية الفوتر السفلي للموقع.') }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {{-- Live Interactive Preview --}}
                                    <div class="mt-4 pt-4 border-top">
                                        <h6 class="fw-bold mb-3 d-flex align-items-center">
                                            <i class="bi bi-eye me-2 text-primary"></i> {{ __('معاينة حية فورية للهوية البصرية (Live Theme Preview)') }}
                                        </h6>
                                        <div id="live-theme-preview-box" class="p-4 rounded-4 border shadow-sm transition-all"
                                            style="background-color: {{ $settings['theme_background_color'] ?? '#F5F2EC' }}; min-height: 220px;">
                                            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 border-bottom mb-3" style="border-color: rgba(0,0,0,0.08) !important;">
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="rounded-circle d-flex align-items-center justify-content-center"
                                                        id="preview-logo-badge" style="width:36px;height:36px; background-color: {{ $settings['theme_primary_color'] ?? '#DDBB72' }}; color: {{ $settings['theme_button_text_color'] ?? '#20283A' }}; font-weight:bold;">
                                                        H
                                                    </div>
                                                    <span class="fw-bold fs-6" id="preview-brand-title" style="color: {{ $settings['theme_text_primary_color'] ?? '#07111F' }};">
                                                        {{ $settings['site_name']['ar'] ?? 'هامش كار' }}
                                                    </span>
                                                </div>
                                                <span class="badge px-3 py-2 rounded-pill" id="preview-sec-badge"
                                                    style="background-color: {{ $settings['theme_secondary_color'] ?? '#303A54' }}; color:#ffffff;">
                                                    <i class="bi bi-shield-check me-1"></i> {{ __('ضمان معتمد') }}
                                                </span>
                                            </div>

                                            <div class="row align-items-center g-3">
                                                <div class="col-md-7">
                                                    <h5 class="fw-bold mb-2" id="preview-heading" style="color: {{ $settings['theme_text_primary_color'] ?? '#07111F' }};">
                                                        {{ __('أحدث السيارات الفاخرة بأفضل أنظمة التمويل') }}
                                                    </h5>
                                                    <p class="small mb-3" id="preview-desc" style="color: {{ $settings['theme_text_secondary_color'] ?? '#595959' }};">
                                                        {{ __('اختر سيارتك المفضلة واستمتع بتجربة شراء استثنائية مع حلول دفع ميسرة تناسب جميع الاحتياجات.') }}
                                                    </p>
                                                    <div class="d-flex align-items-center gap-2">
                                                        <button type="button" class="btn px-4 py-2 fw-bold rounded-3 shadow-sm border-0 transition"
                                                            id="preview-primary-btn"
                                                            style="background-color: {{ $settings['theme_button_bg_color'] ?? '#DDBB72' }}; color: {{ $settings['theme_button_text_color'] ?? '#20283A' }};">
                                                            <i class="bi bi-cart-check me-1"></i> {{ __('احجز سيارتك الآن') }}
                                                        </button>
                                                        <span class="fw-bold fs-5 ms-2" id="preview-price" style="color: {{ $settings['theme_primary_color'] ?? '#DDBB72' }};">
                                                            245,000 <small class="fs-6">{{ __('ر.س') }}</small>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="col-md-5">
                                                    <div class="p-3 bg-white rounded-3 shadow-sm border text-center">
                                                        <i class="bi bi-car-front fs-1 mb-1 d-block" id="preview-car-icon" style="color: {{ $settings['theme_secondary_color'] ?? '#303A54' }};"></i>
                                                        <span class="fw-bold d-block small" id="preview-car-name" style="color: {{ $settings['theme_text_primary_color'] ?? '#07111F' }};">مرسيدس بنز G-Class 2025</span>
                                                        <span class="badge mt-2" id="preview-car-tag" style="background-color: {{ $settings['theme_primary_color'] ?? '#DDBB72' }}; color: {{ $settings['theme_button_text_color'] ?? '#20283A' }};">
                                                            {{ __('قسط يبدأ من 3,500 ر.س') }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
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

                                    {{-- البيانات الرسمية والتوثيق (السجل التجاري، الضريبة، معروف) --}}
                                    <div class="border-top pt-4 mb-4">
                                        <h6 class="fw-bold mb-3 small text-dark d-flex align-items-center">
                                            <i class="bi bi-patch-check-fill text-success me-2"></i> {{ __('البيانات الرسمية والسجلات (تظهر أسفل الفوتر)') }}
                                        </h6>
                                        <div class="row g-3">
                                            <div class="col-md-4">
                                                <label class="form-label fw-semibold small text-muted">{{ __('رقم السجل التجاري') }}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light border-0"><i class="bi bi-building"></i></span>
                                                    <input type="text" name="commercial_registration_no"
                                                        class="form-control bg-light border-0" dir="ltr"
                                                        value="{{ $settings['commercial_registration_no'] ?? '' }}" placeholder="7054436493">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label fw-semibold small text-muted">{{ __('الرقم الضريبي (VAT)') }}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light border-0"><i class="bi bi-receipt"></i></span>
                                                    <input type="text" name="tax_number"
                                                        class="form-control bg-light border-0" dir="ltr"
                                                        value="{{ $settings['tax_number'] ?? '' }}" placeholder="3148150319">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label fw-semibold small text-muted">{{ __('رقم توثيق معروف / المركز السعودي للأعمال') }}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light border-0"><i class="bi bi-shield-check"></i></span>
                                                    <input type="text" name="maroof_number"
                                                        class="form-control bg-light border-0" dir="ltr"
                                                        value="{{ $settings['maroof_number'] ?? '' }}" placeholder="373677">
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <label class="form-label fw-semibold small text-muted">{{ __('رابط صفحة توثيق معروف (اختياري)') }}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light border-0"><i class="bi bi-link-45deg"></i></span>
                                                    <input type="url" name="maroof_url"
                                                        class="form-control bg-light border-0 text-start" dir="ltr"
                                                        value="{{ $settings['maroof_url'] ?? '' }}" placeholder="https://maroof.sa/...">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {{-- خريطة الموقع GPS --}}
                                    <div class="border-top pt-4 mb-4">
                                        <h6 class="fw-bold mb-3 small text-dark d-flex align-items-center">
                                            <i class="bi bi-geo-alt-fill text-danger me-2"></i> {{ __('موقع المعرض على الخريطة (GPS / Google Maps)') }}
                                        </h6>
                                        <div class="row g-3">
                                            <div class="col-12">
                                                <label class="form-label fw-semibold small text-muted">{{ __('رابط خرائط جوجل (Google Maps URL / GPS)') }}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text bg-light border-0"><i class="bi bi-map"></i></span>
                                                    <input type="url" name="gps_map_link"
                                                        class="form-control bg-light border-0 text-start" dir="ltr"
                                                        value="{{ $settings['gps_map_link'] ?? '' }}" placeholder="https://maps.google.com/?q=24.7136,46.6753">
                                                </div>
                                                <p class="text-muted small mb-0 mt-1">{{ __('يُستخدم لتوجيه العملاء عند الضغط على زر "اعرض الموقع" في بطاقة موقعنا بالفوتر.') }}</p>
                                            </div>
                                            <div class="col-12">
                                                <div class="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                                                    <div>
                                                        <p class="fw-semibold mb-0 small">{{ __('إظهار بطاقة "موقعنا (GPS)" أعلى الفوتر') }}</p>
                                                        <p class="text-muted small mb-0">{{ __('عرض كرت خريطة تفاعلي يحتوي على أيقونة GPS وزر مباشر لفتح موقع المعرض على الخريطة') }}</p>
                                                    </div>
                                                    <div class="form-check form-switch fs-5 mb-0">
                                                        <input type="hidden" name="show_footer_map" value="0">
                                                        <input class="form-check-input" type="checkbox" name="show_footer_map"
                                                            value="1" {{ ($settings['show_footer_map'] ?? '1') == '1' ? 'checked' : '' }}>
                                                    </div>
                                                </div>
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
                                        <p class="text-muted small mb-0">{{ __('الصور الإعلانية والروابط ونصوص الأزرار للديسكتوب والموبايل بشكل متجاوب') }}</p>
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
                                    <div id="hero-slides-container" class="d-flex flex-column gap-4">
                                        @foreach($heroSlides as $idx => $slide)
                                            @php
                                                $desktopImg = $slide['image_desktop'] ?? $slide['image'] ?? null;
                                                $mobileImg = $slide['image_mobile'] ?? null;
                                            @endphp
                                            <div class="hero-slide-item card border border-light-subtle rounded-3 shadow-sm overflow-hidden"
                                                id="hero-slide-{{ $idx }}">
                                                <div class="card-header bg-light py-2 px-3 border-0 d-flex justify-content-between align-items-center">
                                                    <span class="badge bg-white text-dark border px-3 py-1 fw-semibold">
                                                        <i class="bi bi-layers me-1 text-primary"></i> {{ __('شريحة') }} #{{ $idx + 1 }}
                                                    </span>
                                                    <button type="button"
                                                        class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1"
                                                        onclick="removeHeroSlide({{ $idx }})"><i
                                                            class="bi bi-x-lg"></i></button>
                                                </div>
                                                <div class="card-body p-3">
                                                    <div class="row g-3">
                                                        {{-- Desktop Image --}}
                                                        <div class="col-md-6">
                                                            <div class="p-3 bg-light rounded-3 border h-100">
                                                                <div class="d-flex justify-content-between align-items-center mb-2">
                                                                    <label class="form-label fw-bold small mb-0 text-dark">
                                                                        <i class="bi bi-laptop me-1 text-primary"></i> {{ __('بانر الديسكتوب (Desktop Banner)') }}
                                                                    </label>
                                                                    <span class="badge bg-white text-muted border text-xs">1920×600px</span>
                                                                </div>
                                                                <input type="hidden" name="hero_slides[{{ $idx }}][image_desktop_path]"
                                                                    value="{{ $desktopImg }}">
                                                                @if($desktopImg)
                                                                    <div class="rounded-3 overflow-hidden mb-2 bg-dark text-center" style="height:100px;">
                                                                        <img src="{{ asset('storage/' . $desktopImg) }}"
                                                                            class="w-100 h-100 object-fit-cover">
                                                                    </div>
                                                                @endif
                                                                <input type="file" name="hero_slides[{{ $idx }}][image_desktop]"
                                                                    class="form-control bg-white border-0 form-control-sm"
                                                                    accept="image/*">
                                                            </div>
                                                        </div>
                                                        {{-- Mobile Image --}}
                                                        <div class="col-md-6">
                                                            <div class="p-3 bg-light rounded-3 border h-100">
                                                                <div class="d-flex justify-content-between align-items-center mb-2">
                                                                    <label class="form-label fw-bold small mb-0 text-dark">
                                                                        <i class="bi bi-phone me-1 text-success"></i> {{ __('بانر الموبايل (Mobile Banner)') }}
                                                                    </label>
                                                                    <span class="badge bg-white text-muted border text-xs">750×600px / 1:1</span>
                                                                </div>
                                                                <input type="hidden" name="hero_slides[{{ $idx }}][image_mobile_path]"
                                                                    value="{{ $mobileImg }}">
                                                                @if($mobileImg)
                                                                    <div class="rounded-3 overflow-hidden mb-2 bg-dark text-center" style="height:100px;">
                                                                        <img src="{{ asset('storage/' . $mobileImg) }}"
                                                                            class="h-100 object-fit-contain">
                                                                    </div>
                                                                @else
                                                                    <div class="rounded-2 p-2 mb-2 bg-white text-center text-muted small border" style="font-size:11px;">
                                                                        <i class="bi bi-info-circle me-1"></i> {{ __('اختياري (يتم استخدام صورة الديسكتوب كبديل إذا تُرِكت فارغة)') }}
                                                                    </div>
                                                                @endif
                                                                <input type="file" name="hero_slides[{{ $idx }}][image_mobile]"
                                                                    class="form-control bg-white border-0 form-control-sm"
                                                                    accept="image/*">
                                                            </div>
                                                        </div>
                                                        {{-- Slide Link & Button Text --}}
                                                        <div class="col-12">
                                                            <div class="row g-2">
                                                                <div class="col-md-6">
                                                                    <label class="form-label fw-semibold small text-muted mb-1">{{ __('رابط الشريحة') }}</label>
                                                                    <input type="text" name="hero_slides[{{ $idx }}][link]"
                                                                        class="form-control bg-light border-0 text-start form-control-sm"
                                                                        dir="ltr" value="{{ $slide['link'] ?? '' }}"
                                                                        placeholder="/cars أو https://...">
                                                                </div>
                                                                <div class="col-md-6">
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
                        {{-- TAB: البانر الإعلاني (منتصف الصفحة) --}}
                        {{-- =============================== --}}
                        @php
                            $pb = $promoBanner ?? [];
                            $pbEnabled = !in_array($pb['enabled'] ?? '0', ['0', 0, false, 'false'], true);
                            $pbType = $pb['type'] ?? 'image';
                            $pbDesktopImg = !empty($pb['image_desktop']) ? Storage::disk('public')->url($pb['image_desktop']) : null;
                            $pbMobileImg = !empty($pb['image_mobile']) ? Storage::disk('public')->url($pb['image_mobile']) : null;
                            $pbVideoFile = !empty($pb['video_file']) ? Storage::disk('public')->url($pb['video_file']) : null;
                        @endphp
                        <div class="settings-pane d-none" id="tab-promo-banner">
                            <div class="card border-0 shadow-sm rounded-4 mb-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-2">
                                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                        <div>
                                            <h6 class="fw-bold mb-1">
                                                <i class="bi bi-badge-ad text-primary me-1"></i> {{ __('البانر الإعلاني والترويجي (منتصف الصفحة الرئيسية)') }}
                                            </h6>
                                            <p class="text-muted small mb-0">{{ __('تحكم كامل في إظهار أو إخفاء البانر الإعلاني في منتصف الصفحة واختيار نوعه وتعديل الوسائط والروابط') }}</p>
                                        </div>
                                        <div class="form-check form-switch fs-5 m-0 d-flex align-items-center gap-2">
                                            <input class="form-check-input ms-0" type="checkbox" role="switch"
                                                name="home_promo_banner[enabled]" value="1" id="promoBannerEnabledSwitch"
                                                {{ $pbEnabled ? 'checked' : '' }}>
                                            <label class="form-check-label fs-6 fw-bold text-dark" for="promoBannerEnabledSwitch">
                                                {{ __('تفعيل البانر') }}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="card-body p-4 pt-2">
                                    {{-- Info & Recommended Dimensions Box --}}
                                    <div class="alert alert-info border-0 rounded-4 p-3 mb-4 bg-primary-subtle text-primary-emphasis">
                                        <div class="d-flex align-items-start gap-2 mb-2">
                                            <i class="bi bi-info-circle-fill fs-5 mt-1 text-primary"></i>
                                            <div>
                                                <strong class="d-block mb-1">{{ __('المقاسات الموصى بها لأفضل دقة وسرعة تحميل:') }}</strong>
                                                <div class="row g-2 small">
                                                    <div class="col-md-6">
                                                        <div class="bg-white bg-opacity-75 p-2 rounded-3 border border-primary-subtle">
                                                            <span class="fw-bold text-dark"><i class="bi bi-laptop me-1"></i> {{ __('صورة الديسكتوب:') }}</span>
                                                            <code>1920 × 550 px</code> أو <code>1400 × 450 px</code> (نسبة 16:6 أو 21:9)
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="bg-white bg-opacity-75 p-2 rounded-3 border border-primary-subtle">
                                                            <span class="fw-bold text-dark"><i class="bi bi-phone me-1"></i> {{ __('صورة الموبايل:') }}</span>
                                                            <code>800 × 600 px</code> أو <code>750 × 500 px</code> (نسبة 4:3)
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="bg-white bg-opacity-75 p-2 rounded-3 border border-primary-subtle">
                                                            <span class="fw-bold text-dark"><i class="bi bi-file-earmark-play me-1"></i> {{ __('فيديو مرفوع:') }}</span>
                                                            <code>1920 × 1080 px</code> (MP4 أقل من 20MB)
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="bg-white bg-opacity-75 p-2 rounded-3 border border-primary-subtle">
                                                            <span class="fw-bold text-dark"><i class="bi bi-youtube me-1 text-danger"></i> {{ __('فيديو يوتيوب:') }}</span>
                                                            رابط فيديو مباشر متجاوب 16:9
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {{-- Banner Type Selection --}}
                                    <div class="mb-4">
                                        <label class="form-label fw-bold text-dark mb-2">{{ __('نوع البانر (اختر الوسيط الإعلاني):') }}</label>
                                        <div class="row g-3">
                                            <div class="col-md-4">
                                                <label class="card h-100 p-3 border rounded-4 cursor-pointer text-center promo-type-card {{ $pbType === 'image' ? 'border-primary bg-primary-subtle' : 'bg-light' }}" for="promoTypeImage" style="cursor: pointer;">
                                                    <div class="form-check p-0 m-0 text-center">
                                                        <input class="form-check-input d-none promo-type-radio" type="radio" name="home_promo_banner[type]" id="promoTypeImage" value="image" {{ $pbType === 'image' ? 'checked' : '' }} onchange="switchPromoBannerType('image')">
                                                        <div class="fs-2 mb-2 text-primary"><i class="bi bi-image"></i></div>
                                                        <h6 class="fw-bold mb-1">{{ __('بانر صورة مع زر ورابط') }}</h6>
                                                        <p class="text-muted small mb-0">{{ __('عرض صورة إعلانية مخصصة للشاشات الكبيرة والموبايل مع زر توجيه') }}</p>
                                                    </div>
                                                </label>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="card h-100 p-3 border rounded-4 cursor-pointer text-center promo-type-card {{ $pbType === 'video' ? 'border-primary bg-primary-subtle' : 'bg-light' }}" for="promoTypeVideo" style="cursor: pointer;">
                                                    <div class="form-check p-0 m-0 text-center">
                                                        <input class="form-check-input d-none promo-type-radio" type="radio" name="home_promo_banner[type]" id="promoTypeVideo" value="video" {{ $pbType === 'video' ? 'checked' : '' }} onchange="switchPromoBannerType('video')">
                                                        <div class="fs-2 mb-2 text-primary"><i class="bi bi-camera-video"></i></div>
                                                        <h6 class="fw-bold mb-1">{{ __('فيديو مرفوع من الجهاز') }}</h6>
                                                        <p class="text-muted small mb-0">{{ __('رفع ملف فيديو بصيغة MP4 يعمل بمشغل متطور في الموقع') }}</p>
                                                    </div>
                                                </label>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="card h-100 p-3 border rounded-4 cursor-pointer text-center promo-type-card {{ $pbType === 'youtube' ? 'border-primary bg-primary-subtle' : 'bg-light' }}" for="promoTypeYoutube" style="cursor: pointer;">
                                                    <div class="form-check p-0 m-0 text-center">
                                                        <input class="form-check-input d-none promo-type-radio" type="radio" name="home_promo_banner[type]" id="promoTypeYoutube" value="youtube" {{ $pbType === 'youtube' ? 'checked' : '' }} onchange="switchPromoBannerType('youtube')">
                                                        <div class="fs-2 mb-2 text-danger"><i class="bi bi-youtube"></i></div>
                                                        <h6 class="fw-bold mb-1">{{ __('رابط فيديو يوتيوب') }}</h6>
                                                        <p class="text-muted small mb-0">{{ __('تضمين فيديو من يوتيوب بمشغل سريع ومتجاوب مع جميع الأجهزة') }}</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <hr class="my-4 text-muted opacity-25">

                                    {{-- 1. Section: Image Uploads --}}
                                    <div id="promo-section-image" class="promo-type-section {{ $pbType === 'image' ? '' : 'd-none' }}">
                                        <h6 class="fw-bold mb-3 text-dark">
                                            <i class="bi bi-images me-1 text-primary"></i> {{ __('صور البانر (الديسكتوب والموبايل)') }}
                                        </h6>
                                        <div class="row g-4 mb-4">
                                            {{-- Desktop Image --}}
                                            <div class="col-md-6">
                                                <div class="p-3 bg-light rounded-4 border h-100">
                                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                                        <label class="form-label fw-bold small mb-0 text-dark">
                                                            <i class="bi bi-laptop me-1 text-primary"></i> {{ __('صورة الديسكتوب (Desktop Banner)') }}
                                                        </label>
                                                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle small px-2">1920 × 550 px</span>
                                                    </div>
                                                    <div class="image-upload-wrapper text-center p-3 border border-2 border-dashed rounded-3 bg-white mb-2 position-relative">
                                                        <div id="promo-desktop-preview-container" class="{{ $pbDesktopImg ? '' : 'd-none' }} mb-2 position-relative">
                                                            <img id="promo-desktop-preview" src="{{ $pbDesktopImg ?? '' }}" class="img-fluid rounded-2 shadow-sm" style="max-height: 140px; width: 100%; object-fit: cover;">
                                                            <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1 lh-1" onclick="deletePromoDesktopImage()" title="{{ __('حذف الصورة') }}">
                                                                <i class="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                        <div id="promo-desktop-placeholder" class="{{ $pbDesktopImg ? 'd-none' : '' }} py-3">
                                                            <i class="bi bi-cloud-arrow-up fs-2 text-muted opacity-50 d-block mb-1"></i>
                                                            <span class="text-muted small">{{ __('اسحب الصورة هنا أو اضغط للاختيار') }}</span>
                                                        </div>
                                                        <input type="file" name="home_promo_banner_image_desktop" id="promo_banner_image_desktop" class="form-control form-control-sm mt-2" accept="image/*" onchange="previewPromoImage(this, 'promo-desktop-preview', 'promo-desktop-preview-container', 'promo-desktop-placeholder')">
                                                        <input type="hidden" name="delete_promo_banner_desktop" id="delete_promo_banner_desktop" value="0">
                                                    </div>
                                                    <p class="text-muted small mb-0"><i class="bi bi-info-circle me-1"></i> {{ __('يتم عرض هذه الصورة على شاشات الكمبيوتر واللابتوب.') }}</p>
                                                </div>
                                            </div>

                                            {{-- Mobile Image --}}
                                            <div class="col-md-6">
                                                <div class="p-3 bg-light rounded-4 border h-100">
                                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                                        <label class="form-label fw-bold small mb-0 text-dark">
                                                            <i class="bi bi-phone me-1 text-primary"></i> {{ __('صورة الموبايل (Mobile Banner)') }}
                                                        </label>
                                                        <span class="badge bg-secondary-subtle text-secondary border small px-2">800 × 600 px</span>
                                                    </div>
                                                    <div class="image-upload-wrapper text-center p-3 border border-2 border-dashed rounded-3 bg-white mb-2 position-relative">
                                                        <div id="promo-mobile-preview-container" class="{{ $pbMobileImg ? '' : 'd-none' }} mb-2 position-relative">
                                                            <img id="promo-mobile-preview" src="{{ $pbMobileImg ?? '' }}" class="img-fluid rounded-2 shadow-sm" style="max-height: 140px; width: 100%; object-fit: cover;">
                                                            <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1 lh-1" onclick="deletePromoMobileImage()" title="{{ __('حذف الصورة') }}">
                                                                <i class="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                        <div id="promo-mobile-placeholder" class="{{ $pbMobileImg ? 'd-none' : '' }} py-3">
                                                            <i class="bi bi-phone fs-2 text-muted opacity-50 d-block mb-1"></i>
                                                            <span class="text-muted small">{{ __('اسحب صورة الموبايل هنا أو اضغط للاختيار') }}</span>
                                                        </div>
                                                        <input type="file" name="home_promo_banner_image_mobile" id="promo_banner_image_mobile" class="form-control form-control-sm mt-2" accept="image/*" onchange="previewPromoImage(this, 'promo-mobile-preview', 'promo-mobile-preview-container', 'promo-mobile-placeholder')">
                                                        <input type="hidden" name="delete_promo_banner_mobile" id="delete_promo_banner_mobile" value="0">
                                                    </div>
                                                    <p class="text-muted small mb-0"><i class="bi bi-info-circle me-1"></i> {{ __('اختياري - إذا تُركت فارغة سيتم استخدام صورة الديسكتوب تلقائياً.') }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {{-- 2. Section: Video Upload --}}
                                    <div id="promo-section-video" class="promo-type-section {{ $pbType === 'video' ? '' : 'd-none' }}">
                                        <h6 class="fw-bold mb-3 text-dark">
                                            <i class="bi bi-film me-1 text-primary"></i> {{ __('ملف الفيديو المرفوع (MP4 / WebM)') }}
                                        </h6>
                                        <div class="p-3 bg-light rounded-4 border mb-4">
                                            <div class="d-flex justify-content-between align-items-center mb-2">
                                                <label class="form-label fw-bold small mb-0 text-dark">
                                                    <i class="bi bi-file-earmark-play me-1 text-primary"></i> {{ __('رفع فيديو البانر (Max: 25MB)') }}
                                                </label>
                                                <span class="badge bg-success-subtle text-success border border-success-subtle small px-2">1080p MP4</span>
                                            </div>
                                            <div class="text-center p-3 border border-2 border-dashed rounded-3 bg-white mb-2 position-relative">
                                                <div id="promo-video-preview-container" class="{{ $pbVideoFile ? '' : 'd-none' }} mb-2 position-relative">
                                                    <video id="promo-video-preview" src="{{ $pbVideoFile ?? '' }}" controls class="rounded-3 shadow-sm w-100" style="max-height: 220px; background: #000;"></video>
                                                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle p-1 lh-1" onclick="deletePromoVideoFile()" title="{{ __('حذف الفيديو') }}">
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                                <div id="promo-video-placeholder" class="{{ $pbVideoFile ? 'd-none' : '' }} py-3">
                                                    <i class="bi bi-camera-reels fs-2 text-muted opacity-50 d-block mb-1"></i>
                                                    <span class="text-muted small">{{ __('اختر ملف فيديو MP4 أو WebM من جهازك') }}</span>
                                                </div>
                                                <input type="file" name="home_promo_banner_video" id="promo_banner_video" class="form-control form-control-sm mt-2" accept="video/mp4,video/webm,video/ogg,video/quicktime" onchange="previewPromoVideo(this)">
                                                <input type="hidden" name="delete_promo_banner_video" id="delete_promo_banner_video" value="0">
                                            </div>
                                            <p class="text-muted small mb-0"><i class="bi bi-check2-circle text-success me-1"></i> {{ __('سيعمل الفيديو بمشغل حديث متجاوب مع تشغيل تلقائي صامت وإمكانية التحكم بالصوت والتكبير.') }}</p>
                                        </div>
                                    </div>

                                    {{-- 3. Section: YouTube URL --}}
                                    <div id="promo-section-youtube" class="promo-type-section {{ $pbType === 'youtube' ? '' : 'd-none' }}">
                                        <h6 class="fw-bold mb-3 text-dark">
                                            <i class="bi bi-youtube me-1 text-danger"></i> {{ __('رابط فيديو يوتيوب (YouTube Video URL)') }}
                                        </h6>
                                        <div class="p-3 bg-light rounded-4 border mb-4">
                                            <label class="form-label fw-bold small text-dark">{{ __('رابط الفيديو من يوتيوب') }}</label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-white border-0"><i class="bi bi-youtube text-danger fs-5"></i></span>
                                                <input type="url" name="home_promo_banner[youtube_url]" id="promo_youtube_url" class="form-control bg-white border-0"
                                                    value="{{ $pb['youtube_url'] ?? '' }}"
                                                    placeholder="مثال: https://www.youtube.com/watch?v=xxxxxx أو https://youtu.be/xxxxxx"
                                                    oninput="updateYoutubePreview(this.value)">
                                            </div>
                                            <div id="youtube-preview-container" class="mt-3 {{ !empty($pb['youtube_url']) ? '' : 'd-none' }}">
                                                <p class="small text-muted mb-1">{{ __('معاينة مشغل اليوتيوب:') }}</p>
                                                <div class="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm" style="max-height: 250px;">
                                                    <iframe id="youtube-preview-iframe" src="{{ !empty($pb['youtube_url']) ? 'https://www.youtube-nocookie.com/embed/' . \Illuminate\Support\Str::of($pb['youtube_url'])->afterLast('v=')->before('&')->afterLast('/') : '' }}" allowfullscreen></iframe>
                                                </div>
                                            </div>
                                            <p class="text-muted small mt-2 mb-0"><i class="bi bi-info-circle me-1"></i> {{ __('يمكنك نسخ ولصق رابط أي فيديو من يوتيوب وسيتم تحويله لمشغل متجاوب تلقائياً.') }}</p>
                                        </div>
                                    </div>

                                    {{-- Content, Texts & Action Buttons --}}
                                    <div class="p-3 bg-light rounded-4 border mb-4">
                                        <h6 class="fw-bold mb-3 text-dark">
                                            <i class="bi bi-pencil-square me-1 text-primary"></i> {{ __('النصوص وأزرار التوجيه (اختياري)') }}
                                        </h6>
                                        <div class="row g-3">
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small text-muted">{{ __('العنوان الرئيسي — عربي') }}</label>
                                                <input type="text" name="home_promo_banner[title][ar]" class="form-control bg-white border-0"
                                                    value="{{ $pb['title']['ar'] ?? '' }}"
                                                    placeholder="مثال: عروض نهاية العام الحصرية على كافة الموديلات">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small text-muted">{{ __('العنوان الرئيسي — إنجليزي') }}</label>
                                                <input type="text" name="home_promo_banner[title][en]" class="form-control bg-white border-0"
                                                    value="{{ $pb['title']['en'] ?? '' }}"
                                                    placeholder="e.g.: Exclusive Year-End Offers On All Models">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small text-muted">{{ __('الوصف أو العنوان الفرعي — عربي') }}</label>
                                                <input type="text" name="home_promo_banner[subtitle][ar]" class="form-control bg-white border-0"
                                                    value="{{ $pb['subtitle']['ar'] ?? '' }}"
                                                    placeholder="مثال: استفد من حلول التمويل بدون دفعة أولى وأقل هامش ربح">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small text-muted">{{ __('الوصف أو العنوان الفرعي — إنجليزي') }}</label>
                                                <input type="text" name="home_promo_banner[subtitle][en]" class="form-control bg-white border-0"
                                                    value="{{ $pb['subtitle']['en'] ?? '' }}"
                                                    placeholder="e.g.: Zero down payment and lowest profit margin options">
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label fw-semibold small text-muted">{{ __('نص الزر — عربي') }}</label>
                                                <input type="text" name="home_promo_banner[button_text][ar]" class="form-control bg-white border-0"
                                                    value="{{ $pb['button_text']['ar'] ?? '' }}"
                                                    placeholder="مثال: اكتشف العروض الآن">
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label fw-semibold small text-muted">{{ __('نص الزر — إنجليزي') }}</label>
                                                <input type="text" name="home_promo_banner[button_text][en]" class="form-control bg-white border-0"
                                                    value="{{ $pb['button_text']['en'] ?? '' }}"
                                                    placeholder="e.g.: Discover Offers">
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label fw-semibold small text-muted">{{ __('رابط التوجيه (Link / URL)') }}</label>
                                                <input type="text" name="home_promo_banner[button_url]" class="form-control bg-white border-0"
                                                    value="{{ $pb['button_url'] ?? '' }}"
                                                    placeholder="مثال: /offers أو /cars أو https://...">
                                            </div>
                                            <div class="col-12">
                                                <div class="form-check form-switch mt-1">
                                                    <input class="form-check-input" type="checkbox" role="switch"
                                                        name="home_promo_banner[open_in_new_tab]" value="1" id="promoOpenInNewTab"
                                                        {{ !empty($pb['open_in_new_tab']) && in_array($pb['open_in_new_tab'], ['1', 1, true, 'true'], true) ? 'checked' : '' }}>
                                                    <label class="form-check-label small fw-semibold text-muted" for="promoOpenInNewTab">
                                                        {{ __('فتح الرابط في نافذة جديدة (Open in new tab)') }}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
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
                                {{-- سوتش إظهار / إخفاء قسم العلامات التجارية (الماركات) --}}
                                <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-2">
                                    <div class="card-body p-4">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="rounded-3 p-3 bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                                                    <i class="bi bi-award fs-5 text-warning"></i>
                                                </div>
                                                <div>
                                                    <h6 class="fw-bold mb-1">{{ __('قسم العلامات التجارية (الماركات)') }}</h6>
                                                    <p class="text-muted small mb-0">{{ __('إظهار أو إخفاء قسم استعراض السيارات حسب العلامات التجارية (ابحث حسب علامتك التجارية) في الصفحة الرئيسية') }}</p>
                                                </div>
                                            </div>
                                            <div class="form-check form-switch fs-4 mb-0">
                                                <input type="hidden" name="show_home_brands_section" value="0">
                                                <input class="form-check-input" type="checkbox" name="show_home_brands_section"
                                                    value="1" id="show_home_brands_section" {{ ($settings['show_home_brands_section'] ?? '1') == '1' ? 'checked' : '' }}>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                @php
                                    $hSections = [
                                        ['id' => 'filter', 'icon' => 'bi-search', 'label' => __('عنوان قسم البحث والفلترة'), 'fields' => ['title']],
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
                        {{-- TAB: إعدادات نسب الاستقطاع والتمويل (DBR) --}}
                        {{-- =============================== --}}
                        <div class="settings-pane d-none" id="tab-finance-limits">
                            <div class="card border-0 shadow-sm rounded-4">
                                <div class="card-header bg-transparent border-0 p-4 pb-0">
                                    <h6 class="fw-bold mb-0">{{ __('إعدادات نسب الاستقطاع وحلول التمويل (DBR)') }}</h6>
                                    <p class="text-muted small mb-0">{{ __('معادلة الحساب والتحكم في الحدود القصوى لنسب الاستقطاع ونصوص التنبيه والموافقة على توحيد الالتزامات') }}</p>
                                </div>
                                <div class="card-body p-4">
                                    <div class="row g-4">

                                        {{-- 1. بطاقة شرح المعادلة الحسابية --}}
                                        <div class="col-12">
                                            <div class="p-3.5 rounded-4 border bg-light">
                                                <div class="d-flex align-items-center gap-2 mb-2">
                                                    <span class="badge bg-primary text-white p-2 rounded-3"><i class="bi bi-calculator fs-6"></i></span>
                                                    <div>
                                                        <h6 class="fw-bold mb-0 text-dark small">{{ __('معادلة احتساب نسبة الاستقطاع (DBR Formula)') }}</h6>
                                                        <p class="text-muted small mb-0">{{ __('تُحسب نسبة الاستقطاع الفعلية تلقائياً من الراتب والالتزامات كما يلي:') }}</p>
                                                    </div>
                                                </div>
                                                <div class="p-3 rounded-3 bg-white border text-center font-monospace shadow-xs mt-2" dir="ltr">
                                                    <span class="text-primary fw-bold">Actual DBR (%)</span> = 
                                                    <span class="text-danger fw-bold">( Monthly Obligations ÷ Monthly Salary )</span> × <span class="fw-bold">100</span>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- 2. حاسبة تجريبية تفاعلية حية داخل الداشبورد --}}
                                        <div class="col-12">
                                            <div class="p-3.5 rounded-4 border bg-white shadow-xs">
                                                <div class="d-flex align-items-center justify-content-between mb-3">
                                                    <h6 class="fw-bold mb-0 text-dark small d-flex align-items-center gap-2">
                                                        <i class="bi bi-play-circle-fill text-success"></i>
                                                        {{ __('حاسبة تجريبية لاختبار المعادلة مباشرة (Live Simulator)') }}
                                                    </h6>
                                                    <span class="badge bg-success-subtle text-success small fw-bold">{{ __('تحديث فوري') }}</span>
                                                </div>

                                                <div class="row g-3">
                                                    <div class="col-md-4">
                                                        <label class="form-label small fw-semibold text-muted">{{ __('تجربة الراتب الشهري (ر.س)') }}</label>
                                                        <input type="number" id="sim_salary" class="form-control bg-light border-0" value="8000" min="1000" oninput="runDbrSimulator()">
                                                    </div>
                                                    <div class="col-md-4">
                                                        <label class="form-label small fw-semibold text-muted">{{ __('تجربة الالتزامات الشهرية (ر.س)') }}</label>
                                                        <input type="number" id="sim_obligations" class="form-control bg-light border-0" value="4000" min="0" oninput="runDbrSimulator()">
                                                    </div>
                                                    <div class="col-md-4">
                                                        <label class="form-label small fw-semibold text-muted">{{ __('نوع الالتزام التجريبي') }}</label>
                                                        <select id="sim_type" class="form-select bg-light border-0" onchange="runDbrSimulator()">
                                                            <option value="personal">{{ __('التزام شخصي / بدون التزام') }}</option>
                                                            <option value="real_estate">{{ __('عقاري + شخصي') }}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {{-- Simulator Result Card --}}
                                                <div class="mt-3 p-3 rounded-3 bg-light border">
                                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                                        <span class="small fw-bold text-dark">{{ __('نسبة الاستقطاع المحسوبة:') }}</span>
                                                        <div class="d-flex align-items-center gap-2">
                                                            <span id="sim_status_badge" class="badge bg-danger text-white fw-bold">مرتفع (تتجاوز الحد)</span>
                                                            <span id="sim_result_pct" class="fs-5 fw-black text-danger">50%</span>
                                                        </div>
                                                    </div>
                                                    <div class="progress mb-2" style="height: 10px;">
                                                        <div id="sim_progress_bar" class="progress-bar bg-danger" role="progressbar" style="width: 50%; transition: width 0.3s ease;"></div>
                                                    </div>
                                                    <div id="sim_warning_box" class="p-2.5 rounded-2 bg-danger-subtle border border-danger border-opacity-25 mt-2">
                                                        <div class="text-danger small fw-bold mb-1 d-flex align-items-center gap-1">
                                                            <i class="bi bi-exclamation-triangle-fill"></i>
                                                            <span id="sim_warning_text">{{ $settings['finance_exceeded_warning_text'] ?? 'نسبة الاستقطاع تتجاوز الحد المسموح به للتمويل.' }}</span>
                                                        </div>
                                                        <div class="form-check text-start mb-0">
                                                            <input class="form-check-input" type="checkbox" checked disabled id="sim_check">
                                                            <label class="form-check-label small fw-semibold text-dark" id="sim_solution_label">
                                                                {{ $settings['finance_debt_solution_text'] ?? 'أرغب في الاستفادة من خيارات الحلول التمويلية وتوحيد الالتزامات' }}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- DBR Limits Settings --}}
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('الحد الأقصى للاستقطاع — شخصي / بدون التزام (%)') }}</label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-0"><i class="bi bi-percent"></i></span>
                                                <input type="number" min="1" max="100" name="finance_dbr_limit_personal" id="finance_dbr_limit_personal"
                                                    class="form-control bg-light border-0"
                                                    value="{{ $settings['finance_dbr_limit_personal'] ?? '45' }}"
                                                    placeholder="45" oninput="runDbrSimulator()">
                                            </div>
                                            <p class="text-muted small mb-0 mt-1">{{ __('الحد الأقصى المسموح به للاستقطاع من الراتب للالتزامات الشخصية (الافتراضي: 45%).') }}</p>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small text-muted">{{ __('الحد الأقصى للاستقطاع — عقاري + شخصي (%)') }}</label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-0"><i class="bi bi-percent"></i></span>
                                                <input type="number" min="1" max="100" name="finance_dbr_limit_real_estate" id="finance_dbr_limit_real_estate"
                                                    class="form-control bg-light border-0"
                                                    value="{{ $settings['finance_dbr_limit_real_estate'] ?? '65' }}"
                                                    placeholder="65" oninput="runDbrSimulator()">
                                            </div>
                                            <p class="text-muted small mb-0 mt-1">{{ __('الحد الأقصى المسموح به للتمويل العقاري مع الشخصي (الافتراضي: 65%).') }}</p>
                                        </div>

                                        {{-- Texts --}}
                                        <div class="col-12">
                                            <label class="form-label fw-semibold small text-muted">{{ __('نص رسالة التنبيه عند تجاوز الحد المسموح') }}</label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-0"><i class="bi bi-exclamation-triangle-fill text-warning"></i></span>
                                                <input type="text" name="finance_exceeded_warning_text" id="finance_exceeded_warning_text"
                                                    class="form-control bg-light border-0"
                                                    value="{{ $settings['finance_exceeded_warning_text'] ?? 'نسبة الاستقطاع تتجاوز الحد المسموح به للتمويل.' }}"
                                                    placeholder="نسبة الاستقطاع تتجاوز الحد المسموح به للتمويل." oninput="runDbrSimulator()">
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <label class="form-label fw-semibold small text-muted">{{ __('نص خيار الموافقة على الحلول التمويلية وتوحيد الالتزامات') }}</label>
                                            <div class="input-group">
                                                <span class="input-group-text bg-light border-0"><i class="bi bi-check2-square text-primary"></i></span>
                                                <input type="text" name="finance_debt_solution_text" id="finance_debt_solution_text"
                                                    class="form-control bg-light border-0"
                                                    value="{{ $settings['finance_debt_solution_text'] ?? 'أرغب في الاستفادة من خيارات الحلول التمويلية وتوحيد الالتزامات' }}"
                                                    placeholder="أرغب في الاستفادة من خيارات الحلول التمويلية وتوحيد الالتزامات" oninput="runDbrSimulator()">
                                            </div>
                                            <p class="text-muted small mb-0 mt-1">{{ __('يظهر هذا الخيار للعميل عندما تتجاوز التزاماته النسبة المحددة، ليتمكن من تقديم طلبه تحت بند حلول تمويلية.') }}</p>
                                        </div>
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
                                    style="background:#c59b27;color:#fff;">
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
            div.className = 'hero-slide-item card border border-light-subtle rounded-3 shadow-sm overflow-hidden';
            div.id = 'hero-slide-' + idx;
            div.innerHTML = `
            <div class="card-header bg-light py-2 px-3 border-0 d-flex justify-content-between align-items-center">
                <span class="badge bg-white text-dark border px-3 py-1 fw-semibold">
                    <i class="bi bi-layers me-1 text-primary"></i> {{ __('شريحة جديدة') }} #${idx + 1}
                </span>
                <button type="button" class="btn btn-sm btn-light text-danger rounded-circle lh-1 p-1" onclick="removeHeroSlide(${idx})"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="card-body p-3">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3 border h-100">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label fw-bold small mb-0 text-dark">
                                    <i class="bi bi-laptop me-1 text-primary"></i> {{ __('بانر الديسكتوب (Desktop Banner)') }}
                                </label>
                                <span class="badge bg-white text-muted border text-xs">1920×600px</span>
                            </div>
                            <input type="file" name="hero_slides[${idx}][image_desktop]" class="form-control bg-white border-0 form-control-sm" accept="image/*" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-3 bg-light rounded-3 border h-100">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label fw-bold small mb-0 text-dark">
                                    <i class="bi bi-phone me-1 text-success"></i> {{ __('بانر الموبايل (Mobile Banner)') }}
                                </label>
                                <span class="badge bg-white text-muted border text-xs">750×600px / 1:1</span>
                            </div>
                            <input type="file" name="hero_slides[${idx}][image_mobile]" class="form-control bg-white border-0 form-control-sm" accept="image/*">
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="row g-2">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold small text-muted mb-1">{{ __('الرابط') }}</label>
                                <input type="text" name="hero_slides[${idx}][link]" class="form-control bg-light border-0 text-start form-control-sm" dir="ltr" placeholder="/cars أو https://...">
                            </div>
                            <div class="col-md-6">
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

        // ===== Brand Colors Sync & Live Preview =====
        function syncColorInput(sourceId, targetId) {
            const source = document.getElementById(sourceId);
            const target = document.getElementById(targetId);
            if (!source || !target) return;
            
            let val = source.value.trim();
            if (sourceId.includes('picker')) {
                target.value = val.toUpperCase();
            } else {
                if (!val.startsWith('#') && val.length > 0) {
                    val = '#' + val;
                }
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    target.value = val;
                }
            }
            updateLiveThemePreview();
        }

        function updateLiveThemePreview() {
            const primary = document.getElementById('theme_primary_color')?.value || '#DDBB72';
            const secondary = document.getElementById('theme_secondary_color')?.value || '#303A54';
            const btnBg = document.getElementById('theme_button_bg_color')?.value || '#DDBB72';
            const btnText = document.getElementById('theme_button_text_color')?.value || '#20283A';
            const textPrimary = document.getElementById('theme_text_primary_color')?.value || '#07111F';
            const textSec = document.getElementById('theme_text_secondary_color')?.value || '#595959';
            const bg = document.getElementById('theme_background_color')?.value || '#F5F2EC';

            const box = document.getElementById('live-theme-preview-box');
            if (box) box.style.backgroundColor = bg;

            const logo = document.getElementById('preview-logo-badge');
            if (logo) { logo.style.backgroundColor = primary; logo.style.color = btnText; }

            const brandTitle = document.getElementById('preview-brand-title');
            if (brandTitle) brandTitle.style.color = textPrimary;

            const secBadge = document.getElementById('preview-sec-badge');
            if (secBadge) secBadge.style.backgroundColor = secondary;

            const heading = document.getElementById('preview-heading');
            if (heading) heading.style.color = textPrimary;

            const desc = document.getElementById('preview-desc');
            if (desc) desc.style.color = textSec;

            const btn = document.getElementById('preview-primary-btn');
            if (btn) { btn.style.backgroundColor = btnBg; btn.style.color = btnText; }

            const price = document.getElementById('preview-price');
            if (price) price.style.color = primary;

            const carIcon = document.getElementById('preview-car-icon');
            if (carIcon) carIcon.style.color = secondary;

            const carName = document.getElementById('preview-car-name');
            if (carName) carName.style.color = textPrimary;

            const carTag = document.getElementById('preview-car-tag');
            if (carTag) { carTag.style.backgroundColor = primary; carTag.style.color = btnText; }
        }

        function resetBrandColors() {
            const defaults = {
                'theme_primary_color': '#DDBB72',
                'theme_secondary_color': '#303A54',
                'theme_button_bg_color': '#DDBB72',
                'theme_button_text_color': '#20283A',
                'theme_text_primary_color': '#07111F',
                'theme_text_secondary_color': '#595959',
                'theme_background_color': '#F5F2EC',
                'theme_footer_bg_color': '#121317'
            };

            for (const [key, val] of Object.entries(defaults)) {
                const input = document.getElementById(key);
                if (input) input.value = val;
            }
            document.getElementById('theme_primary_picker').value = defaults['theme_primary_color'];
            document.getElementById('theme_secondary_picker').value = defaults['theme_secondary_color'];
            document.getElementById('theme_btn_bg_picker').value = defaults['theme_button_bg_color'];
            document.getElementById('theme_btn_text_picker').value = defaults['theme_button_text_color'];
            document.getElementById('theme_text_primary_picker').value = defaults['theme_text_primary_color'];
            document.getElementById('theme_text_sec_picker').value = defaults['theme_text_secondary_color'];
            document.getElementById('theme_bg_picker').value = defaults['theme_background_color'];
            document.getElementById('theme_footer_bg_picker').value = defaults['theme_footer_bg_color'];

            updateLiveThemePreview();
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

        // ===== DBR Live Simulator =====
        function runDbrSimulator() {
            const salary = parseFloat(document.getElementById('sim_salary')?.value) || 0;
            const obligations = parseFloat(document.getElementById('sim_obligations')?.value) || 0;
            const type = document.getElementById('sim_type')?.value || 'personal';
            const personalLimit = parseFloat(document.getElementById('finance_dbr_limit_personal')?.value) || 45;
            const realEstateLimit = parseFloat(document.getElementById('finance_dbr_limit_real_estate')?.value) || 65;
            const maxLimit = type === 'real_estate' ? realEstateLimit : personalLimit;

            const warningText = document.getElementById('finance_exceeded_warning_text')?.value || 'نسبة الاستقطاع تتجاوز الحد المسموح به للتمويل.';
            const solutionText = document.getElementById('finance_debt_solution_text')?.value || 'أرغب في الاستفادة من خيارات الحلول التمويلية وتوحيد الالتزامات';

            const pct = salary > 0 ? Math.round((obligations / salary) * 100) : 0;
            const isExceeded = pct > maxLimit;

            const resultPctEl = document.getElementById('sim_result_pct');
            const statusBadgeEl = document.getElementById('sim_status_badge');
            const progressBarEl = document.getElementById('sim_progress_bar');
            const warningBoxEl = document.getElementById('sim_warning_box');
            const warningTextEl = document.getElementById('sim_warning_text');
            const solutionLabelEl = document.getElementById('sim_solution_label');

            if (resultPctEl) resultPctEl.textContent = pct + '%';
            if (progressBarEl) {
                progressBarEl.style.width = Math.min(100, Math.max(0, pct)) + '%';
            }
            if (warningTextEl) warningTextEl.textContent = warningText;
            if (solutionLabelEl) solutionLabelEl.textContent = solutionText;

            if (isExceeded) {
                if (resultPctEl) resultPctEl.className = 'fs-5 fw-black text-danger';
                if (statusBadgeEl) {
                    statusBadgeEl.className = 'badge bg-danger text-white fw-bold';
                    statusBadgeEl.textContent = 'مرتفع (تتجاوز الحد ' + maxLimit + '%)';
                }
                if (progressBarEl) progressBarEl.className = 'progress-bar bg-danger';
                if (warningBoxEl) warningBoxEl.classList.remove('d-none');
            } else if (pct > maxLimit * 0.75) {
                if (resultPctEl) resultPctEl.className = 'fs-5 fw-black text-warning';
                if (statusBadgeEl) {
                    statusBadgeEl.className = 'badge bg-warning text-dark fw-bold';
                    statusBadgeEl.textContent = 'متوسط (ضمن الحد ' + maxLimit + '%)';
                }
                if (progressBarEl) progressBarEl.className = 'progress-bar bg-warning';
                if (warningBoxEl) warningBoxEl.classList.add('d-none');
            } else {
                if (resultPctEl) resultPctEl.className = 'fs-5 fw-black text-success';
                if (statusBadgeEl) {
                    statusBadgeEl.className = 'badge bg-success text-white fw-bold';
                    statusBadgeEl.textContent = 'ممتاز (ضمن الحد ' + maxLimit + '%)';
                }
                if (progressBarEl) progressBarEl.className = 'progress-bar bg-success';
                if (warningBoxEl) warningBoxEl.classList.add('d-none');
            }
        }
        // Initialize simulator
        document.addEventListener('DOMContentLoaded', runDbrSimulator);

        // ===== Promo Banner Type Switcher & Preview =====
        function switchPromoBannerType(type) {
            document.querySelectorAll('.promo-type-card').forEach(card => {
                card.classList.remove('border-primary', 'bg-primary-subtle');
                card.classList.add('bg-light');
            });
            const selectedRadio = document.querySelector(`.promo-type-radio[value="${type}"]`);
            if (selectedRadio) {
                selectedRadio.checked = true;
                const card = selectedRadio.closest('.promo-type-card');
                if (card) {
                    card.classList.add('border-primary', 'bg-primary-subtle');
                    card.classList.remove('bg-light');
                }
            }

            document.querySelectorAll('.promo-type-section').forEach(sec => sec.classList.add('d-none'));
            const targetSec = document.getElementById(`promo-section-${type}`);
            if (targetSec) {
                targetSec.classList.remove('d-none');
            }
        }

        function previewPromoImage(input, imgId, containerId, placeholderId) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.getElementById(imgId);
                    const container = document.getElementById(containerId);
                    const placeholder = document.getElementById(placeholderId);
                    if (img) img.src = e.target.result;
                    if (container) container.classList.remove('d-none');
                    if (placeholder) placeholder.classList.add('d-none');
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        function deletePromoDesktopImage() {
            document.getElementById('delete_promo_banner_desktop').value = '1';
            document.getElementById('promo_banner_image_desktop').value = '';
            document.getElementById('promo-desktop-preview-container').classList.add('d-none');
            document.getElementById('promo-desktop-placeholder').classList.remove('d-none');
        }

        function deletePromoMobileImage() {
            document.getElementById('delete_promo_banner_mobile').value = '1';
            document.getElementById('promo_banner_image_mobile').value = '';
            document.getElementById('promo-mobile-preview-container').classList.add('d-none');
            document.getElementById('promo-mobile-placeholder').classList.remove('d-none');
        }

        function previewPromoVideo(input) {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const video = document.getElementById('promo-video-preview');
                const container = document.getElementById('promo-video-preview-container');
                const placeholder = document.getElementById('promo-video-placeholder');
                const url = URL.createObjectURL(file);
                if (video) video.src = url;
                if (container) container.classList.remove('d-none');
                if (placeholder) placeholder.classList.add('d-none');
                document.getElementById('delete_promo_banner_video').value = '0';
            }
        }

        function deletePromoVideoFile() {
            document.getElementById('delete_promo_banner_video').value = '1';
            document.getElementById('promo_banner_video').value = '';
            const video = document.getElementById('promo-video-preview');
            if (video) video.src = '';
            document.getElementById('promo-video-preview-container').classList.add('d-none');
            document.getElementById('promo-video-placeholder').classList.remove('d-none');
        }

        function updateYoutubePreview(url) {
            const container = document.getElementById('youtube-preview-container');
            const iframe = document.getElementById('youtube-preview-iframe');
            if (!url || !url.trim()) {
                if (container) container.classList.add('d-none');
                if (iframe) iframe.src = '';
                return;
            }

            let videoId = '';
            try {
                if (url.includes('youtu.be/')) {
                    videoId = url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0];
                } else if (url.includes('watch?v='')) {
                    videoId = url.split('watch?v=')[1]?.split('&')[0];
                } else if (url.includes('embed/')) {
                    videoId = url.split('embed/')[1]?.split('?')[0];
                }
            } catch(e) {}

            if (videoId) {
                if (iframe) iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
                if (container) container.classList.remove('d-none');
            } else {
                if (container) container.classList.add('d-none');
            }
        }
    </script>
@endsection