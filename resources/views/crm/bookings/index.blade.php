@extends('partials.Layouts.crm-master')
@section('title', __('الطلبات') . ' | hamsh ')

@section('content')
    <div class="container-fluid" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">

        {{-- Breadcrumb --}}
        <nav class="crm-breadcrumb">
            <a href="{{ route('crm.dashboard') }}">{{ __('الرئيسية') }}</a>
            <span class="sep">›</span>
            <span class="current">{{ __('الطلبات') }}</span>
        </nav>

        @if (session('success'))
            <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm rounded-3 mb-3" style="font-size:13px;">
                <i class="bi bi-check-circle me-1"></i> {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif
        @if (session('error'))
            <div class="alert alert-danger alert-dismissible fade show border-0 shadow-sm rounded-3 mb-3" style="font-size:13px;">
                <i class="bi bi-exclamation-triangle me-1"></i> {{ session('error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif


        {{-- Stat Cards --}}
        <div class="row g-3 mb-4">
            <div class="col-6 col-xl-4">
                <div class="crm-stat-new">
                    <span class="stat-badge orange">{{ $stats['total'] > 0 ? round(($stats['new'] / $stats['total']) * 100) : 0 }}%</span>
                    <div class="stat-icon red"><i class="bi bi-clock"></i></div>
                    <div class="stat-lbl">{{ __('بانتظار المراجعة') }}</div>
                    <div class="stat-val">{{ number_format($stats['new'] ?? 0) }}</div>
                </div>
            </div>
            <div class="col-6 col-xl-4">
                <div class="crm-stat-new">
                    <span class="stat-badge green">{{ __('اليوم') }}</span>
                    <div class="stat-icon blue"><i class="bi bi-calendar-check"></i></div>
                    <div class="stat-lbl">{{ __('عدد طلبات اليوم') }}</div>
                    <div class="stat-val">{{ number_format($stats['today'] ?? 0) }}</div>
                </div>
            </div>
            <div class="col-6 col-xl-4">
                <div class="crm-stat-new">
                    <span class="stat-badge purple">{{ __('الكل') }}</span>
                    <div class="stat-icon purple"><i class="bi bi-person-lines-fill"></i></div>
                    <div class="stat-lbl">{{ __('إجمالي عدد الطلبات') }}</div>
                    <div class="stat-val">{{ number_format($stats['total'] ?? $bookings->total()) }}</div>
                </div>
            </div>
        </div>

        {{-- Filter Bar --}}
        <form method="GET">
            <div class="card border-0 shadow-sm rounded-3 mb-4" style="border:1px solid var(--crm-border)!important;">
                <div class="card-body p-3">
                    <div class="d-flex flex-wrap gap-2 align-items-center">
                        {{-- Date --}}
                        <div style="position:relative;">
                            <input type="date" name="date" value="{{ request('date') }}"
                                style="border:1px solid var(--crm-border);border-radius:8px;padding:8px 36px 8px 14px;font-size:13px;outline:none;font-family:'Cairo',sans-serif;"
                                placeholder="{{ __('التاريخ') }}">
                            <i class="bi bi-calendar3"
                                style="position:absolute;{{ app()->getLocale() == 'ar' ? 'left' : 'right' }}:10px;top:50%;transform:translateY(-50%);color:var(--crm-text-muted);pointer-events:none;"></i>
                        </div>
                        {{-- نوع الطلب --}}
                        <select name="booking_type"
                            style="border:1px solid var(--crm-border);border-radius:8px;padding:8px 14px;font-size:13px;outline:none;font-family:'Cairo',sans-serif;min-width:150px;">
                            <option value="">{{ __('نوع الطلب — الكل') }}</option>
                            <option value="finance" {{ request('booking_type') === 'finance' ? 'selected' : '' }}>{{ __('طلب تمويل') }}</option>
                            <option value="purchase" {{ request('booking_type') === 'purchase' ? 'selected' : '' }}>{{ __('شراء كاش') }}</option>
                            <option value="test_drive" {{ request('booking_type') === 'test_drive' ? 'selected' : '' }}>{{ __('تجربة قيادة') }}</option>
                            <option value="inquiry" {{ request('booking_type') === 'inquiry' ? 'selected' : '' }}>{{ __('استفسار') }}</option>
                        </select>
                        {{-- الحالة --}}
                        <select name="status"
                            style="border:1px solid var(--crm-border);border-radius:8px;padding:8px 14px;font-size:13px;outline:none;font-family:'Cairo',sans-serif;min-width:140px;">
                            <option value="">{{ __('الحالة — الكل') }}</option>
                            @foreach($statuses as $key => $s)
                                <option value="{{ $key }}" {{ request('status') === $key ? 'selected' : '' }}>{{ $s['label'] }}
                                </option>
                            @endforeach
                        </select>
                        {{-- Search --}}
                        <div style="position:relative;flex:1;min-width:180px;">
                            <input type="text" name="search" value="{{ request('search') }}"
                                placeholder="{{ __('بحث باسم العميل أو رقم الجوال...') }}"
                                style="width:100%;border:1px solid var(--crm-border);border-radius:8px;padding:8px 36px 8px 14px;font-size:13px;outline:none;font-family:'Cairo',sans-serif;">
                            <i class="bi bi-search"
                                style="position:absolute;{{ app()->getLocale() == 'ar' ? 'left' : 'right' }}:12px;top:50%;transform:translateY(-50%);color:var(--crm-text-muted);"></i>
                        </div>
                        <button type="submit" class="btn-crm-primary" style="padding:8px 20px;">{{ __('تصفية') }}</button>
                        <a href="{{ route('crm.bookings.index') }}" class="fw-bold text-decoration-none"
                            style="font-size:13px;color:var(--crm-red);">{{ __('حذف الفلاتر') }}</a>
                    </div>
                </div>
            </div>
        </form>

        {{-- Table --}}
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden"
            style="border:1px solid var(--crm-border)!important;">
            <div class="card-header bg-white border-0 px-4 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2"
                style="border-bottom:1px solid var(--crm-border)!important;">
                <div class="d-flex align-items-center gap-2">
                    <h6 class="fw-bold mb-0">{{ __('سجل الطلبات') }}</h6>
                    <span class="badge bg-light text-muted border" style="font-size:12px;">{{ __('إجمالي الطلبات') }}:
                        <strong>{{ $bookings->total() }}</strong></span>
                </div>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <a href="{{ route('crm.bookings.export', request()->query()) }}" class="btn btn-sm btn-outline-success rounded-2 d-inline-flex align-items-center gap-1 fw-bold px-3" style="font-size:12px;">
                        <i class="bi bi-file-earmark-excel"></i>
                        <span>{{ __('تصدير إكسيل') }}</span>
                    </a>
                    @can('manage-bookings')
                        <button type="button" class="btn btn-sm btn-outline-primary rounded-2 d-inline-flex align-items-center gap-1 fw-bold px-3" data-bs-toggle="modal" data-bs-target="#importBookingsModal" style="font-size:12px;">
                            <i class="bi bi-file-earmark-arrow-up"></i>
                            <span>{{ __('استيراد إكسيل') }}</span>
                        </button>
                    @endcan
                </div>
            </div>

            {{-- Desktop Table (hidden on mobile) --}}
            {{-- Desktop Table (hidden on mobile) --}}
            <style>
                .bookings-table thead th {
                    background: #F8FAFC !important;
                    color: #475569 !important;
                    font-size: 12px;
                    font-weight: 700;
                    padding: 13px 14px;
                    border-bottom: 1px solid #E2E8F0 !important;
                    white-space: nowrap;
                }
                .bookings-table tbody td {
                    padding: 12px 14px;
                    vertical-align: middle;
                    border-bottom: 1px solid #F1F5F9;
                    font-size: 13px;
                }
                .bookings-table tbody tr:hover td {
                    background-color: #F8FAFC;
                }
                .bookings-table .order-id-badge {
                    background: #FFF1F2;
                    color: #BE123C;
                    border: 1px solid #FFE4E6;
                    font-weight: 700;
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 6px;
                    text-decoration: none;
                    transition: all 0.15s ease-in-out;
                    display: inline-block;
                }
                .bookings-table .order-id-badge:hover {
                    background: #FEE2E2;
                    color: #9F1239;
                    border-color: #FECDD3;
                }
                .bookings-table .avatar-initials {
                    width: 32px;
                    height: 32px;
                    background: #F1F5F9;
                    color: #334155;
                    border: 1px solid #E2E8F0;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 12px;
                    flex-shrink: 0;
                }
                .bookings-table .finance-pill {
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 8px;
                    padding: 6px 10px;
                    min-width: 175px;
                }
                .bookings-table .action-btn {
                    width: 30px;
                    height: 30px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    border: 1px solid #E2E8F0;
                    background: #FFFFFF;
                    color: #475569;
                    transition: all 0.15s ease-in-out;
                    text-decoration: none;
                }
                .bookings-table .action-btn:hover {
                    background: #EEF2FF;
                    color: #4338CA;
                    border-color: #C7D2FE;
                }
                .bookings-table .action-btn.wa:hover {
                    background: #ECFDF5;
                    color: #059669;
                    border-color: #A7F3D0;
                }
                .bookings-table .action-btn.del:hover {
                    background: #FEF2F2;
                    color: #DC2626;
                    border-color: #FECACA;
                }
            </style>
            <div class="table-responsive d-none d-md-block">
                <table class="table align-middle mb-0 bookings-table">
                    <thead>
                        <tr>
                            <th class="px-3" style="width:75px;">{{ __('رقم الطلب') }}</th>
                            <th style="min-width:170px;">{{ __('العميل') }}</th>
                            <th class="text-center" style="width:110px;">{{ __('نوع الطلب') }}</th>
                            <th style="min-width:160px;">{{ __('السيارة المطلوبة') }}</th>
                            <th style="min-width:145px;">{{ __('التفاصيل المالية') }}</th>
                            <th style="min-width:145px;">{{ __('المسؤول') }}</th>
                            <th style="min-width:145px;">{{ __('تاريخ ونشاط الطلب') }}</th>
                            <th style="width:115px;">{{ __('الحالة') }}</th>
                            <th class="text-center" style="width:105px;">{{ __('إجراءات') }}</th>
                        </tr>
                    </thead>
                    <tbody class="border-top-0">
                        @forelse($bookings as $b)
                            @php
                                $bType = $b->booking_type;
                                if (empty($bType)) {
                                    if (str_contains($b->notes ?? '', 'تمويل') || ($b->monthly_installment > 0 && $b->duration_years > 0)) {
                                        $bType = 'finance';
                                    } else {
                                        $bType = 'purchase';
                                    }
                                }
                                $brandName = trim($b->car?->brand?->name ?? '');
                                $carName = trim($b->car?->name ?? '');
                                if ($brandName && str_starts_with($carName, $brandName)) {
                                    $displayCarName = $carName;
                                } elseif ($brandName && $carName) {
                                    $displayCarName = $brandName . ' ' . $carName;
                                } else {
                                    $displayCarName = $carName ?: ($b->car_name ?: '—');
                                }
                            @endphp
                            <tr>
                                {{-- رقم الطلب --}}
                                <td class="px-3">
                                    <a href="{{ route('crm.bookings.show', $b) }}" class="order-id-badge">
                                        #{{ $b->id }}
                                    </a>
                                </td>

                                {{-- العميل --}}
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="avatar-initials">
                                            {{ mb_substr($b->client_name, 0, 1) }}
                                        </div>
                                        <div class="overflow-hidden">
                                            <div class="fw-bold text-dark text-truncate" style="font-size:13px;max-width:145px;" title="{{ $b->client_name }}">
                                                {{ $b->client_name }}
                                            </div>
                                            <div class="d-flex align-items-center gap-1 mt-0.5 text-muted" style="font-size:11px;">
                                                <span dir="ltr" class="font-monospace">{{ $b->client_phone }}</span>
                                                @if($b->city)
                                                    <span class="text-secondary" style="font-size:10px;">• {{ $b->city }}</span>
                                                @endif
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {{-- نوع الطلب --}}
                                <td class="text-center">
                                    @if($bType === 'finance')
                                        <span class="badge px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                                            style="background:#EEF2FF;color:#4338CA;border:1px solid #C7D2FE;font-size:11px;font-weight:700;white-space:nowrap;">
                                            <i class="bi bi-wallet2"></i> {{ __('طلب تمويل') }}
                                        </span>
                                    @elseif($bType === 'purchase')
                                        <span class="badge px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                                            style="background:#ECFDF5;color:#047857;border:1px solid #A7F3D0;font-size:11px;font-weight:700;white-space:nowrap;">
                                            <i class="bi bi-cash-stack"></i> {{ __('شراء كاش') }}
                                        </span>
                                    @elseif($bType === 'test_drive')
                                        <span class="badge px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                                            style="background:#FFFBEB;color:#B45309;border:1px solid #FDE68A;font-size:11px;font-weight:700;white-space:nowrap;">
                                            <i class="bi bi-speedometer2"></i> {{ __('تجربة قيادة') }}
                                        </span>
                                    @else
                                        <span class="badge px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1"
                                            style="background:#F1F5F9;color:#475569;border:1px solid #CBD5E1;font-size:11px;font-weight:700;white-space:nowrap;">
                                            <i class="bi bi-chat-left-text"></i> {{ __('استفسار') }}
                                        </span>
                                    @endif
                                </td>

                                {{-- السيارة --}}
                                <td>
                                    <div class="fw-bold text-dark text-truncate" style="font-size:13px;max-width:180px;" title="{{ $displayCarName }}">
                                        {{ $displayCarName }}
                                    </div>
                                    @if($b->car?->year)
                                        <div class="d-flex align-items-center gap-1 mt-0.5">
                                            <span class="badge bg-light text-muted border px-1.5 py-0" style="font-size:10px;font-weight:600;">
                                                موديل {{ $b->car->year }}
                                            </span>
                                        </div>
                                    @endif
                                </td>

                                {{-- التفاصيل المالية --}}
                                <td>
                                    @php
                                        $fin = $b->getFinanceDetails();
                                    @endphp
                                    @if($bType === 'finance')
                                        <div style="line-height:1.35;white-space:nowrap;">
                                            <div>
                                                <span class="fw-bold" style="color:#4338CA;font-size:13px;">{{ number_format($fin['monthly_installment']) }}</span>
                                                <span class="text-muted" style="font-size:10px;">ر.س/ش</span>
                                            </div>
                                            <div class="d-flex align-items-center gap-1 my-0.5">
                                                <span class="badge px-1 py-0 rounded-1" style="background:#ECFDF5;color:#047857;border:1px solid #A7F3D0;font-size:9.5px;font-weight:700;">
                                                    %{{ number_format($fin['annual_rate'], 1) }}
                                                </span>
                                                <span class="text-muted text-truncate" style="font-size:10px;max-width:95px;" title="{{ $fin['bank_name'] }}">({{ $fin['bank_name'] }})</span>
                                            </div>
                                            @if(($fin['last_payment'] ?? 0) > 0)
                                                <div class="text-muted" style="font-size:10px;">
                                                    <span>{{ __('الدفعة الأخيرة:') }}</span>
                                                    <span class="fw-bold" style="color:#4338CA;">{{ number_format($fin['last_payment']) }}</span>
                                                    <span>ر.س</span>
                                                </div>
                                            @endif
                                            <div class="text-muted" style="font-size:10px;">
                                                <span>{{ __('الإجمالي:') }}</span>
                                                <span class="fw-semibold text-dark">{{ number_format($fin['total_financed']) }}</span>
                                                <span>ر.س</span>
                                            </div>
                                        </div>
                                    @else
                                        <div style="line-height:1.35;white-space:nowrap;">
                                            <div>
                                                <span class="fw-bold text-success" style="font-size:13px;">{{ number_format($fin['cash_price']) }}</span>
                                                <span class="text-muted" style="font-size:10px;">ر.س</span>
                                            </div>
                                            <div class="my-0.5">
                                                <span class="badge px-1.5 py-0 rounded-1" style="background:#F0FDF4;color:#16A34A;border:1px solid #BBF7D0;font-size:10px;font-weight:600;">
                                                    {{ __('شراء نقدي') }}
                                                </span>
                                            </div>
                                            @if($fin['down_payment'] > 0)
                                                <div class="text-muted" style="font-size:10px;">
                                                    <span>{{ __('الدفعة:') }}</span>
                                                    <span class="fw-semibold text-dark">{{ number_format($fin['down_payment']) }}</span>
                                                    <span>ر.س</span>
                                                </div>
                                            @endif
                                        </div>
                                    @endif
                                </td>

                                {{-- المسؤول --}}
                                <td>
                                    <form action="{{ route('crm.bookings.assign', $b) }}" method="POST" class="m-0">
                                        @csrf @method('PATCH')
                                        <div class="d-inline-flex align-items-center gap-1.5 bg-light rounded-pill px-2 py-1 border"
                                            style="border-color:#E2E8F0!important;transition:all 0.2s;"
                                            onmouseover="this.style.borderColor='var(--crm-red)'"
                                            onmouseout="this.style.borderColor='#E2E8F0'">
                                            @if($b->employee)
                                                <div class="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0 fw-bold"
                                                    style="width:22px;height:22px;font-size:10px;background:#D97706;">
                                                    {{ mb_substr($b->employee->name, 0, 1) }}
                                                </div>
                                            @else
                                                <div class="rounded-circle d-flex align-items-center justify-content-center bg-white text-muted flex-shrink-0 border"
                                                    style="width:22px;height:22px;font-size:10px;">
                                                    <i class="bi bi-person"></i>
                                                </div>
                                            @endif
                                            <select @disabled(!auth()->user()->hasRole('admin')) name="employee_id"
                                                class="form-select form-select-sm border-0 shadow-none bg-transparent fw-bold p-0 ps-1 text-truncate"
                                                style="font-size:11px;color:var(--crm-text);max-width:90px;cursor:pointer;background-image:none;outline:none;"
                                                onchange="this.form.submit()">
                                                <option value="">{{ __('غير معين') }}</option>
                                                @foreach($employees as $emp)
                                                    <option value="{{ $emp->id }}" {{ $b->assigned_to == $emp->id ? 'selected' : '' }}>{{ $emp->name }}</option>
                                                @endforeach
                                            </select>
                                            <i class="bi bi-chevron-down text-muted" style="font-size:9px;pointer-events:none;"></i>
                                        </div>
                                    </form>
                                </td>

                                {{-- تاريخ ونشاط الطلب --}}
                                <td style="white-space:nowrap;">
                                    @php
                                        $act = $b->getLastActivity();
                                    @endphp
                                    <div class="fw-semibold text-dark" style="font-size:12px;">
                                        {{ $b->created_at->format('d/m/Y') }}
                                        <small class="text-muted fw-normal" style="font-size:10px;">{{ $b->created_at->format('h:i A') }}</small>
                                    </div>
                                    <div class="mt-1 d-flex align-items-center gap-1" title="{{ $act['action'] }}{{ $act['by'] ? ' (بواسطة ' . $act['by'] . ')' : '' }}">
                                        <span class="badge bg-light text-secondary border px-1.5 py-0.5 d-inline-flex align-items-center gap-1" style="font-size:10px;font-weight:600;">
                                            <i class="bi bi-clock-history text-primary" style="font-size:9px;"></i>
                                            <span>{{ $act['time_ago'] }}</span>
                                        </span>
                                        @if($act['action'])
                                            <span class="text-muted text-truncate" style="font-size:10px;max-width:125px;" title="{{ $act['note'] ?: $act['action'] }}">
                                                {{ $act['action'] }}
                                            </span>
                                        @endif
                                    </div>
                                </td>

                                {{-- الحالة --}}
                                <td style="white-space:nowrap;">
                                    <form action="{{ route('crm.bookings.status', $b) }}" method="POST" class="m-0">
                                        @csrf @method('PATCH')
                                        @php
                                            $dotClass = match ($b->status) {
                                                'new', 'pending' => 'planned',
                                                'in_progress' => 'waiting',
                                                'sold', 'done' => 'done',
                                                'rejected' => 'late',
                                                default => 'confirmed',
                                            };
                                        @endphp
                                        <select name="status"
                                            class="form-select form-select-sm border-0 shadow-none status-dot {{ $dotClass }}"
                                            style="font-size:11px;font-weight:700;padding:4px 8px;min-width:96px;display:inline-block;border-radius:20px;"
                                            onchange="this.form.submit()">
                                            @foreach($statuses as $key => $s)
                                                <option value="{{ $key }}" {{ $b->status === $key ? 'selected' : '' }}>
                                                    {{ $s['label'] }}</option>
                                            @endforeach
                                        </select>
                                    </form>
                                </td>

                                {{-- إجراءات --}}
                                <td class="text-center" style="white-space:nowrap;">
                                    <div class="d-inline-flex gap-1 align-items-center justify-content-center">
                                        <a href="{{ route('crm.bookings.show', $b) }}" class="action-btn"
                                            title="{{ __('عرض كامل التفاصيل') }}">
                                            <i class="bi bi-eye text-primary" style="font-size:14px;"></i>
                                        </a>
                                        <a href="https://wa.me/{{ $b->client_phone }}" target="_blank"
                                            class="action-btn wa" title="{{ __('مراسلة واتساب') }}">
                                            <i class="bi bi-whatsapp" style="font-size:14px;color:#25D366;"></i>
                                        </a>
                                        @can('manage-bookings')
                                            <form action="{{ route('crm.bookings.destroy', $b) }}" method="POST" class="m-0"
                                                onsubmit="return confirm('{{ __('هل تريد حذف هذا الطلب؟') }}')">
                                                @csrf @method('DELETE')
                                                <button type="submit" class="action-btn del"
                                                    title="{{ __('حذف') }}">
                                                    <i class="bi bi-trash" style="font-size:14px;color:var(--crm-red);"></i>
                                                </button>
                                            </form>
                                        @endcan
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="9" class="text-center text-muted py-5">
                                    <i class="bi bi-inbox fs-1 d-block mb-2 opacity-25"></i>
                                    {{ __('لا توجد طلبات حالياً') }}
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            {{-- Mobile Cards (visible on mobile only) --}}
            <div class="d-md-none p-3">
                @forelse($bookings as $b)
                    @php
                        $bTypeM = $b->booking_type;
                        if (empty($bTypeM)) {
                            if (str_contains($b->notes ?? '', 'تمويل') || ($b->monthly_installment > 0 && $b->duration_years > 0)) {
                                $bTypeM = 'finance';
                            } else {
                                $bTypeM = 'purchase';
                            }
                        }
                        $dotClassM = match ($b->status) {
                            'new', 'pending' => 'planned',
                            'in_progress' => 'waiting',
                            'sold', 'done' => 'done',
                            'rejected' => 'late',
                            default => 'confirmed',
                        };
                    @endphp
                    <div class="mb-3 p-3 rounded-3" style="border:1px solid var(--crm-border);background:#fff;">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <div class="d-flex align-items-center gap-2">
                                    <a href="{{ route('crm.bookings.show', $b) }}" class="fw-bold text-decoration-none"
                                        style="color:var(--crm-red);font-size:14px;">#{{ $b->id }}</a>
                                    @if($bTypeM === 'finance')
                                        <span class="badge px-2 py-1 rounded-pill" style="background:#EEF2FF;color:#4338CA;border:1px solid #C7D2FE;font-size:11px;">
                                            <i class="bi bi-wallet2"></i> {{ __('تمويل') }}
                                        </span>
                                    @elseif($bTypeM === 'purchase')
                                        <span class="badge px-2 py-1 rounded-pill" style="background:#ECFDF5;color:#047857;border:1px solid #A7F3D0;font-size:11px;">
                                            <i class="bi bi-cash-stack"></i> {{ __('كاش') }}
                                        </span>
                                    @elseif($bTypeM === 'test_drive')
                                        <span class="badge px-2 py-1 rounded-pill" style="background:#FFFBEB;color:#B45309;border:1px solid #FDE68A;font-size:11px;">
                                            <i class="bi bi-speedometer2"></i> {{ __('تجربة قيادة') }}
                                        </span>
                                    @else
                                        <span class="badge px-2 py-1 rounded-pill" style="background:#F1F5F9;color:#475569;border:1px solid #CBD5E1;font-size:11px;">
                                            <i class="bi bi-chat-left-text"></i> {{ __('استفسار') }}
                                        </span>
                                    @endif
                                </div>
                                <div class="fw-bold mt-1" style="font-size:14px;color:var(--crm-text);">{{ $b->client_name }}</div>
                                <div style="font-size:12px;color:var(--crm-text-muted);" dir="ltr">{{ $b->client_phone }}</div>
                            </div>
                            <form action="{{ route('crm.bookings.status', $b) }}" method="POST">
                                @csrf @method('PATCH')
                                <select name="status"
                                    class="form-select form-select-sm border-0 shadow-none status-dot {{ $dotClassM }}"
                                    style="font-size:11px;font-weight:700;padding:3px 8px;width:auto;"
                                    onchange="this.form.submit()">
                                    @foreach($statuses as $key => $s)
                                        <option value="{{ $key }}" {{ $b->status === $key ? 'selected' : '' }}>{{ $s['label'] }}
                                        </option>
                                    @endforeach
                                </select>
                            </form>
                        </div>
                        <div class="d-flex align-items-center justify-content-between"
                            style="font-size:12px;color:var(--crm-text-muted);border-top:1px solid var(--crm-border);padding-top:10px;margin-top:8px;">
                            @php
                                $brandNameM = trim($b->car?->brand?->name ?? '');
                                $carNameM = trim($b->car?->name ?? '');
                                if ($brandNameM && str_starts_with($carNameM, $brandNameM)) {
                                    $displayCarNameM = $carNameM;
                                } elseif ($brandNameM && $carNameM) {
                                    $displayCarNameM = $brandNameM . ' ' . $carNameM;
                                } else {
                                    $displayCarNameM = $carNameM ?: ($b->car_name ?: '—');
                                }
                                $finM = $b->getFinanceDetails();
                            @endphp
                            <div>
                                <i class="bi bi-car-front me-1 text-secondary"></i>
                                <span class="fw-semibold text-dark">{{ $displayCarNameM }}</span>
                            </div>
                            <div>
                                @if($bTypeM === 'finance')
                                    <span class="fw-bold" style="color:#4338CA;">{{ number_format($finM['monthly_installment']) }} <small>{!! __('ر.س/ش') !!}</small></span>
                                    @if(($finM['last_payment'] ?? 0) > 0)
                                        <div class="text-muted" style="font-size:10px;">
                                            <span>{{ __('دفعة أخيرة:') }}</span>
                                            <span class="fw-bold" style="color:#4338CA;">{{ number_format($finM['last_payment']) }}</span>
                                            <span>ر.س</span>
                                        </div>
                                    @endif
                                @else
                                    <span class="fw-bold text-success">{{ number_format($finM['cash_price']) }} <small>{!! __('ر.س') !!}</small></span>
                                @endif
                            </div>
                            <div>
                                <form action="{{ route('crm.bookings.assign', $b) }}" method="POST" class="m-0 d-inline-block">
                                    @csrf @method('PATCH')
                                    <div class="d-flex align-items-center gap-1 bg-light rounded-pill px-2 py-1 border"
                                        style="width: fit-content;">
                                        @if($b->employee)
                                            <span
                                                class="rounded-circle d-inline-flex align-items-center justify-content-center text-white flex-shrink-0"
                                                style="width:20px;height:20px;font-size:9px;font-weight:bold;background:#dcbb73;">{{ strtoupper(substr($b->employee->name, 0, 1)) }}</span>
                                        @else
                                            <i class="bi bi-person-circle text-muted"></i>
                                        @endif
                                        <select name="employee_id"
                                            class="form-select form-select-sm border-0 shadow-none bg-transparent p-0 fw-bold"
                                            style="font-size:11px;color:var(--crm-text);width:auto;display:inline-block;background-image:none;"
                                            onchange="this.form.submit()">
                                            <option value="">{{ __('غير معين') }}</option>
                                            @foreach($employees as $emp)
                                                <option value="{{ $emp->id }}" {{ $b->assigned_to == $emp->id ? 'selected' : '' }}>
                                                    {{ $emp->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style="font-size:11px;color:var(--crm-text-muted);">
                            <span><i class="bi bi-calendar3 me-1"></i> {{ $b->created_at->format('d/m/Y') }}</span>
                            <span><i class="bi bi-clock-history me-1"></i> {{ $b->updated_at->diffForHumans() }}</span>
                        </div>
                        <div class="d-flex gap-2 mt-2">
                            <a href="{{ route('crm.bookings.show', $b) }}"
                                class="btn btn-sm btn-light rounded-2 flex-fill text-center" style="font-size:12px;">
                                <i class="bi bi-eye"></i> {{ __('عرض') }}
                            </a>
                            <a href="https://wa.me/{{ $b->client_phone }}" target="_blank"
                                class="btn btn-sm btn-light rounded-2 flex-fill text-center"
                                style="font-size:12px;color:#25D366;">
                                <i class="bi bi-whatsapp"></i> {{ __('واتساب') }}
                            </a>
                            @can('manage-bookings')
                                <form action="{{ route('crm.bookings.destroy', $b) }}" method="POST"
                                    onsubmit="return confirm('{{ __('هل تريد حذف هذا الطلب؟') }}')">
                                    @csrf @method('DELETE')
                                    <button class="btn btn-sm btn-light rounded-2" style="color:var(--crm-red);font-size:12px;"><i
                                            class="bi bi-trash"></i></button>
                                </form>
                            @endcan
                        </div>
                    </div>
                @empty
                    <div class="text-center text-muted py-5">
                        <i class="bi bi-inbox fs-1 d-block mb-2 opacity-25"></i>
                        {{ __('لا توجد طلبات حالياً') }}
                    </div>
                @endforelse
            </div>

            @if($bookings->hasPages())
                <div class="card-footer bg-white border-0 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2" style="border-top:1px solid var(--crm-border)!important;">
                    <div style="font-size:12px;color:var(--crm-text-muted);">
                        {{ __('عرض') }} <strong>{{ $bookings->firstItem() ?? 0 }}</strong> - <strong>{{ $bookings->lastItem() ?? 0 }}</strong> {{ __('من أصل') }} <strong>{{ $bookings->total() }}</strong> {{ __('طلب') }}
                    </div>
                    <div>
                        {{ $bookings->links('pagination::bootstrap-5') }}
                    </div>
                </div>
            @endif
        </div>

        {{-- Floating Action Button --}}
        @can('manage-bookings')
            <button
                class="btn btn-crm-primary position-fixed shadow-lg d-flex align-items-center justify-content-center hover-lift"
                style="bottom: 30px; left: 30px; width: 60px; height: 60px; border-radius: 50%; z-index: 1050; border: none; background: #dcbb73;"
                data-bs-toggle="modal" data-bs-target="#createBookingModal" title="{{ __('إضافة طلب جديد') }}">
                <i class="bi bi-plus" style="font-size: 2rem; color: #fff;"></i>
            </button>
        @endcan

        {{-- Create Booking Modal --}}
        <div class="modal fade" id="createBookingModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg" style="border-radius: 20px; background: #FAF9F6;">
                    <div class="modal-header border-0 pb-0 px-4 pt-4">
                        <h5 class="modal-title fw-bold" style="color: var(--crm-text);">{{ __('إضافة عميل / طلب جديد') }}</h5>
                        <button type="button" class="btn-close {{ app()->getLocale() == 'ar' ? 'ms-0 me-auto' : '' }}"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form action="{{ route('crm.bookings.store') }}" method="POST">
                        @csrf
                        <div class="modal-body px-4 py-4">
                            {{-- Customer Info Section --}}
                            <div class="row g-3 mb-4">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold text-muted small">{{ __('اسم العميل') }} <span
                                            class="text-danger">*</span></label>
                                    <input type="text" name="client_name"
                                        class="form-control form-control-lg bg-white border-0 shadow-sm"
                                        style="border-radius: 12px; font-size: 14px;" required
                                        placeholder="{{ __('اسم العميل') }}">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold text-muted small">{{ __('رقم الهاتف') }} <span
                                            class="text-danger">*</span></label>
                                    <div class="input-group input-group-lg bg-white border-0 shadow-sm"
                                        style="border-radius: 12px; overflow: hidden;">
                                        <span class="input-group-text bg-white border-0 text-muted" dir="ltr"
                                            style="font-size: 14px;">+966 🇸🇦</span>
                                        <input type="text" name="client_phone" class="form-control border-0"
                                            style="font-size: 14px;" required placeholder="5X XXX XXXX" dir="ltr">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold text-muted small">{{ __('البريد الإلكتروني') }}</label>
                                    <input type="email" name="client_email"
                                        class="form-control form-control-lg bg-white border-0 shadow-sm"
                                        style="border-radius: 12px; font-size: 14px;"
                                        placeholder="{{ __('البريد الإلكتروني (اختياري)') }}">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold text-muted small">{{ __('نوع الطلب') }}</label>
                                    <select name="booking_type" class="form-select form-select-lg bg-white border-0 shadow-sm"
                                        style="border-radius: 12px; font-size: 14px;">
                                        <option value="finance">{{ __('طلب تمويل') }}</option>
                                        <option value="purchase">{{ __('شراء كاش') }}</option>
                                        <option value="test_drive">{{ __('تجربة قيادة') }}</option>
                                        <option value="inquiry">{{ __('استفسار') }}</option>
                                    </select>
                                </div>
                            </div>

                            {{-- Car Info Section --}}
                            <div class="p-4 mb-4" style="background: #F4EFF0; border-radius: 16px;">
                                <h6 class="fw-bold mb-3" style="color: var(--crm-text);">{{ __('تفاصيل السيارة') }}</h6>
                                <div class="row g-3">
                                    <div class="col-md-12">
                                        <label
                                            class="form-label fw-bold text-muted small">{{ __('السيارة المطلوبة') }}</label>
                                        <select name="car_id" class="form-select form-select-lg bg-white border-0 shadow-sm"
                                            style="border-radius: 12px; font-size: 14px;" id="bookingCarSelect">
                                            <option value="">{{ __('اختر سيارة (أو اتركها فارغة)') }}</option>
                                            @foreach($cars as $car)
                                                <option value="{{ $car->id }}" data-price="{{ $car->cash_price }}"
                                                    data-installment="{{ $car->min_installment }}">{{ $car->brand->name ?? '' }}
                                                    {{ $car->name }} ({{ $car->year }})</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label
                                            class="form-label fw-bold text-muted small">{{ __('سعر السيارة الإجمالي') }}</label>
                                        <div class="input-group input-group-lg bg-white border-0 shadow-sm"
                                            style="border-radius: 12px; overflow: hidden;">
                                            <input type="number" name="total_price" class="form-control border-0"
                                                style="font-size: 14px;">
                                            <span class="input-group-text bg-white border-0 text-muted"
                                                style="font-size: 14px;">ر.س</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label
                                            class="form-label fw-bold text-muted small">{{ __('الدفعة الأولى (إن وجدت)') }}</label>
                                        <div class="input-group input-group-lg bg-white border-0 shadow-sm"
                                            style="border-radius: 12px; overflow: hidden;">
                                            <input type="number" name="down_payment" class="form-control border-0"
                                                style="font-size: 14px;">
                                            <span class="input-group-text bg-white border-0 text-muted"
                                                style="font-size: 14px;">ر.س</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label
                                            class="form-label fw-bold text-muted small">{{ __('الدفعة الأخيرة (المؤجلة)') }}</label>
                                        <div class="input-group input-group-lg bg-white border-0 shadow-sm"
                                            style="border-radius: 12px; overflow: hidden;">
                                            <input type="number" name="last_payment" id="bookingLastPayment" class="form-control border-0"
                                                style="font-size: 14px;">
                                            <span class="input-group-text bg-white border-0 text-muted"
                                                style="font-size: 14px;">ر.س</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="d-flex justify-content-between align-items-center mb-1">
                                            <label class="form-label fw-bold text-muted small mb-0">{{ __('نسبة الفائدة %') }}</label>
                                            <span class="badge bg-white text-primary border" style="font-size:10px;">
                                                <i class="bi bi-bank me-1"></i>{{ $defaultBank?->name ?? 'البنك الافتراضي' }}
                                            </span>
                                        </div>
                                        <div class="input-group input-group-lg bg-white border-0 shadow-sm"
                                            style="border-radius: 12px; overflow: hidden;">
                                            <input type="number" step="0.01" min="0" max="100" name="interest_rate" id="bookingInterestRate" class="form-control border-0"
                                                style="font-size: 14px;" value="{{ $defaultBank?->annual_rate ?? 3.5 }}">
                                            <span class="input-group-text bg-white border-0 text-muted"
                                                style="font-size: 14px;">%</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label
                                            class="form-label fw-bold text-muted small">{{ __('القسط الشهري المتوقع') }}</label>
                                        <div class="input-group input-group-lg bg-white border-0 shadow-sm"
                                            style="border-radius: 12px; overflow: hidden;">
                                            <input type="number" name="monthly_installment" id="bookingInstallment" class="form-control border-0"
                                                style="font-size: 14px;">
                                            <span class="input-group-text bg-white border-0 text-muted"
                                                style="font-size: 14px;">ر.س</span>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label
                                            class="form-label fw-bold text-muted small">{{ __('مدة التمويل (سنوات)') }}</label>
                                        <input type="number" name="duration_years" id="bookingDurationYears"
                                            class="form-control form-control-lg bg-white border-0 shadow-sm"
                                            style="border-radius: 12px; font-size: 14px;" value="5" min="1" max="10">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-2">
                                <label class="form-label fw-bold text-muted small">{{ __('ملاحظات إضافية') }}</label>
                                <textarea name="notes" class="form-control bg-white border-0 shadow-sm" rows="2"
                                    style="border-radius: 12px; font-size: 14px;"
                                    placeholder="{{ __('إضافة ملاحظة...') }}"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer border-0 px-4 pb-4 pt-0 gap-2 flex-nowrap">
                            @can('manage-bookings')
                                <button type="submit" class="btn flex-fill fw-bold py-3 text-white"
                                    style="background: #dcbb73; border-radius: 12px;">{{ __('حفظ بيانات العميل') }}</button>
                            @endcan
                            <button type="button" class="btn btn-outline-secondary flex-fill fw-bold py-3"
                                data-bs-dismiss="modal"
                                style="border-radius: 12px; background: white;">{{ __('إلغاء') }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        {{-- Import Bookings Modal --}}
        @can('manage-bookings')
        <div class="modal fade" id="importBookingsModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg" style="border-radius: 20px;">
                    <div class="modal-header border-0 pb-0 px-4 pt-4">
                        <h5 class="modal-title fw-bold" style="color: var(--crm-text);">
                            <i class="bi bi-file-earmark-excel text-success me-2"></i>{{ __('استيراد الطلبات من ملف إكسيل') }}
                        </h5>
                        <button type="button" class="btn-close {{ app()->getLocale() == 'ar' ? 'ms-0 me-auto' : '' }}"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form action="{{ route('crm.bookings.import') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="modal-body px-4 py-3">
                            <p class="text-muted small mb-3">
                                {{ __('يمكنك استيراد الطلبات مباشرة من ملف إكسيل بصيغة XLSX أو CSV. سيتم احتساب الأقساط والفوائد بناءً على إعدادات الحاسبة الافتراضية.') }}
                            </p>

                            <div class="mb-3 p-3 rounded-3" style="background:#F0FDF4;border:1px solid #BBF7D0;">
                                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <span style="font-size:12px;font-weight:700;color:#166534;">
                                        <i class="bi bi-download me-1"></i> {{ __('نموذج إكسيل جاهز للتعبئة') }}
                                    </span>
                                    <a href="{{ route('crm.bookings.sample-excel') }}" class="btn btn-sm btn-success rounded-pill px-3 fw-bold" style="font-size:11px;">
                                        {{ __('تحميل النموذج') }}
                                    </a>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted">{{ __('اختر ملف الإكسيل (XLSX, XLS, CSV)') }} <span class="text-danger">*</span></label>
                                <input type="file" name="file" class="form-control" accept=".xlsx,.xls,.csv" required style="border-radius: 10px; font-size: 13px;">
                                <small class="text-muted d-block mt-1" style="font-size:11px;">
                                    {{ __('الأعمدة المدعومة: اسم العميل، رقم الجوال، البريد، المدينة، نوع الطلب، السيارة، السعر، الدفعة، مدة التمويل، الملاحظات.') }}
                                </small>
                            </div>
                        </div>
                        <div class="modal-footer border-0 px-4 pb-4 pt-0 gap-2 flex-nowrap">
                            <button type="submit" class="btn flex-fill fw-bold py-2 text-white"
                                style="background: var(--crm-primary); border-radius: 10px;">
                                <i class="bi bi-upload me-1"></i> {{ __('بدء الاستيراد الآن') }}
                            </button>
                            <button type="button" class="btn btn-outline-secondary flex-fill fw-bold py-2"
                                data-bs-dismiss="modal" style="border-radius: 10px;">
                                {{ __('إلغاء') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        @endcan

    </div>

    <style>
        .hover-lift {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hover-lift:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 1rem 3rem rgba(227, 6, 19, 0.4) !important;
        }

        .modal-backdrop.show {
            opacity: 0.6;
            backdrop-filter: blur(4px);
        }

        .page-item.active .page-link {
            background-color: var(--crm-gold, #c59b27) !important;
            border-color: var(--crm-gold, #c59b27) !important;
            color: #fff !important;
        }
        .page-link {
            color: var(--crm-text, #0f172a);
        }
    </style>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const carSelect = document.getElementById('bookingCarSelect');
            const priceInput = document.querySelector('input[name="total_price"]');
            const downPaymentInput = document.querySelector('input[name="down_payment"]');
            const installmentInput = document.getElementById('bookingInstallment');
            const durationInput = document.getElementById('bookingDurationYears');
            const interestRateInput = document.getElementById('bookingInterestRate');
            const bookingTypeSelect = document.querySelector('select[name="booking_type"]');

            const lastPaymentInput = document.getElementById('bookingLastPayment') || document.querySelector('input[name="last_payment"]');

            function calculateInstallment() {
                if (!priceInput || !installmentInput) return;
                const price = parseFloat(priceInput.value) || 0;
                const down = parseFloat(downPaymentInput ? downPaymentInput.value : 0) || 0;
                const last = parseFloat(lastPaymentInput ? lastPaymentInput.value : 0) || 0;
                const duration = parseInt(durationInput ? durationInput.value : 5) || 5;
                const rate = parseFloat(interestRateInput ? interestRateInput.value : 3.5) || 3.5;
                const principal = Math.max(0, price - down);
                const totalMonths = duration * 12;

                if (principal > 0 && totalMonths > 0) {
                    const durationYears = totalMonths / 12;
                    const totalInterest = principal * (rate / 100) * durationYears;
                    const repayable = Math.max(0, (principal + totalInterest) - last);
                    const monthly = Math.round(repayable / totalMonths);
                    installmentInput.value = monthly;
                } else if (principal === 0) {
                    installmentInput.value = 0;
                }
            }

            if (carSelect) {
                carSelect.addEventListener('change', function () {
                    const selectedOption = this.options[this.selectedIndex];
                    if (selectedOption.value) {
                        const price = selectedOption.getAttribute('data-price');
                        if (priceInput) priceInput.value = price || '';
                        calculateInstallment();
                    } else {
                        if (priceInput) priceInput.value = '';
                        if (installmentInput) installmentInput.value = '';
                    }
                });
            }

            if (priceInput) priceInput.addEventListener('input', calculateInstallment);
            if (downPaymentInput) downPaymentInput.addEventListener('input', calculateInstallment);
            if (durationInput) durationInput.addEventListener('input', calculateInstallment);
            if (interestRateInput) interestRateInput.addEventListener('input', calculateInstallment);
            if (lastPaymentInput) lastPaymentInput.addEventListener('input', calculateInstallment);
        });
    </script>
@endsection