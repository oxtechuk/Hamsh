@extends('partials.Layouts.crm-master')
@section('title', __('إضافة سيارة جديدة') . ' | hamsh ')

@section('content')
    <div class="container-fluid" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">

        {{-- Header --}}
        <nav class="crm-breadcrumb">
            <a href="{{ route('crm.dashboard') }}">{{ __('الرئيسية') }}</a>
            <span class="sep">›</span>
            <a href="{{ route('crm.cars.index') }}">{{ __('الكتالوج') }}</a>
            <span class="sep">›</span>
            <span class="current">{{ __('إضافة سيارة جديدة') }}</span>
        </nav>

        <form action="{{ route('crm.cars.store') }}" method="POST" enctype="multipart/form-data" id="car-form">
            @csrf

            {{-- Sticky Save Bar --}}
            <div class="car-save-bar">
                <span class="fw-bold" style="font-size:15px;">{{ __('إضافة سيارة جديدة') }}</span>
                <div class="d-flex gap-2">
                    <a href="{{ route('crm.cars.index') }}" class="btn-crm-light">{{ __('إلغاء') }}</a>
                    <button type="submit" class="btn-crm-primary">
                        <i class="bi bi-check2-circle"></i> {{ __('حفظ السيارة') }}
                    </button>
                </div>
            </div>

            @if($errors->any())
                <div class="alert alert-danger mb-4">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    {{ __('يوجد أخطاء في البيانات المدخلة') }}
                </div>
            @endif

            <div class="row g-4">

                {{-- ===== الجانب الرئيسي ===== --}}
                <div class="col-12 col-lg-8">

                    {{-- البيانات الأساسية --}}
                    <div class="car-section mb-4">
                        <div class="car-section-header">
                            <i class="bi bi-info-circle"></i> {{ __('البيانات الأساسية') }}
                        </div>
                        <div class="car-section-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">{{ __('الماركة') }} <span class="text-danger">*</span></label>
                                    <select name="brand_id" class="form-select @error('brand_id') is-invalid @enderror"
                                        required>
                                        <option value="">{{ __('اختر الماركة') }}</option>
                                        @foreach($brands as $brand)
                                            <option value="{{ $brand->id }}" {{ old('brand_id') == $brand->id ? 'selected' : '' }}>{{ $brand->name }}</option>
                                        @endforeach
                                    </select>
                                    @error('brand_id')
                                    <div class="invalid-feedback">{{ $message }}</div> @enderror
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">{{ __('النوع') }} <span class="text-danger">*</span></label>
                                    <select name="type" class="form-select" required>
                                        @foreach($carTypes as $carType)
                                            <option value="{{ $carType->slug }}" {{ old('type') === $carType->slug ? 'selected' : '' }}>{{ $carType->name }}</option>
                                        @endforeach
                                    </select>
                                </div>

                                {{-- الموديل Searchable Combobox with Quick Add --}}
                                <div class="col-md-6">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <label class="form-label mb-0">{{ __('الموديل') }} <span class="text-danger">*</span></label>
                                        <button type="button" class="btn btn-link btn-sm text-primary p-0 text-decoration-none fw-semibold" onclick="promptNewModel()">
                                            <i class="bi bi-plus-circle"></i> {{ __('إضافة موديل جديد') }}
                                        </button>
                                    </div>
                                    <div class="dropdown model-combobox-wrapper">
                                        <div class="input-group">
                                            <input type="text" name="model" id="car_model_input" class="form-control @error('model') is-invalid @enderror"
                                                value="{{ old('model') }}" placeholder="{{ __('اختر أو اكتب الموديل (مثال: Camry LE)') }}"
                                                required autocomplete="off" data-bs-toggle="dropdown" aria-expanded="false" oninput="filterModelsList(this.value)">
                                            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="bi bi-chevron-down"></i>
                                            </button>
                                            <ul class="dropdown-menu w-100 p-2 shadow-lg rounded-3 border-0" id="modelsDropdownList" style="max-height: 280px; overflow-y: auto; z-index: 1050;">
                                                <li class="p-1">
                                                    <div class="input-group input-group-sm mb-2">
                                                        <span class="input-group-text bg-light border-0"><i class="bi bi-search"></i></span>
                                                        <input type="text" id="model_inline_search" class="form-control bg-light border-0" placeholder="{{ __('بحث في الموديلات...') }}" oninput="filterModelsList(this.value)">
                                                    </div>
                                                </li>
                                                <li><hr class="dropdown-divider my-1"></li>
                                                <li class="dropdown-header text-muted small fw-bold px-2">{{ __('الموديلات السابقة المسجلة') }}</li>
                                                <div id="models_items_container">
                                                    @foreach($existingModels as $m)
                                                        <li>
                                                            <a class="dropdown-item rounded-2 py-1.5 px-2 model-option-item" href="javascript:void(0)" onclick="selectModel('{{ $m }}')">
                                                                <i class="bi bi-car-front text-muted me-1"></i> {{ $m }}
                                                            </a>
                                                        </li>
                                                    @endforeach
                                                </div>
                                                <li id="no_model_found" class="text-center text-muted small py-2 d-none">{{ __('لا يوجد موديل مطابق') }}</li>
                                                <li><hr class="dropdown-divider my-1"></li>
                                                <li class="p-1">
                                                    <button type="button" class="btn btn-sm btn-primary w-100 d-flex align-items-center justify-content-center gap-1 rounded-2" onclick="promptNewModel()">
                                                        <i class="bi bi-plus-lg"></i> {{ __('إضافة موديل مخصص') }}
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        @error('model')
                                        <div class="invalid-feedback d-block">{{ $message }}</div> @enderror
                                    </div>
                                </div>

                                <div class="col-md-2">
                                    <label class="form-label">{{ __('سنة الصنع') }} <span
                                            class="text-danger">*</span></label>
                                    <input type="number" name="year" class="form-control"
                                        value="{{ old('year', date('Y')) }}" min="2000" max="2030" required>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label">{{ __('حالة الإتاحة') }}</label>
                                    <select name="availability_status" class="form-select">
                                        <option value="available">{{ __('متاحة للعرض') }}</option>
                                        <option value="order_now">{{ __('اطلب الآن') }}</option>
                                        <option value="on_request">{{ __('عند الطلب') }}</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label">{{ __('التقييم') }}</label>
                                    <input type="number" name="rating" class="form-control" value="{{ old('rating') }}"
                                        min="0" max="5" step="0.1" placeholder="0.0">
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- اسم السيارة --}}
                    <div class="car-section mb-4">
                        <div class="car-section-header">
                            <i class="bi bi-translate"></i> {{ __('اسم السيارة') }}
                        </div>
                        <div class="car-section-body">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">{{ __('بالعربية') }} <span
                                            class="text-danger">*</span></label>
                                    <input type="text" name="name[ar]"
                                        class="form-control @error('name.ar') is-invalid @enderror"
                                        value="{{ old('name.ar') }}" placeholder="{{ __('مثال: تويوتا كامري') }}" required
                                        dir="rtl">
                                    @error('name.ar')
                                    <div class="invalid-feedback">{{ $message }}</div> @enderror
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">{{ __('بالإنجليزية') }} <span
                                            class="text-danger">*</span></label>
                                    <input type="text" name="name[en]"
                                        class="form-control @error('name.en') is-invalid @enderror"
                                        value="{{ old('name.en') }}" placeholder="{{ __('e.g. Toyota Camry') }}" required
                                        dir="ltr">
                                    @error('name.en')
                                    <div class="invalid-feedback">{{ $message }}</div> @enderror
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">{{ __('الوصف (عربي)') }}</label>
                                    <textarea name="description[ar]" class="form-control" rows="3" dir="rtl"
                                        placeholder="{{ __('وصف السيارة...') }}">{{ old('description.ar') }}</textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">{{ __('الوصف (إنجليزي)') }}</label>
                                    <textarea name="description[en]" class="form-control" rows="3" dir="ltr"
                                        placeholder="{{ __('Car description...') }}">{{ old('description.en') }}</textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- التسعير --}}
                    <div class="car-section mb-4">
                        <div class="car-section-header">
                            <i class="bi bi-currency-dollar"></i> {{ __('التسعير والتقسيط') }}
                        </div>
                        <div class="car-section-body">
                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label">{{ __('سعر الكاش') }} <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="number" name="cash_price" class="form-control"
                                            value="{{ old('cash_price') }}" min="0" required>
                                        <span class="input-group-text">{!! __('ريال') !!}</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">{{ __('أقل مقدم') }} <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="number" name="min_down_payment" class="form-control"
                                            value="{{ old('min_down_payment') }}" min="0" required>
                                        <span class="input-group-text">{!! __('ريال') !!}</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">{{ __('أقل قسط شهري') }} <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group">
                                        <input type="number" name="min_installment" class="form-control"
                                            value="{{ old('min_installment') }}" min="0" required>
                                        <span class="input-group-text">{!! __('ريال') !!}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- المواصفات التقنية والمميزات وميزات السلامة --}}
                    <div class="car-section mb-4">
                        <div class="car-section-header">
                            <i class="bi bi-speedometer2"></i> {{ __('المواصفات التقنية والمميزات') }}
                        </div>
                        <div class="car-section-body">
                            <div class="row g-3 mb-4">
                                <div class="col-md-3">
                                    <label class="form-label">{{ __('قوة المحرك') }}</label>
                                    <input type="text" name="specs[hp]" class="form-control"
                                        placeholder="{{ __('300 HP') }}" value="{{ old('specs.hp') }}">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">{{ __('نوع الوقود') }}</label>
                                    <input type="text" name="specs[fuel]" class="form-control"
                                        placeholder="{{ __('بنزين / كهربائي') }}" value="{{ old('specs.fuel') }}">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">{{ __('ناقل الحركة') }}</label>
                                    <input type="text" name="specs[gearbox]" class="form-control"
                                        placeholder="{{ __('أوتوماتيك') }}" value="{{ old('specs.gearbox') }}">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">{{ __('عدد المقاعد') }}</label>
                                    <input type="number" name="specs[seats]" class="form-control"
                                        placeholder="{{ __('5') }}" value="{{ old('specs.seats') }}">
                                </div>
                            </div>

                            {{-- المواصفات --}}
                            <div class="border rounded-3 p-3 mb-4 bg-light-subtle">
                                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                    <div class="d-flex align-items-center gap-2">
                                        <i class="bi bi-card-checklist text-primary fs-5"></i>
                                        <label class="form-label mb-0 fw-bold">{{ __('المواصفات') }}</label>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="input-group input-group-sm" style="max-width: 200px;">
                                            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                                            <input type="text" class="form-control border-start-0" placeholder="{{ __('بحث...') }}" oninput="filterGrid(this, 'specs_grid')">
                                        </div>
                                        <div class="btn-group btn-group-sm">
                                            <button type="button" class="btn btn-outline-secondary"
                                                onclick="toggleCheckboxes('specifications[]', true)">{{ __('الكل') }}</button>
                                            <button type="button" class="btn btn-outline-secondary"
                                                onclick="toggleCheckboxes('specifications[]', false)">{{ __('إلغاء') }}</button>
                                        </div>
                                        <button type="button" class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onclick="openQuickAddModal('specification')">
                                            <i class="bi bi-plus-lg"></i> {{ __('إضافة مواصفة') }}
                                        </button>
                                    </div>
                                </div>
                                <div class="checkbox-grid-container" id="specs_grid">
                                    <div class="row g-2" id="specs_items_row">
                                        @foreach($specifications as $spec)
                                            <div class="col-md-4 col-lg-3 grid-item-col" data-name="{{ strtolower($spec->name) }}">
                                                <div class="checkbox-item-wrapper">
                                                    <input type="checkbox" name="specifications[]" value="{{ $spec->id }}"
                                                        id="spec_{{ $spec->id }}" class="btn-check" {{ is_array(old('specifications')) && in_array($spec->id, old('specifications')) ? 'checked' : '' }}>
                                                    <label
                                                        class="btn btn-outline-premium w-100 text-start d-flex align-items-center gap-2"
                                                        for="spec_{{ $spec->id }}">
                                                        <i class="bi bi-check-circle-fill check-icon"></i>
                                                        <span>{{ $spec->name }}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>

                            {{-- المميزات --}}
                            <div class="border rounded-3 p-3 mb-4 bg-light-subtle">
                                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                    <div class="d-flex align-items-center gap-2">
                                        <i class="bi bi-stars text-warning fs-5"></i>
                                        <label class="form-label mb-0 fw-bold">{{ __('المميزات') }}</label>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="input-group input-group-sm" style="max-width: 200px;">
                                            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                                            <input type="text" class="form-control border-start-0" placeholder="{{ __('بحث...') }}" oninput="filterGrid(this, 'features_grid')">
                                        </div>
                                        <div class="btn-group btn-group-sm">
                                            <button type="button" class="btn btn-outline-secondary"
                                                onclick="toggleCheckboxes('features_list[]', true)">{{ __('الكل') }}</button>
                                            <button type="button" class="btn btn-outline-secondary"
                                                onclick="toggleCheckboxes('features_list[]', false)">{{ __('إلغاء') }}</button>
                                        </div>
                                        <button type="button" class="btn btn-sm btn-outline-warning text-dark d-flex align-items-center gap-1" onclick="openQuickAddModal('feature')">
                                            <i class="bi bi-plus-lg"></i> {{ __('إضافة ميزة') }}
                                        </button>
                                    </div>
                                </div>
                                <div class="checkbox-grid-container" id="features_grid">
                                    <div class="row g-2" id="features_items_row">
                                        @foreach($features_list as $feat)
                                            <div class="col-md-4 col-lg-3 grid-item-col" data-name="{{ strtolower($feat->name) }}">
                                                <div class="checkbox-item-wrapper">
                                                    <input type="checkbox" name="features_list[]" value="{{ $feat->id }}"
                                                        id="feat_{{ $feat->id }}" class="btn-check" {{ is_array(old('features_list')) && in_array($feat->id, old('features_list')) ? 'checked' : '' }}>
                                                    <label
                                                        class="btn btn-outline-premium w-100 text-start d-flex align-items-center gap-2"
                                                        for="feat_{{ $feat->id }}">
                                                        <i class="bi bi-check-circle-fill check-icon"></i>
                                                        <span>{{ $feat->name }}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>

                            {{-- ميزات السلامة --}}
                            <div class="border rounded-3 p-3 bg-light-subtle">
                                <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                                    <div class="d-flex align-items-center gap-2">
                                        <i class="bi bi-shield-check text-success fs-5"></i>
                                        <label class="form-label mb-0 fw-bold">{{ __('ميزات السلامة والأمان') }}</label>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="input-group input-group-sm" style="max-width: 200px;">
                                            <span class="input-group-text bg-white border-end-0"><i class="bi bi-search"></i></span>
                                            <input type="text" class="form-control border-start-0" placeholder="{{ __('بحث...') }}" oninput="filterGrid(this, 'safety_grid')">
                                        </div>
                                        <div class="btn-group btn-group-sm">
                                            <button type="button" class="btn btn-outline-secondary"
                                                onclick="toggleCheckboxes('safety_features[]', true)">{{ __('الكل') }}</button>
                                            <button type="button" class="btn btn-outline-secondary"
                                                onclick="toggleCheckboxes('safety_features[]', false)">{{ __('إلغاء') }}</button>
                                        </div>
                                        <button type="button" class="btn btn-sm btn-outline-success d-flex align-items-center gap-1" onclick="openQuickAddModal('safety_feature')">
                                            <i class="bi bi-plus-lg"></i> {{ __('إضافة ميزة سلامة') }}
                                        </button>
                                    </div>
                                </div>
                                <div class="checkbox-grid-container" id="safety_grid">
                                    <div class="row g-2" id="safety_items_row">
                                        @foreach($safety_features as $safetyFeat)
                                            <div class="col-md-4 col-lg-3 grid-item-col" data-name="{{ strtolower($safetyFeat->name) }}">
                                                <div class="checkbox-item-wrapper">
                                                    <input type="checkbox" name="safety_features[]"
                                                        value="{{ $safetyFeat->id }}" id="safety_feat_{{ $safetyFeat->id }}"
                                                        class="btn-check" {{ is_array(old('safety_features')) && in_array($safetyFeat->id, old('safety_features')) ? 'checked' : '' }}>
                                                    <label
                                                        class="btn btn-outline-premium w-100 text-start d-flex align-items-center gap-2"
                                                        for="safety_feat_{{ $safetyFeat->id }}">
                                                        <i class="bi bi-check-circle-fill check-icon"></i>
                                                        <span>{{ $safetyFeat->name }}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- ===== الألوان ===== --}}
                    <div class="car-section mb-4">
                        <div class="car-section-header d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-palette"></i> {{ __('الألوان المتاحة') }}</span>
                            <button type="button" class="btn-crm-primary" style="padding:6px 14px;font-size:12px;"
                                onclick="addColorRow()">
                                <i class="bi bi-plus-lg"></i> {{ __('إضافة لون') }}
                            </button>
                        </div>
                        <div class="car-section-body">
                            <div id="colors-container">
                                {{-- Color Row Template rendered by JS --}}
                            </div>
                            <p id="no-colors-msg" class="text-muted text-center py-3" style="font-size:13px;">
                                <i class="bi bi-palette2 d-block fs-2 mb-2 opacity-25"></i>
                                {{ __('لم تضف ألواناً بعد — اضغط "إضافة لون"') }}
                            </p>
                        </div>
                    </div>

                    {{-- ===== فئات ومواصفات السيارة (Car Trims) ===== --}}
                    <div class="car-section mb-4">
                        <div class="car-section-header d-flex justify-content-between align-items-center">
                            <span><i class="bi bi-diagram-3"></i> {{ __('فئات السيارة (Trims & Specs)') }}</span>
                            <button type="button" class="btn-crm-primary" style="padding:6px 14px;font-size:12px;"
                                onclick="addTrimRow()">
                                <i class="bi bi-plus-lg"></i> {{ __('إضافة فئة') }}
                            </button>
                        </div>
                        <div class="car-section-body">
                            <div id="trims-container" class="d-flex flex-column gap-3">
                                {{-- Trim Cards rendered by JS --}}
                            </div>
                            <p id="no-trims-msg" class="text-muted text-center py-3" style="font-size:13px;">
                                <i class="bi bi-card-list d-block fs-2 mb-2 opacity-25"></i>
                                {{ __('لم تضف فئات بعد — اضغط "إضافة فئة" لإضافة فئات وأسعار ومواصفات مخصصة تظهر في القائمة المنسدلة للسيارة') }}
                            </p>
                        </div>
                    </div>



                </div>

                {{-- ===== الجانب الأيمن ===== --}}
                <div class="col-12 col-lg-4">

                    {{-- الإعدادات --}}
                    <div class="car-section mb-4">
                        <div class="car-section-header">
                            <i class="bi bi-gear"></i> {{ __('الإعدادات') }}
                        </div>
                        <div class="car-section-body">
                            <div class="d-flex align-items-center justify-content-between p-3 rounded-3 mb-3"
                                style="background:#F8F9FC;border:1px solid var(--crm-border);">
                                <div>
                                    <div class="fw-bold" style="font-size:13px;">{{ __('عرض في الصفحة الرئيسية') }}</div>
                                    <small class="text-muted">{{ __('تظهر في قسم المميزة') }}</small>
                                </div>
                                <div class="form-check form-switch mb-0">
                                    <input class="form-check-input" type="checkbox" name="is_featured" id="isFeatured"
                                        value="1" {{ old('is_featured') ? 'checked' : '' }} style="width:40px;height:22px;">
                                </div>
                            </div>
                            <div class="d-flex flex-column p-3 rounded-3 mb-3"
                                style="background:#F8F9FC;border:1px solid var(--crm-border);">
                                <div class="mb-2">
                                    <div class="fw-bold" style="font-size:13px;">{{ __('سيارة محددة / Highlight') }}</div>
                                    <small class="text-muted">{{ __('تظهر في تبويبات الصفحة الرئيسية') }}</small>
                                </div>
                                <select name="is_highlighted" class="form-select form-select-sm">
                                    <option value="none" {{ old('is_highlighted') == 'none' ? 'selected' : '' }}>
                                        {{ __('بدون تمييز') }}</option>
                                    <option value="new_arrival" {{ old('is_highlighted') == 'new_arrival' ? 'selected' : '' }}>{{ __('أحدث السيارات') }}</option>
                                    <option value="featured" {{ old('is_highlighted') == 'featured' ? 'selected' : '' }}>
                                        {{ __('سيارات مختارة') }}</option>
                                    <option value="trending" {{ old('is_highlighted') == 'trending' ? 'selected' : '' }}>
                                        {{ __('الأكثر طلباً') }}</option>
                                    <option value="exclusive" {{ old('is_highlighted') == 'exclusive' ? 'selected' : '' }}>
                                        {{ __('إصدار خاص') }}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {{-- الصور --}}
                    <div class="car-section mb-4">
                        <div class="car-section-header">
                            <i class="bi bi-images"></i> {{ __('الصور') }}
                        </div>
                        <div class="car-section-body">
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label">{{ __('الصورة الرئيسية') }} <span
                                            class="text-danger">*</span></label>
                                    <div class="car-img-drop" id="thumb-drop"
                                        onclick="document.getElementById('thumbnailInput').click()">
                                        <i class="bi bi-cloud-upload fs-2 d-block mb-2 opacity-40"></i>
                                        <span>{{ __('اضغط لرفع صورة رئيسية') }}</span>
                                        <small class="d-block text-muted">{{ __('JPG, PNG, WebP — حد أقصى 5MB') }}</small>
                                    </div>
                                    <input type="file" name="thumbnail" id="thumbnailInput" accept="image/*" class="d-none">
                                    <img id="thumbPreview" class="car-img-preview d-none mt-2">
                                </div>
                                <div class="col-12">
                                    <label class="form-label">{{ __('صور خارجية') }}</label>
                                    <input type="file" name="exterior_images[]" class="form-control" accept="image/*"
                                        multiple>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">{{ __('صور داخلية') }}</label>
                                    <input type="file" name="interior_images[]" class="form-control" accept="image/*"
                                        multiple>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- زر الحفظ --}}
                    <div class="car-section">
                        <div class="car-section-body">
                            <button type="submit" class="btn-crm-primary w-100"
                                style="padding:14px;font-size:15px;justify-content:center;">
                                <i class="bi bi-check2-circle fs-5"></i> {{ __('حفظ السيارة') }}
                            </button>
                            <a href="{{ route('crm.cars.index') }}" class="btn-crm-light w-100 mt-2"
                                style="justify-content:center;">
                                {{ __('إلغاء') }}
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </form>
    </div>

    <style>
        .car-save-bar {
            position: sticky;
            top: 64px;
            z-index: 90;
            background: #fff;
            border-bottom: 1px solid var(--crm-border);
            padding: 12px 0 12px 0;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .car-section {
            background: #fff;
            border: 1px solid var(--crm-border);
            border-radius: var(--crm-radius);
            overflow: hidden;
        }

        .car-section-header {
            padding: 14px 20px;
            font-size: 14px;
            font-weight: 800;
            color: var(--crm-text);
            background: #FAFBFD;
            border-bottom: 1px solid var(--crm-border);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .car-section-body {
            padding: 20px;
        }

        .car-img-drop {
            border: 2px dashed var(--crm-border);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            transition: 0.2s;
            background: #FAFBFD;
            font-size: 13px;
            color: var(--crm-text-muted);
        }

        .car-img-drop:hover {
            border-color: var(--crm-red);
            background: var(--crm-red-light);
        }

        .car-img-preview {
            max-height: 160px;
            border-radius: 10px;
            border: 1px solid var(--crm-border);
        }

        /* Premium Checkbox Grid */
        .checkbox-grid-container {
            max-height: 300px;
            overflow-y: auto;
            padding: 15px;
            background: #fcfcfd;
            border: 1px solid #edf0f5;
            border-radius: 12px;
        }

        .checkbox-grid-container::-webkit-scrollbar {
            width: 6px;
        }

        .checkbox-grid-container::-webkit-scrollbar-thumb {
            background: #e0e0e0;
            border-radius: 10px;
        }

        .btn-outline-premium {
            border: 1px solid #edf0f5;
            background: #fff;
            color: #4a5568;
            padding: 10px 15px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s ease;
            text-align: right !important;
        }

        .btn-outline-premium:hover {
            background: #f7fafc;
            border-color: var(--crm-red);
            color: var(--crm-red);
        }

        .btn-check:checked+.btn-outline-premium {
            background: var(--crm-red-light);
            border-color: var(--crm-red);
            color: var(--crm-red);
            box-shadow: 0 4px 12px #c59b271A
        }

        .check-icon {
            font-size: 16px;
            opacity: 0;
            transition: all 0.2s ease;
        }

        .btn-check:checked+.btn-outline-premium .check-icon {
            opacity: 1;
        }

        /* Color Row */
        .color-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            border: 1px solid var(--crm-border);
            border-radius: 10px;
            margin-bottom: 8px;
            background: #FAFBFD;
        }

        .color-row .color-swatch {
            width: 36px;
            height: 36px;
            border-radius: 8px;
            border: 2px solid var(--crm-border);
            flex-shrink: 0;
            cursor: pointer;
        }

        .color-row input[type="color"] {
            opacity: 0;
            position: absolute;
            width: 36px;
            height: 36px;
            cursor: pointer;
        }

        .color-row .color-img-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            color: var(--crm-text-muted);
            padding: 6px 12px;
            border: 1px solid var(--crm-border);
            border-radius: 8px;
            cursor: pointer;
            background: #fff;
            white-space: nowrap;
        }

        .color-row .color-img-label:hover {
            border-color: var(--crm-red);
            color: var(--crm-red);
        }

        .color-row .color-img-preview {
            width: 36px;
            height: 36px;
            border-radius: 6px;
            object-fit: cover;
            border: 1px solid var(--crm-border);
        }

        .color-row .color-remove {
            background: none;
            border: none;
            color: var(--crm-red);
            cursor: pointer;
            font-size: 18px;
            flex-shrink: 0;
            padding: 0;
        }
    </style>

