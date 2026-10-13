@extends('partials.Layouts.crm-master')
@section('title', __('تتبع ومصادر الطلبات') . ' | AutoCRM')

@section('css')
<style>
    .tracking-tab-btn {
        padding: 10px 22px;
        font-weight: 700;
        border-radius: 12px;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        text-decoration: none;
    }
    .tracking-tab-btn.active {
        background: #0f172a;
        color: #fff !important;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
    }
    .tracking-tab-btn:not(.active) {
        background: #f1f5f9;
        color: #475569;
    }
    .tracking-tab-btn:not(.active):hover {
        background: #e2e8f0;
        color: #0f172a;
    }

    /* KPI Cards */
    .kpi-card {
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .kpi-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.05);
    }
    .kpi-icon-box {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
    }

    /* Platform Grid */
    .platform-card {
        background: #fff;
        border-radius: 16px;
        padding: 18px;
        border: 1px solid #e2e8f0;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        text-decoration: none;
        display: block;
        color: inherit;
    }
    .platform-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.06);
        border-color: #cbd5e1;
        color: inherit;
    }
    .platform-card.selected-source {
        border: 2px solid #0f172a !important;
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
    }
    .platform-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
    }
    .platform-badge {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }

    /* Source Colors */
    .source-snapchat { background: #fffbe6; color: #d48806; border: 1px solid #ffe58f; }
    .source-instagram { background: #fff0f6; color: #c41d7f; border: 1px solid #ffadd2; }
    .source-facebook { background: #e6f7ff; color: #1877f2; border: 1px solid #91d5ff; }
    .source-tiktok { background: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; }
    .source-google { background: #f6ffed; color: #389e0d; border: 1px solid #b7eb8f; }
    .source-direct { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }

    /* Quality Flags */
    .badge-fraud-clean {
        background: #ecfdf5;
        color: #047857;
        border: 1px solid #a7f3d0;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 12px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }
    .badge-fraud-suspicious {
        background: #fef2f2;
        color: #b91c1c;
        border: 1px solid #fecaca;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 12px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }

    /* Custom Table Styling */
    .tracking-table {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
    }
    .tracking-table th {
        background: #f8fafc;
        padding: 14px 16px;
        font-size: 12px;
        font-weight: 700;
        color: #475569;
        border-bottom: 2px solid #e2e8f0;
    }
    .tracking-table td {
        padding: 16px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
        font-size: 13px;
        background: #fff;
    }
    .tracking-table tr:hover td {
        background: #f8fafc;
    }

    /* Kanban Styles */
    .kanban-board { 
        display: grid; 
        grid-template-columns: repeat(5, 1fr); 
        gap: 20px; 
        align-items: start; 
        padding-bottom: 20px;
    }
    .kanban-col { 
        background: #f8f9fa; 
        border-radius: 20px; 
        min-height: 80vh; 
        display: flex; 
        flex-direction: column; 
        border: 1px solid #edf2f7;
    }
    .kanban-col-header { 
        padding: 20px; 
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
        border-bottom: 1px solid #edf2f7;
    }
    .kanban-col-title { 
        font-weight: 800; 
        font-size: 15px; 
        color: #2d3748; 
    }
    .kanban-col-count { 
        background: #fff; 
        border-radius: 10px; 
        font-size: 12px; 
        font-weight: 800; 
        color: #4a5568; 
        padding: 4px 12px; 
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .kanban-col-body { 
        padding: 15px; 
        display: flex; 
        flex-direction: column; 
        gap: 12px; 
        flex-grow: 1;
    }
    .kanban-card { 
        background: #fff; 
        border-radius: 15px; 
        padding: 18px; 
        border: 1px solid #edf2f7; 
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        cursor: pointer; 
        box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .kanban-card:hover { 
        box-shadow: 0 10px 20px rgba(0,0,0,0.06); 
        transform: translateY(-5px); 
        border-color: #0f172a;
    }
    .kanban-card-id { 
        font-size: 11px; 
        font-weight: 800; 
        color: #a0aec0; 
        margin-bottom: 8px; 
        display: block;
    }
    .kanban-card-name { 
        font-size: 15px; 
        font-weight: 800; 
        color: #1a202c; 
        margin-bottom: 6px; 
    }
    .kanban-card-car {
        font-size: 13px;
        color: #718096;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .kanban-card-footer { 
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
        margin-top: 15px; 
        padding-top: 12px; 
        border-top: 1px dashed #edf2f7;
    }
    .kanban-card-time { 
        font-size: 11px; 
        color: #a0aec0; 
        font-weight: 600; 
    }
    .kanban-card-meta { 
        display: flex; 
        align-items: center; 
        gap: 8px; 
    }
    .kanban-note-badge { 
        font-size: 10px; 
        font-weight: 800; 
        background: #f1f5f9; 
        color: #64748b; 
        padding: 2px 8px; 
        border-radius: 6px; 
    }
    .kanban-avatar { 
        width: 28px; 
        height: 28px; 
        border-radius: 10px; 
        background: #0f172a; 
        color: #fff; 
        font-size: 11px; 
        font-weight: 800; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        border: 2px solid #fff; 
    }

    @media (max-width: 1200px) { .kanban-board { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 768px) {
        .kanban-board {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 14px;
            padding-bottom: 16px;
        }
        .kanban-col {
            flex: 0 0 calc(100vw - 60px);
            scroll-snap-align: start;
            min-height: 60vh;
        }
    }
</style>
@endsection

@section('content')
<div class="container-fluid py-3" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">

    {{-- Top Title & Actions Bar --}}
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
            <h4 class="mb-1 fw-bold text-dark d-flex align-items-center gap-2">
                <i class="bi bi-crosshair text-primary"></i>
                {{ __('تتبع مصادر الطلبات وكشف الزور') }}
            </h4>
            <p class="text-muted mb-0 small">
                {{ __('معرفة مصدر كل طلب زائر (سناب شات، إنستغرام، فيسبوك، تيك توك، جوجل) وكشف الطلبات المزورة والسبام') }}
            </p>
        </div>

        <div class="d-flex flex-wrap align-items-center gap-2">
            {{-- Tabs --}}
            <a href="{{ route('crm.tracking.index', array_merge(request()->query(), ['tab' => 'sources'])) }}" 
               class="tracking-tab-btn {{ $tab === 'sources' ? 'active' : '' }}">
                <i class="bi bi-graph-up-arrow"></i>
                {{ __('مصادر الزوار والتحليلات') }}
            </a>
            <a href="{{ route('crm.tracking.index', array_merge(request()->query(), ['tab' => 'kanban'])) }}" 
               class="tracking-tab-btn {{ $tab === 'kanban' ? 'active' : '' }}">
                <i class="bi bi-kanban"></i>
                {{ __('مسار الحالات (Kanban)') }}
            </a>

            {{-- Date Range Form --}}
            <form method="GET" action="{{ route('crm.tracking.index') }}" class="d-inline-flex align-items-center ms-lg-2">
                <input type="hidden" name="tab" value="{{ $tab }}">
                @if(request('source')) <input type="hidden" name="source" value="{{ request('source') }}"> @endif
                @if(request('fraud')) <input type="hidden" name="fraud" value="{{ request('fraud') }}"> @endif
                @if(request('status')) <input type="hidden" name="status" value="{{ request('status') }}"> @endif

                <select name="date_range" class="form-select form-select-sm fw-bold border-secondary-subtle" onchange="this.form.submit()">
                    <option value="today" {{ $dateFilter === 'today' ? 'selected' : '' }}>{{ __('اليوم') }}</option>
                    <option value="yesterday" {{ $dateFilter === 'yesterday' ? 'selected' : '' }}>{{ __('أمس') }}</option>
                    <option value="this_week" {{ $dateFilter === 'this_week' ? 'selected' : '' }}>{{ __('هذا الأسبوع') }}</option>
                    <option value="this_month" {{ $dateFilter === 'this_month' ? 'selected' : '' }}>{{ __('هذا الشهر') }}</option>
                    <option value="all" {{ $dateFilter === 'all' ? 'selected' : '' }}>{{ __('جميع الأوقات') }}</option>
                </select>
            </form>
        </div>
    </div>

    @if (session('success'))
        <div class="alert alert-success alert-dismissible fade show rounded-3 py-2 px-3 mb-4" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i> {{ session('success') }}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    @endif

    {{-- TAB 1: TRAFFIC ATTRIBUTION & FRAUD DETECTION --}}
    @if($tab === 'sources')

        {{-- 1. KPI Cards --}}
        <div class="row g-3 mb-4">
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-bold">{{ __('إجمالي طلبات الزوار') }}</span>
                        <div class="kpi-icon-box bg-primary-subtle text-primary">
                            <i class="bi bi-cart-check"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1 text-dark">{{ number_format($totalOrders) }}</h3>
                    <span class="text-muted x-small">
                        <i class="bi bi-clock me-1"></i> {{ __('الفترة المحددة') }}
                    </span>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-bold">{{ __('طلبات موثوقة ونظيفة') }}</span>
                        <div class="kpi-icon-box bg-success-subtle text-success">
                            <i class="bi bi-shield-check"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1 text-success">{{ number_format($verifiedOrders) }}</h3>
                    <span class="text-muted x-small">
                        {{ $totalOrders > 0 ? round(($verifiedOrders / $totalOrders) * 100, 1) : 0 }}% {{ __('نسبة الموثوقية') }}
                    </span>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-bold">{{ __('شبهة طلبات مزورة / وهمية') }}</span>
                        <div class="kpi-icon-box bg-danger-subtle text-danger">
                            <i class="bi bi-shield-exclamation"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-1 text-danger">{{ number_format($suspiciousOrders) }}</h3>
                    <span class="text-muted x-small">
                        {{ $totalOrders > 0 ? round(($suspiciousOrders / $totalOrders) * 100, 1) : 0 }}% {{ __('رقم وهمي / سبام') }}
                    </span>
                </div>
            </div>

            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="text-muted small fw-bold">{{ __('أعلى منصة جلباً للطلبات') }}</span>
                        <div class="kpi-icon-box bg-warning-subtle text-warning">
                            <i class="bi bi-trophy"></i>
                        </div>
                    </div>
                    <h4 class="fw-bold mb-1 text-dark text-truncate">{{ $topPlatform }}</h4>
                    <span class="text-muted x-small">
                        {{ number_format($soldOrders) }} {{ __('تم البيع بنجاح ✓') }}
                    </span>
                </div>
            </div>
        </div>

        {{-- 2. Platform Channel Cards (Snapchat, Instagram, Facebook, TikTok, Google, Direct) --}}
        <div class="mb-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
                <h6 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <i class="bi bi-share text-primary"></i>
                    {{ __('توزيع مصادر الطلبات حسب المنصات الإعلانية') }}
                </h6>
                <span class="text-muted small">{{ __('انقر على أي منصة لفلترة الجدول أدناه تلقائياً') }}</span>
            </div>

            <div class="row g-3">
                @foreach($platformStats as $pKey => $p)
                @php
                    $isSelected = request('source') === $pKey;
                @endphp
                <div class="col-12 col-sm-6 col-lg-4 col-xl-2">
                    <a href="{{ route('crm.tracking.index', array_merge(request()->query(), ['source' => $isSelected ? 'all' : $pKey])) }}" 
                       class="platform-card {{ $isSelected ? 'selected-source' : '' }}">
                        <div class="platform-header">
                            <span class="fw-bold text-dark fs-6">{{ $p['short_label'] }}</span>
                            <div class="platform-badge source-{{ $pKey }}">
                                @if($pKey === 'snapchat')
                                    <i class="bi bi-snapchat"></i>
                                @elseif($pKey === 'instagram')
                                    <i class="bi bi-instagram"></i>
                                @elseif($pKey === 'facebook')
                                    <i class="bi bi-facebook"></i>
                                @elseif($pKey === 'tiktok')
                                    <i class="bi bi-tiktok"></i>
                                @elseif($pKey === 'google')
                                    <i class="bi bi-google"></i>
                                @else
                                    <i class="bi bi-globe"></i>
                                @endif
                            </div>
                        </div>

                        <div class="d-flex align-items-baseline justify-content-between mb-2">
                            <span class="fs-4 fw-bold text-dark">{{ number_format($p['total']) }}</span>
                            <span class="badge bg-light text-secondary border fw-semibold">{{ $p['share_percent'] }}%</span>
                        </div>

                        <div class="pt-2 border-top border-light-subtle d-flex justify-content-between x-small text-muted">
                            <span><i class="bi bi-check-circle text-success me-1"></i>{{ $p['sold'] }} {{ __('مبيعات') }}</span>
                            @if($p['suspicious'] > 0)
                                <span class="text-danger fw-bold"><i class="bi bi-exclamation-triangle me-1"></i>{{ $p['suspicious'] }} {{ __('وهمي') }}</span>
                            @else
                                <span class="text-success"><i class="bi bi-shield me-1"></i>{{ __('سليم') }}</span>
                            @endif
                        </div>
                    </a>
                </div>
                @endforeach
            </div>
        </div>

        {{-- 3. Filter Toolbar & Detailed Orders Table --}}
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            {{-- Toolbar --}}
            <div class="card-header bg-white border-bottom p-3">
                <form method="GET" action="{{ route('crm.tracking.index') }}" class="row g-2 align-items-center">
                    <input type="hidden" name="tab" value="sources">
                    <input type="hidden" name="date_range" value="{{ $dateFilter }}">

                    {{-- Search --}}
                    <div class="col-12 col-md-4">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
                            <input type="text" name="search" class="form-control bg-light border-start-0" 
                                   placeholder="{{ __('بحث بالاسم، الهاتف، الحملة الإعلانية...') }}" 
                                   value="{{ request('search') }}">
                        </div>
                    </div>

                    {{-- Platform Filter --}}
                    <div class="col-6 col-md-2">
                        <select name="source" class="form-select form-select-sm" onchange="this.form.submit()">
                            <option value="all">{{ __('جميع المنصات') }}</option>
                            <option value="snapchat" {{ request('source') === 'snapchat' ? 'selected' : '' }}>{{ __('سناب شات') }}</option>
                            <option value="instagram" {{ request('source') === 'instagram' ? 'selected' : '' }}>{{ __('إنستغرام') }}</option>
                            <option value="facebook" {{ request('source') === 'facebook' ? 'selected' : '' }}>{{ __('فيسبوك') }}</option>
                            <option value="tiktok" {{ request('source') === 'tiktok' ? 'selected' : '' }}>{{ __('تيك توك') }}</option>
                            <option value="google" {{ request('source') === 'google' ? 'selected' : '' }}>{{ __('جوجل') }}</option>
                            <option value="direct" {{ request('source') === 'direct' ? 'selected' : '' }}>{{ __('مباشر') }}</option>
                        </select>
                    </div>

                    {{-- Fraud Status Filter --}}
                    <div class="col-6 col-md-2">
                        <select name="fraud" class="form-select form-select-sm" onchange="this.form.submit()">
                            <option value="all">{{ __('جميع حالات الجودة') }}</option>
                            <option value="clean" {{ request('fraud') === 'clean' ? 'selected' : '' }}>{{ __('طلبات موثوقة فقط ✓') }}</option>
                            <option value="suspicious" {{ request('fraud') === 'suspicious' ? 'selected' : '' }}>{{ __('طلبات مشكوك فيها / وهمية ⚠️') }}</option>
                        </select>
                    </div>

                    {{-- Booking Status Filter --}}
                    <div class="col-6 col-md-2">
                        <select name="status" class="form-select form-select-sm" onchange="this.form.submit()">
                            <option value="all">{{ __('جميع الحالات') }}</option>
                            @foreach($statuses as $stKey => $st)
                                <option value="{{ $stKey }}" {{ request('status') === $stKey ? 'selected' : '' }}>{{ $st['label'] }}</option>
                            @endforeach
                        </select>
                    </div>

                    {{-- Submit & Reset --}}
                    <div class="col-6 col-md-2 d-flex gap-2">
                        <button type="submit" class="btn btn-sm btn-dark w-100 fw-bold">{{ __('فلترة') }}</button>
                        <a href="{{ route('crm.tracking.index', ['tab' => 'sources', 'date_range' => $dateFilter]) }}" class="btn btn-sm btn-outline-secondary" title="{{ __('إعادة ضبط') }}">
                            <i class="bi bi-arrow-counterclockwise"></i>
                        </a>
                    </div>
                </form>
            </div>

            {{-- Table --}}
            <div class="table-responsive">
                <table class="tracking-table">
                    <thead>
                        <tr>
                            <th>{{ __('رقم الطلب / التاريخ') }}</th>
                            <th>{{ __('بيانات العميل') }}</th>
                            <th>{{ __('السيارة المطلوبة') }}</th>
                            <th>{{ __('مصدر الزيارة / الحملة الإعلانية') }}</th>
                            <th>{{ __('فحص الزور والجودة') }}</th>
                            <th>{{ __('البيئة والجهاز') }}</th>
                            <th>{{ __('الحالة') }}</th>
                            <th class="text-end">{{ __('الإجراءات') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($orders as $booking)
                        @php
                            $sourceMeta = $booking->traffic_source_meta;
                        @endphp
                        <tr>
                            {{-- Order ID & Time --}}
                            <td>
                                <a href="{{ route('crm.bookings.show', $booking) }}" class="fw-bold text-dark text-decoration-none">
                                    #BK-{{ str_pad($booking->id, 5, '0', STR_PAD_LEFT) }}
                                </a>
                                <div class="text-muted x-small">
                                    <i class="bi bi-clock me-1"></i> {{ $booking->created_at->format('Y-m-d H:i') }}
                                </div>
                            </td>

                            {{-- Client Info --}}
                            <td>
                                <div class="fw-bold text-dark">{{ $booking->client_name }}</div>
                                <div class="small text-muted d-flex align-items-center gap-1">
                                    <i class="bi bi-telephone text-primary"></i>
                                    <span dir="ltr">{{ $booking->client_phone }}</span>
                                    <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $booking->client_phone) }}" 
                                       target="_blank" class="text-success ms-1" title="{{ __('مراسلة واتساب') }}">
                                        <i class="bi bi-whatsapp"></i>
                                    </a>
                                </div>
                            </td>

                            {{-- Car --}}
                            <td>
                                @if($booking->car)
                                    <div class="fw-semibold text-dark">{{ $booking->car->brand?->name }} {{ $booking->car->name }}</div>
                                    <div class="x-small text-muted">{{ number_format($booking->total_price ?? $booking->car->cash_price ?? 0) }} ريال</div>
                                @elseif($booking->brand_name)
                                    <div class="fw-semibold text-dark">{{ $booking->brand_name }} {{ $booking->model_name }}</div>
                                    <div class="x-small text-muted">{{ $booking->booking_type_label }}</div>
                                @else
                                    <span class="text-muted small">-</span>
                                @endif
                            </td>

                            {{-- Traffic Source & Campaign --}}
                            <td>
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="platform-badge source-{{ $booking->traffic_source ?? 'direct' }}" style="width: 28px; height: 28px; font-size: 14px;">
                                        @if($booking->traffic_source === 'snapchat')
                                            <i class="bi bi-snapchat"></i>
                                        @elseif($booking->traffic_source === 'instagram')
                                            <i class="bi bi-instagram"></i>
                                        @elseif($booking->traffic_source === 'facebook')
                                            <i class="bi bi-facebook"></i>
                                        @elseif($booking->traffic_source === 'tiktok')
                                            <i class="bi bi-tiktok"></i>
                                        @elseif($booking->traffic_source === 'google')
                                            <i class="bi bi-google"></i>
                                        @else
                                            <i class="bi bi-globe"></i>
                                        @endif
                                    </span>
                                    <span class="fw-bold small">{{ $sourceMeta['short_label'] }}</span>
                                </div>
                                @if($booking->campaign_name)
                                    <div class="badge bg-light text-dark border x-small text-truncate" style="max-width: 170px;" title="{{ $booking->campaign_name }}">
                                        <i class="bi bi-megaphone me-1"></i> {{ $booking->campaign_name }}
                                    </div>
                                @endif
                                @if($booking->traffic_medium)
                                    <div class="text-muted x-small">{{ $booking->traffic_medium }}</div>
                                @endif
                            </td>

                            {{-- Fraud & Quality Verification --}}
                            <td>
                                @if($booking->is_suspicious)
                                    <span class="badge-fraud-suspicious" title="{{ implode(' | ', $booking->fraud_flags ?? ['شبهة طلب وهمي']) }}">
                                        <i class="bi bi-exclamation-triangle-fill"></i>
                                        {{ __('شبهة وهمي') }} ({{ $booking->fraud_score }}%)
                                    </span>
                                    @if(!empty($booking->fraud_flags))
                                        <div class="text-danger x-small mt-1" style="max-width: 180px; font-size: 11px;">
                                            {{ $booking->fraud_flags[0] }}
                                        </div>
                                    @endif
                                @else
                                    <span class="badge-fraud-clean">
                                        <i class="bi bi-shield-check"></i>
                                        {{ __('موثوق ✓') }}
                                    </span>
                                @endif
                            </td>

                            {{-- Environment & Device --}}
                            <td>
                                <div class="small text-muted">
                                    @if($booking->device_type === 'mobile')
                                        <i class="bi bi-phone me-1 text-primary"></i> {{ __('جوال') }}
                                    @elseif($booking->device_type === 'tablet')
                                        <i class="bi bi-tablet me-1 text-primary"></i> {{ __('تابلت') }}
                                    @else
                                        <i class="bi bi-laptop me-1 text-secondary"></i> {{ __('كمبيوتر') }}
                                    @endif
                                    @if($booking->city)
                                        - {{ $booking->city }}
                                    @endif
                                </div>
                                @if($booking->ip_address)
                                    <div class="x-small text-muted font-monospace">{{ $booking->ip_address }}</div>
                                @endif
                            </td>

                            {{-- Status --}}
                            <td>
                                <span class="badge bg-{{ $booking->status_color }}-subtle text-{{ $booking->status_color }} border border-{{ $booking->status_color }}-subtle px-2 py-1">
                                    {{ $booking->status_label }}
                                </span>
                            </td>

                            {{-- Actions --}}
                            <td class="text-end">
                                <div class="d-inline-flex align-items-center gap-1">
                                    {{-- Toggle Suspicious / Fake --}}
                                    <form method="POST" action="{{ route('crm.tracking.toggle-suspicious', $booking) }}" class="d-inline">
                                        @csrf
                                        @method('PATCH')
                                        @if($booking->is_suspicious)
                                            <button type="submit" class="btn btn-sm btn-outline-success p-1 px-2" title="{{ __('إلغاء وسم الزور وتأكيد صحة الطلب') }}">
                                                <i class="bi bi-shield-check"></i>
                                            </button>
                                        @else
                                            <button type="submit" class="btn btn-sm btn-outline-danger p-1 px-2" title="{{ __('وسم الطلب كطلب مشكوك فيه / وهمي') }}">
                                                <i class="bi bi-shield-x"></i>
                                            </button>
                                        @endif
                                    </form>

                                    {{-- View Details --}}
                                    <a href="{{ route('crm.bookings.show', $booking) }}" class="btn btn-sm btn-light border p-1 px-2" title="{{ __('عرض تفاصيل الحجز') }}">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="8" class="text-center py-5 text-muted">
                                <i class="bi bi-inbox fs-1 d-block mb-2 text-secondary-subtle"></i>
                                <span class="fw-bold">{{ __('لا توجد طلبات مطابقة للفلتر المحدد') }}</span>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            {{-- Pagination --}}
            @if($orders->hasPages())
                <div class="card-footer bg-white border-top p-3 d-flex justify-content-center">
                    {{ $orders->links('pagination::bootstrap-5') }}
                </div>
            @endif
        </div>

    {{-- TAB 2: KANBAN BOARD --}}
    @elseif($tab === 'kanban')

        <div class="kanban-board">
            @foreach($columns as $key => $col)
            <div class="kanban-col">
                <div class="kanban-col-header" style="border-top: 4px solid {{ $col['color'] }}">
                    <span class="kanban-col-title">{{ __($col['label']) }}</span>
                    <span class="kanban-col-count">{{ $col['count'] }}</span>
                </div>
                <div class="kanban-col-body">
                    @forelse($col['items'] as $booking)
                    <a href="{{ route('crm.bookings.show', $booking) }}" class="text-decoration-none">
                        <div class="kanban-card">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <span class="kanban-card-id">#BK-{{ str_pad($booking->id, 4, '0', STR_PAD_LEFT) }}</span>
                                @if($booking->is_suspicious)
                                    <span class="badge bg-danger-subtle text-danger x-small border border-danger-subtle" title="{{ __('طلب مشكوك فيه') }}">
                                        <i class="bi bi-exclamation-triangle"></i>
                                    </span>
                                @endif
                            </div>
                            <div class="kanban-card-name">{{ $booking->client_name }}</div>
                            <div class="kanban-card-car text-truncate">
                                <i class="bi bi-car-front"></i>
                                {{ $booking->car?->brand?->name }} {{ $booking->car?->name }}
                            </div>
                            
                            <div class="kanban-card-footer">
                                <div class="kanban-card-meta">
                                    <span class="kanban-card-time">
                                        <i class="bi bi-clock me-1"></i>
                                        {{ $booking->created_at->diffForHumans() }}
                                    </span>
                                    @if($booking->notes_list_count > 0)
                                    <span class="kanban-note-badge">
                                        <i class="bi bi-chat-left-text me-1"></i>
                                        {{ $booking->notes_list_count }}
                                    </span>
                                    @endif
                                </div>
                                
                                @if($booking->assignedTo)
                                <div class="kanban-avatar" title="{{ $booking->assignedTo->name }}">
                                    {{ strtoupper(substr($booking->assignedTo->name, 0, 1)) }}
                                </div>
                                @endif
                            </div>
                        </div>
                    </a>
                    @empty
                    <div class="text-center py-5 opacity-25">
                        <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                        <span class="x-small fw-bold">{{ __('فارغ') }}</span>
                    </div>
                    @endforelse
                </div>
            </div>
            @endforeach
        </div>

    @endif

</div>
@endsection