@endsection

@section('scripts')
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script>
        $(document).ready(function () {
            $('.select2').select2({ theme: 'bootstrap-5', width: '100%', dir: '{{ app()->getLocale() == "ar" ? "rtl" : "ltr" }}' });
        });

        // Thumbnail preview
        document.getElementById('thumbnailInput').addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                const preview = document.getElementById('thumbPreview');
                preview.src = e.target.result;
                preview.classList.remove('d-none');
                document.getElementById('thumb-drop').style.display = 'none';
            };
            reader.readAsDataURL(file);
        });

        // Drag & Drop
        const drop = document.getElementById('thumb-drop');
        drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = 'var(--crm-red)'; });
        drop.addEventListener('dragleave', () => { drop.style.borderColor = ''; });
        drop.addEventListener('drop', e => {
            e.preventDefault();
            document.getElementById('thumbnailInput').files = e.dataTransfer.files;
            document.getElementById('thumbnailInput').dispatchEvent(new Event('change'));
        });

        // ===== Color Rows =====
        let colorCount = 0;

        function addColorRow(name = '', hex = '#dcbb73', imgSrc = '') {
            const idx = colorCount++;
            const noMsg = document.getElementById('no-colors-msg');
            if (noMsg) noMsg.style.display = 'none';

            const container = document.getElementById('colors-container');
            const div = document.createElement('div');
            div.className = 'color-row';
            div.id = 'color-row-' + idx;
            div.innerHTML = `
            <div style="position:relative;flex-shrink:0;">
                <div class="color-swatch" id="swatch-${idx}" style="background:${hex};" onclick="document.getElementById('hex-${idx}').click()"></div>
                <input type="color" id="hex-${idx}" name="color_hexes[]" value="${hex}"
                       style="position:absolute;top:0;left:0;opacity:0;width:36px;height:36px;cursor:pointer;"
                       oninput="document.getElementById('swatch-${idx}').style.background=this.value">
            </div>
            <input type="text" name="color_names[]" class="form-control" placeholder="{{ __('اسم اللون (أحمر، أبيض...)') }}"
                   value="${name}" style="flex:1;font-size:13px;">
            <div style="position:relative;flex-shrink:0;">
                <label class="color-img-label" for="cimg-${idx}">
                    <i class="bi bi-image"></i>
                    <span id="cimg-lbl-${idx}">{{ __('صورة اللون') }}</span>
                </label>
                <input type="file" id="cimg-${idx}" name="color_images[${idx}]" accept="image/*" class="d-none"
                       onchange="previewColorImg(this, ${idx})">
            </div>
            ${imgSrc ? `<img id="cprev-${idx}" src="${imgSrc}" class="color-img-preview">` : `<img id="cprev-${idx}" class="color-img-preview d-none">`}
            <button type="button" class="color-remove" onclick="removeColorRow(${idx})" title="{{ __('حذف') }}">
                <i class="bi bi-x-circle-fill"></i>
            </button>
        `;
            container.appendChild(div);
        }

        function removeColorRow(idx) {
            document.getElementById('color-row-' + idx)?.remove();
            if (document.querySelectorAll('.color-row').length === 0) {
                const noMsg = document.getElementById('no-colors-msg');
                if (noMsg) noMsg.style.display = '';
            }
        }

        function previewColorImg(input, idx) {
            if (!input.files[0]) return;
            const reader = new FileReader();
            reader.onload = e => {
                const prev = document.getElementById('cprev-' + idx);
                prev.src = e.target.result;
                prev.classList.remove('d-none');
                document.getElementById('cimg-lbl-' + idx).textContent = '{{ __("تم الرفع") }} ✓';
            };
            reader.readAsDataURL(input.files[0]);
        }

        // ===== Trim (فئات السيارة) Rows =====
        let trimCount = 0;

        function escapeTrimHtml(str) {
            if (!str) return '';
            return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        function addTrimRow(name = '', imgSrc = '', cashPrice = '', installment = '', availability = '', engine = '', transmission = '', safety = '', lighting = '') {
            const idx = trimCount++;
            const noMsg = document.getElementById('no-trims-msg');
            if (noMsg) noMsg.style.display = 'none';

            const container = document.getElementById('trims-container');
            const div = document.createElement('div');
            div.className = 'trim-card p-3 rounded-3 border bg-light-subtle';
            div.id = 'trim-row-' + idx;
            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <span class="fw-bold small text-dark"><i class="bi bi-tag-fill text-warning me-1"></i> {{ __('فئة') }} #${idx + 1}</span>
                    <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2 rounded-2" onclick="removeTrimRow(${idx})" title="{{ __('حذف') }}">
                        <i class="bi bi-trash3"></i> {{ __('حذف الفئة') }}
                    </button>
                </div>
                <div class="row g-2">
                    <div class="col-md-7">
                        <label class="form-label small fw-semibold mb-1">{{ __('اسم الفئة') }} <span class="text-danger">*</span></label>
                        <input type="text" name="trim_names[]" class="form-control form-control-sm" placeholder="{{ __('مثال: كامري GLE 2026 هايبرد (الأكثر طلباً)') }}" value="${escapeTrimHtml(name)}" required>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label small fw-semibold mb-1">{{ __('صورة الفئة') }}</label>
                        <div class="d-flex align-items-center gap-2">
                            <label class="color-img-label w-100 justify-content-center py-1.5" for="timg-${idx}" style="cursor:pointer;">
                                <i class="bi bi-image"></i>
                                <span id="timg-lbl-${idx}">${imgSrc ? '{{ __("تم الرفع") }} ✓' : '{{ __("صورة الفئة") }}'}</span>
                            </label>
                            <input type="file" id="timg-${idx}" name="trim_images[${idx}]" accept="image/*" class="d-none" onchange="previewTrimImg(this, ${idx})">
                            <img id="tprev-${idx}" src="${imgSrc || ''}" class="rounded border ${imgSrc ? '' : 'd-none'}" style="width:36px;height:36px;object-fit:cover;flex-shrink:0;">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small fw-semibold mb-1">{{ __('سعر الكاش المقدر') }}</label>
                        <div class="input-group input-group-sm">
                            <input type="number" name="trim_cash_prices[]" class="form-control" placeholder="{{ __('115000') }}" value="${cashPrice}">
                            <span class="input-group-text">{!! __('ريال') !!}</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small fw-semibold mb-1">{{ __('القسط الشهري التقديري') }}</label>
                        <div class="input-group input-group-sm">
                            <input type="number" name="trim_installments[]" class="form-control" placeholder="{{ __('1650') }}" value="${installment}">
                            <span class="input-group-text">{!! __('ريال') !!}</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small fw-semibold mb-1">{{ __('حالة التوفر / التنبيه') }}</label>
                        <input type="text" name="trim_availabilities[]" class="form-control form-control-sm" placeholder="{{ __('🔥 متبقي سيارتين فقط - ع وشك النفاذ!') }}" value="${escapeTrimHtml(availability)}">
                    </div>
                    <div class="col-12 mt-2">
                        <div class="small fw-bold text-muted mb-1"><i class="bi bi-sliders me-1"></i> {{ __('المواصفات البسيطة للفئة:') }}</div>
                        <div class="row g-2">
                            <div class="col-md-3">
                                <input type="text" name="trim_engines[]" class="form-control form-control-sm" placeholder="{{ __('نوع المحرك: 4 سلندر 2.5 لتر هجين') }}" value="${escapeTrimHtml(engine)}">
                            </div>
                            <div class="col-md-3">
                                <input type="text" name="trim_transmissions[]" class="form-control form-control-sm" placeholder="{{ __('ناقل الحركة: أوتوماتيك تناسقي') }}" value="${escapeTrimHtml(transmission)}">
                            </div>
                            <div class="col-md-3">
                                <input type="text" name="trim_safeties[]" class="form-control form-control-sm" placeholder="{{ __('أنظمة الأمان: تويوتا سيفتي سينس') }}" value="${escapeTrimHtml(safety)}">
                            </div>
                            <div class="col-md-3">
                                <input type="text" name="trim_lightings[]" class="form-control form-control-sm" placeholder="{{ __('الإضاءة: مصابيح LED أمامية وخلفية') }}" value="${escapeTrimHtml(lighting)}">
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(div);
        }

        function removeTrimRow(idx) {
            document.getElementById('trim-row-' + idx)?.remove();
            if (document.querySelectorAll('.trim-card').length === 0) {
                const noMsg = document.getElementById('no-trims-msg');
                if (noMsg) noMsg.style.display = '';
            }
        }

        function previewTrimImg(input, idx) {
            if (!input.files[0]) return;
            const reader = new FileReader();
            reader.onload = e => {
                const prev = document.getElementById('tprev-' + idx);
                prev.src = e.target.result;
                prev.classList.remove('d-none');
                document.getElementById('timg-lbl-' + idx).textContent = '{{ __("تم الرفع") }} ✓';
            };
            reader.readAsDataURL(input.files[0]);
        }

        // Toggle checkboxes helper
        function toggleCheckboxes(name, state) {
            const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
            checkboxes.forEach(cb => cb.checked = state);
        }

        // ===== Model Combobox Helpers =====
        function selectModel(val) {
            const input = document.getElementById('car_model_input');
            input.value = val;
            const dropdown = bootstrap.Dropdown.getInstance(input);
            if (dropdown) dropdown.hide();
        }

        function filterModelsList(val) {
            val = (val || '').toLowerCase().trim();
            const items = document.querySelectorAll('.model-option-item');
            let found = 0;
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (!val || text.includes(val)) {
                    item.parentElement.style.display = '';
                    found++;
                } else {
                    item.parentElement.style.display = 'none';
                }
            });
            const noFound = document.getElementById('no_model_found');
            if (noFound) {
                if (found === 0 && val.length > 0) {
                    noFound.classList.remove('d-none');
                } else {
                    noFound.classList.add('d-none');
                }
            }
        }

        function promptNewModel() {
            const model = prompt('{{ __("أدخل اسم الموديل الجديد:") }}');
            if (model && model.trim()) {
                const input = document.getElementById('car_model_input');
                input.value = model.trim();
                
                // Add to list dynamically if not exists
                const container = document.getElementById('models_items_container');
                const li = document.createElement('li');
                li.innerHTML = `
                    <a class="dropdown-item rounded-2 py-1.5 px-2 model-option-item active" href="javascript:void(0)" onclick="selectModel('${model.trim()}')">
                        <i class="bi bi-car-front text-muted me-1"></i> ${model.trim()}
                    </a>
                `;
                container.prepend(li);
                
                const dropdown = bootstrap.Dropdown.getInstance(input);
                if (dropdown) dropdown.hide();
            }
        }

        // ===== Filter Grid Checkboxes =====
        function filterGrid(input, containerId) {
            const query = (input.value || '').toLowerCase().trim();
            const container = document.getElementById(containerId);
            if (!container) return;
            const items = container.querySelectorAll('.grid-item-col');
            items.forEach(item => {
                const name = item.getAttribute('data-name') || '';
                if (!query || name.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // ===== Quick Add Modal for Specs / Features / Safety Features =====
        let currentQuickAddType = 'specification';
        const quickAddConfig = {
            specification: {
                title: '{{ __("إضافة مواصفة جديدة") }}',
                url: '{{ route("crm.specifications.store") }}',
                rowId: 'specs_items_row',
                inputName: 'specifications[]',
                prefix: 'spec'
            },
            feature: {
                title: '{{ __("إضافة ميزة جديدة") }}',
                url: '{{ route("crm.features.store") }}',
                rowId: 'features_items_row',
                inputName: 'features_list[]',
                prefix: 'feat'
            },
            safety_feature: {
                title: '{{ __("إضافة ميزة سلامة جديدة") }}',
                url: '{{ route("crm.safety-features.store") }}',
                rowId: 'safety_items_row',
                inputName: 'safety_features[]',
                prefix: 'safety_feat'
            }
        };

        function openQuickAddModal(type) {
            currentQuickAddType = type;
            const conf = quickAddConfig[type];
            document.getElementById('quickAddModalLabel').textContent = conf.title;
            document.getElementById('quickAddNameAr').value = '';
            document.getElementById('quickAddNameEn').value = '';
            const modal = new bootstrap.Modal(document.getElementById('quickAddModal'));
            modal.show();
        }

        function submitQuickAdd() {
            const nameAr = document.getElementById('quickAddNameAr').value.trim();
            const nameEn = document.getElementById('quickAddNameEn').value.trim() || nameAr;

            if (!nameAr) {
                alert('{{ __("يرجى كتابة الاسم بالعربية على الأقل") }}');
                return;
            }

            const conf = quickAddConfig[currentQuickAddType];
            const btn = document.getElementById('btnSubmitQuickAdd');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> {{ __("جاري الإضافة...") }}';

            fetch(conf.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: { ar: nameAr, en: nameEn }
                })
            })
            .then(res => res.json())
            .then(data => {
                btn.disabled = false;
                btn.innerHTML = '<i class="bi bi-plus-circle me-1"></i> {{ __("إضافة") }}';

                if (data.success && data.item) {
                    const row = document.getElementById(conf.rowId);
                    const id = data.item.id;
                    const name = data.item.name;
                    const col = document.createElement('div');
                    col.className = 'col-md-4 col-lg-3 grid-item-col';
                    col.setAttribute('data-name', name.toLowerCase());
                    col.innerHTML = `
                        <div class="checkbox-item-wrapper">
                            <input type="checkbox" name="${conf.inputName}" value="${id}"
                                id="${conf.prefix}_${id}" class="btn-check" checked>
                            <label class="btn btn-outline-premium w-100 text-start d-flex align-items-center gap-2"
                                for="${conf.prefix}_${id}">
                                <i class="bi bi-check-circle-fill check-icon"></i>
                                <span>${name}</span>
                            </label>
                        </div>
                    `;
                    row.appendChild(col);

                    const modalEl = document.getElementById('quickAddModal');
                    const modal = bootstrap.Modal.getInstance(modalEl);
                    if (modal) modal.hide();
                } else {
                    alert(data.message || '{{ __("حدث خطأ أثناء الإضافة") }}');
                }
            })
            .catch(err => {
                console.error(err);
                btn.disabled = false;
                btn.innerHTML = '<i class="bi bi-plus-circle me-1"></i> {{ __("إضافة") }}';
                alert('{{ __("حدث خطأ في الاتصال بالخادم") }}');
            });
        }
    </script>

    {{-- Modal for Quick Add --}}
    <div class="modal fade" id="quickAddModal" tabindex="-1" aria-labelledby="quickAddModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-bold" id="quickAddModalLabel">{{ __('إضافة عنصر جديد') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body py-4">
                    <div class="mb-3">
                        <label class="form-label fw-semibold small text-muted">{{ __('الاسم بالعربية') }} <span class="text-danger">*</span></label>
                        <input type="text" id="quickAddNameAr" class="form-control" placeholder="{{ __('مثال: نظام مراقبة النقطة العمياء') }}" dir="rtl">
                    </div>
                    <div class="mb-0">
                        <label class="form-label fw-semibold small text-muted">{{ __('الاسم بالإنجليزية (اختياري)') }}</label>
                        <input type="text" id="quickAddNameEn" class="form-control" placeholder="{{ __('e.g. Blind Spot Monitoring') }}" dir="ltr">
                    </div>
                </div>
                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-light rounded-3 px-4" data-bs-dismiss="modal">{{ __('إلغاء') }}</button>
                    <button type="button" id="btnSubmitQuickAdd" class="btn btn-primary rounded-3 px-4" onclick="submitQuickAdd()">
                        <i class="bi bi-plus-circle me-1"></i> {{ __('إضافة') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
@endsection