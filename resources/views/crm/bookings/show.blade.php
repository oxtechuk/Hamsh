@extends('partials.Layouts.crm-master')
@section('title', __('تفاصيل الطلب') . ' #' . $booking->id . ' | hamsh ')

@section('content')
    <div class="container-fluid" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">

        {{-- Breadcrumb --}}
        <nav class="crm-breadcrumb">
            <a href="{{ route('crm.dashboard') }}">{{ __('الرئيسية') }}</a>
            <span class="sep">›</span>
            <a href="{{ route('crm.bookings.index') }}">{{ __('الطلبات') }}</a>
            <span class="sep">›</span>
            <span class="current">{{ __('تفاصيل الطلب') }} #{{ $booking->id }}</span>
        </nav>

        {{-- Header --}}
        <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <h5 class="fw-bold mb-0">{{ __('تفاصيل الطلب') }} <span style="color:var(--crm-red);">#{{ $booking->id }}</span>
            </h5>
            <div class="d-flex gap-2 flex-wrap">
                @can('manage-bookings')
                    <button type="button" class="btn-crm-primary d-flex align-items-center gap-1" data-bs-toggle="modal" data-bs-target="#editBookingModal">
                        <i class="bi bi-pencil-square"></i>
                        <span>{{ __('تعديل تفاصيل الطلب') }}</span>
                    </button>
                @endcan
                <a href="{{ route('crm.bookings.index') }}" class="btn-crm-light">
                    <i class="bi bi-arrow-right"></i>
                    <span class="d-none d-md-inline">{{ __('العودة للطلبات') }}</span>
                </a>
                <button onclick="window.print()" class="btn-crm-light">
                    <i class="bi bi-printer"></i>
                    <span class="d-none d-md-inline">{{ __('طباعة تفاصيل الطلب') }}</span>
                </button>
            </div>
        </div>


        {{-- Row 1: تفاصيل الطلب + تفاصيل الدفع --}}
        <div class="row g-3 mb-3">

            {{-- تفاصيل الطلب --}}
            <div class="col-12 col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100" style="border:1px solid var(--crm-border)!important;">
                    <div class="card-header bg-white border-0 px-4 pt-4 pb-3"
                        style="border-bottom:1px solid var(--crm-border)!important;">
                        <h6 class="fw-bold mb-0">{{ __('تفاصيل الطلب') }}</h6>
                    </div>
                    <div class="card-body px-4 py-3">
                        @php
                            $orderRows = [
                                __('رقم العميل') => '#' . ($booking->lead_id ?? $booking->id),
                                __('رقم الطلب') => '#' . $booking->id,
                                __('اسم العميل') => $booking->client_name,
                                __('جوال العميل') => $booking->client_phone,
                                __('البريد الإلكتروني') => $booking->client_email ?: '—',
                                __('المدينة') => $booking->city ?: '—',
                                __('تاريخ الطلب') => $booking->created_at->format('d/m/Y • H:i') . ($booking->created_at->format('A') == 'AM' ? ' ص' : ' م'),
                                __('نوع الطلب') => $booking->booking_type ? (\App\Models\Booking::BOOKING_TYPES_LABELS[$booking->booking_type] ?? $booking->booking_type) : '—',
                                __('الموقع الجغرافي') => $booking->location ?: '—',
                            ];
                        @endphp
                        @foreach($orderRows as $label => $value)
                            <div class="d-flex justify-content-between py-2" style="border-bottom:1px solid var(--crm-border);">
                                <span style="font-size:13px;color:var(--crm-text-muted);">{{ $label }}</span>
                                <span style="font-size:13px;font-weight:700;color:var(--crm-text);"
                                    dir="{{ in_array($label, [__('جوال العميل'), __('البريد الإلكتروني')]) ? 'ltr' : 'inherit' }}">{{ $value }}</span>
                            </div>
                        @endforeach
                        <div class="d-flex justify-content-between py-2 align-items-center">
                            <span style="font-size:13px;color:var(--crm-text-muted);">{{ __('حالة الطلب') }}</span>
                            @php
                                $dotClass = match ($booking->status) {
                                    'new', 'pending' => 'planned',
                                    'in_progress' => 'waiting',
                                    'sold', 'done' => 'done',
                                    'rejected' => 'late',
                                    default => 'confirmed',
                                };
                            @endphp
                            <span class="status-dot {{ $dotClass }}">{{ $booking->status_label }}</span>
                        </div>

                        {{-- الملاحظات --}}
                        @if($booking->notes)
                            <div class="mt-3 p-3 rounded-3" style="background:#FFFBEB;border:1px solid #FDE68A;">
                                <label style="font-size:12px;font-weight:700;color:#92400E;margin-bottom:4px;display:block;">{{ __('ملاحظات وتفاصيل التمويل / الطلب') }}</label>
                                <p class="mb-0" style="font-size:13px;font-weight:600;color:#78350F;white-space:pre-line;">{{ $booking->notes }}</p>
                            </div>
                        @endif

                        {{-- تعيين مسؤول المبيعات --}}
                        <div class="mt-3 p-3 rounded-3" style="background:#F8F9FC;border:1px solid var(--crm-border);">
                            <label
                                style="font-size:12px;font-weight:700;margin-bottom:8px;display:block;">{{ __('مسؤول المبيعات') }}</label>
                            <form action="{{ route('crm.bookings.assign', $booking) }}" method="POST"
                                class="d-flex align-items-center gap-2 w-100">
                                @csrf @method('PATCH')
                                <select name="employee_id" class="form-select form-select-sm border-0 shadow-none"
                                    style="background:#fff;border-radius:8px;font-size:13px;font-weight:700;">
                                    <option value="">{{ __('غير معين') }}</option>
                                    @foreach($employees as $emp)
                                        <option value="{{ $emp->id }}" {{ $booking->assigned_to == $emp->id ? 'selected' : '' }}>
                                            {{ $emp->name }}</option>
                                    @endforeach
                                </select>
                                <button type="submit" class="btn btn-sm fw-bold rounded-2 text-white flex-shrink-0"
                                    style="background:var(--crm-text);font-size:12px;white-space:nowrap;padding: 6px 12px;">
                                    {{ __('تحويل') }}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {{-- تفاصيل الدفع --}}
            <div class="col-12 col-md-6">
                <div class="card border-0 shadow-sm rounded-4 h-100" style="border:1px solid var(--crm-border)!important;">
                    <div class="card-header bg-white border-0 px-4 pt-4 pb-3"
                        style="border-bottom:1px solid var(--crm-border)!important;">
                        <h6 class="fw-bold mb-0">{{ __('تفاصيل الدفع') }}</h6>
                    </div>
                    <div class="card-body px-4 py-3">
                        @php
                            $commission = $booking->monthly_installment * 0.035;
                            $delivery = 125;
                            $total = $booking->monthly_installment + $commission + $delivery;
                        @endphp
                        <div class="d-flex justify-content-between py-2" style="border-bottom:1px solid var(--crm-border);">
                            <span style="font-size:13px;color:var(--crm-text-muted);">{{ __('إجمالي القسط') }}</span>
                            <span style="font-size:13px;font-weight:700;">{{ number_format($booking->monthly_installment) }}
                                {!! __('ريال') !!}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2" style="border-bottom:1px solid var(--crm-border);">
                            <span style="font-size:13px;color:var(--crm-text-muted);">{{ __('الدفعة الأولى') }}</span>
                            <span style="font-size:13px;font-weight:700;">{{ number_format($booking->down_payment) }}
                                {!! __('ريال') !!}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2" style="border-bottom:1px solid var(--crm-border);">
                            <span style="font-size:13px;color:var(--crm-text-muted);">{{ __('السعر الإجمالي') }}</span>
                            <span style="font-size:13px;font-weight:700;">{{ number_format($booking->total_price) }}
                                {!! __('ريال') !!}</span>
                        </div>
                        <div class="d-flex justify-content-between py-2" style="border-bottom:1px solid var(--crm-border);">
                            <span style="font-size:13px;color:var(--crm-text-muted);">{{ __('مدة التمويل') }}</span>
                            <span style="font-size:13px;font-weight:700;">{{ $booking->duration_years ?? 5 }} {{ __('سنوات') }}</span>
                        </div>
                        <div class="d-flex justify-content-between py-3">
                            <span style="font-size:14px;font-weight:800;color:var(--crm-text);">{{ __('الإجمالي') }}</span>
                            <span style="font-size:14px;font-weight:900;color:var(--crm-red);">{{ number_format($total) }}
                                {!! __('ريال') !!}</span>
                        </div>

                        {{-- حالة الطلب + تقرير --}}
                        <div class="mt-3 p-3 rounded-3" style="background:#F8F9FC;border:1px solid var(--crm-border);">
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <form action="{{ route('crm.bookings.status', $booking) }}" method="POST"
                                    class="d-flex align-items-center gap-2 w-100">
                                    @csrf @method('PATCH')
                                    <select name="status" class="form-select form-select-sm border-0 shadow-none"
                                        style="background:#fff;border-radius:8px;font-size:13px;font-weight:700;">
                                        @foreach($statuses as $key => $s)
                                            <option value="{{ $key }}" {{ $booking->status === $key ? 'selected' : '' }}>
                                                {{ $s['label'] }}</option>
                                        @endforeach
                                    </select>
                                    <button type="submit" class="btn btn-sm fw-bold rounded-2 text-white flex-shrink-0"
                                        style="background:var(--crm-red);font-size:12px;white-space:nowrap;">
                                        {{ __('تحديث الحالة') }}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- تفاصيل السيارة --}}
        @if($booking->car)
            <div class="card border-0 shadow-sm rounded-4 mb-3" style="border:1px solid var(--crm-border)!important;">
                <div class="card-header bg-white border-0 px-4 pt-4 pb-3"
                    style="border-bottom:1px solid var(--crm-border)!important;">
                    <h6 class="fw-bold mb-0">{{ __('تفاصيل السيارة') }}</h6>
                </div>
                <div class="card-body px-4 py-3">
                    <div class="row g-0">
                        <div class="col-6 col-md-3 py-2"
                            style="border-{{ app()->getLocale() == 'ar' ? 'left' : 'right' }}:1px solid var(--crm-border);">
                            <div style="font-size:12px;color:var(--crm-text-muted);margin-bottom:4px;">{{ __('كود السيارة') }}
                            </div>
                            <div style="font-size:13px;font-weight:700;">#{{ $booking->car->id }}</div>
                        </div>
                        <div class="col-6 col-md-3 py-2 px-3"
                            style="border-{{ app()->getLocale() == 'ar' ? 'left' : 'right' }}:1px solid var(--crm-border);">
                            <div style="font-size:12px;color:var(--crm-text-muted);margin-bottom:4px;">{{ __('نوع السيارة') }}
                            </div>
                            <div style="font-size:13px;font-weight:700;">{{ $booking->car->brand->name ?? '' }}
                                {{ $booking->car->name }}</div>
                        </div>
                        <div class="col-6 col-md-3 py-2 px-3"
                            style="border-{{ app()->getLocale() == 'ar' ? 'left' : 'right' }}:1px solid var(--crm-border);">
                            <div style="font-size:12px;color:var(--crm-text-muted);margin-bottom:4px;">{{ __('اللون المطلوب') }}
                            </div>
                            <div style="font-size:13px;font-weight:700;">{{ $booking->preferred_color ?: ($booking->car->color ?? '—') }}</div>
                        </div>
                        <div class="col-6 col-md-3 py-2 px-3">
                            <div style="font-size:12px;color:var(--crm-text-muted);margin-bottom:4px;">{{ __('سعر السيارة') }}
                            </div>
                            <div style="font-size:13px;font-weight:700;">{{ number_format($booking->car->cash_price) }}
                                {!! __('ريال') !!}</div>
                        </div>
                    </div>
                </div>
            </div>
        @endif

        {{-- المستندات والتصاريح --}}
        <div class="card border-0 shadow-sm rounded-4 mb-3" style="border:1px solid var(--crm-border)!important;">
            <div class="card-header bg-white border-0 px-4 pt-4 pb-3"
                style="border-bottom:1px solid var(--crm-border)!important;">
                <h6 class="fw-bold mb-0">{{ __('المستندات والتصاريح') }}</h6>
            </div>
            <div class="card-body p-4">
                {{-- نموذج رفع مستند --}}
                <form action="{{ route('crm.bookings.documents.store', $booking) }}" method="POST"
                    enctype="multipart/form-data" class="mb-4 p-3 rounded-3"
                    style="background:#F8F9FC;border:1px solid var(--crm-border);">
                    @csrf
                    <div class="row g-2 align-items-end">
                        <div class="col-md-5">
                            <label class="fw-bold mb-1" style="font-size:12px;">{{ __('اسم المستند (اختياري)') }}</label>
                            <input type="text" name="title" class="form-control form-control-sm"
                                placeholder="{{ __('مثال: الهوية الوطنية، تصريح المرور...') }}"
                                style="border-radius:8px;font-size:13px;padding:8px 12px;">
                        </div>
                        <div class="col-md-5">
                            <label class="fw-bold mb-1" style="font-size:12px;">{{ __('الملف') }}</label>
                            <input type="file" name="file" class="form-control form-control-sm" required
                                style="border-radius:8px;font-size:13px;padding:8px 12px;">
                        </div>
                        <div class="col-md-2">
                            @can('manage-bookings')
                                <button type="submit" class="btn-crm-primary w-100" style="padding:8px 16px;">
                                    <i class="bi bi-upload"></i> {{ __('رفع') }}
                                </button>
                            @endcan
                        </div>
                    </div>
                </form>

                {{-- قائمة المستندات --}}
                @if($booking->documents && $booking->documents->count() > 0)
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0"
                            style="border:1px solid var(--crm-border);border-radius:8px;overflow:hidden;">
                            <thead style="background:#F8F9FC;">
                                <tr>
                                    <th class="py-2 px-3 text-muted fw-bold"
                                        style="font-size:12px;border-bottom:1px solid var(--crm-border);">{{ __('المستند') }}
                                    </th>
                                    <th class="py-2 px-3 text-muted fw-bold"
                                        style="font-size:12px;border-bottom:1px solid var(--crm-border);">{{ __('بواسطة') }}
                                    </th>
                                    <th class="py-2 px-3 text-muted fw-bold"
                                        style="font-size:12px;border-bottom:1px solid var(--crm-border);">{{ __('التاريخ') }}
                                    </th>
                                    <th class="py-2 px-3 text-muted fw-bold text-end"
                                        style="font-size:12px;border-bottom:1px solid var(--crm-border);">{{ __('إجراء') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($booking->documents as $doc)
                                    <tr>
                                        <td class="px-3">
                                             <div class="d-flex align-items-center gap-2">
                                                <div
                                                    style="width:36px;height:36px;background:#F1F5F9;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#475467;">
                                                    @if(in_array(strtolower($doc->file_type), ['png', 'jpg', 'jpeg', 'gif']))
                                                        <i class="bi bi-file-image fs-5"></i>
                                                    @elseif(strtolower($doc->file_type) == 'pdf')
                                                        <i class="bi bi-file-pdf fs-5" style="color:var(--crm-red);"></i>
                                                    @else
                                                        <i class="bi bi-file-earmark fs-5"></i>
                                                    @endif
                                                </div>
                                                <div>
                                                    <div class="fw-bold" style="font-size:13px;color:var(--crm-text);">
                                                        {{ $doc->title }}</div>
                                                    <div style="font-size:11px;color:var(--crm-text-muted);">
                                                        .{{ strtoupper($doc->file_type) }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style="font-size:12px;color:var(--crm-text-muted);">
                                            {{ $doc->employee->name ?? __('النظام') }}</td>
                                        <td style="font-size:12px;color:var(--crm-text-muted);">
                                            {{ $doc->created_at->format('Y-m-d H:i') }}</td>
                                        <td class="text-end px-3">
                                            <div class="d-flex gap-1 justify-content-end">
                                                <a href="{{ asset('storage/' . $doc->file_path) }}" target="_blank"
                                                    class="btn btn-sm btn-light rounded-2 text-primary" title="{{ __('عرض') }}">
                                                    <i class="bi bi-eye"></i>
                                                </a>
                                                @can('manage-bookings')
                                                    <form action="{{ route('crm.bookings.documents.destroy', $doc) }}" method="POST"
                                                        onsubmit="return confirm('{{ __('هل تريد حذف هذا المستند؟') }}')">
                                                        @csrf @method('DELETE')
                                                        <button class="btn btn-sm btn-light rounded-2" style="color:var(--crm-red);"
                                                            title="{{ __('حذف') }}">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </form>
                                                @endcan
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @else
                    <div class="text-center py-4 opacity-50">
                        <i class="bi bi-folder-x fs-1 d-block mb-2"></i>
                        <p class="mb-0 small">{{ __('لا توجد مستندات مرفوعة بعد') }}</p>
                    </div>
                @endif
            </div>
        </div>

        {{-- سجل المتابعة --}}
        <div class="card border-0 shadow-sm rounded-4" style="border:1px solid var(--crm-border)!important;">
            <div class="card-header bg-white border-0 px-4 pt-4 pb-3"
                style="border-bottom:1px solid var(--crm-border)!important;">
                <h6 class="fw-bold mb-0">{{ __('سجل المتابعة') }}</h6>
            </div>
            <div class="card-body p-4">
                {{-- إضافة ملاحظة --}}
                @can('manage-bookings')
                    <form action="{{ route('crm.bookings.note', $booking) }}" method="POST" class="mb-4 p-3 rounded-3"
                        style="background:#F8F9FC;border:1px solid var(--crm-border);">
                        @csrf
                        <div class="d-flex gap-2 align-items-end">
                            <div class="flex-grow-1">
                                <label class="fw-bold mb-1" style="font-size:12px;">{{ __('إضافة تحديث جديد') }}</label>
                                <textarea name="note" rows="2" required placeholder="{{ __('اكتب ملاحظة...') }}"
                                    style="width:100%;border:1px solid var(--crm-border);border-radius:8px;padding:10px 14px;font-size:13px;font-family:'Cairo',sans-serif;outline:none;resize:none;"></textarea>
                            </div>
                            <div>
                                <select name="type"
                                    style="border:1px solid var(--crm-border);border-radius:8px;padding:9px 12px;font-size:13px;outline:none;font-family:'Cairo',sans-serif;margin-bottom:4px;display:block;">
                                    <option value="note">📌 {{ __('ملاحظة') }}</option>
                                    <option value="call">📞 {{ __('مكالمة') }}</option>
                                </select>
                                <button type="submit" class="btn-crm-primary w-100"
                                    style="padding:9px 16px;">{{ __('إضافة') }}</button>
                            </div>
                        </div>
                    </form>
                @endcan

                {{-- Timeline --}}
                <div
                    style="position:relative;padding-{{ app()->getLocale() == 'ar' ? 'right' : 'left' }}:20px;border-{{ app()->getLocale() == 'ar' ? 'right' : 'left' }}:2px solid var(--crm-border);">
                    @forelse($booking->notes_list as $note)
                        <div class="d-flex gap-3 mb-4 position-relative">
                            <div class="position-absolute"
                                style="{{ app()->getLocale() == 'ar' ? 'right' : 'left' }}:-9px;top:4px;width:16px;height:16px;border-radius:50%;background:#fff;border:2px solid {{ $note->type === 'call' ? '#12B76A' : ($note->type === 'status_change' ? '#2E90FA' : 'var(--crm-red)') }};">
                            </div>
                            <div class="flex-grow-1">
                                <div class="p-3 rounded-3 border"
                                    style="background:#fff;border-color:var(--crm-border)!important;">
                                    <p class="mb-2" style="font-size:13px;font-weight:600;color:var(--crm-text);">
                                        {{ $note->note }}</p>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="badge bg-light text-dark border"
                                            style="font-size:11px;font-weight:600;">{{ $note->employee->name ?? __('النظام') }}</span>
                                        <span style="font-size:11px;color:var(--crm-text-muted);"><i
                                                class="bi bi-clock me-1"></i>{{ $note->created_at->diffForHumans() }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @empty
                        <div class="text-center py-5 opacity-50">
                            <i class="bi bi-chat-left-dots fs-1 d-block mb-2"></i>
                            <p class="mb-0 small">{{ __('لا توجد ملاحظات بعد') }}</p>
                        </div>
                    @endforelse
                </div>
            </div>
        </div>

        {{-- مودال تعديل تفاصيل الطلب الشامل --}}
        @can('manage-bookings')
            <div class="modal fade" id="editBookingModal" tabindex="-1" aria-labelledby="editBookingModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                        <div class="modal-header border-0 bg-light px-4 py-3">
                            <h6 class="modal-title fw-bold" id="editBookingModalLabel">
                                <i class="bi bi-pencil-square text-danger me-1"></i>
                                {{ __('تعديل تفاصيل الطلب') }} #{{ $booking->id }}
                            </h6>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form action="{{ route('crm.bookings.update', $booking) }}" method="POST">
                            @csrf
                            @method('PUT')
                            <div class="modal-body p-4">
                                <div class="row g-3">
                                    {{-- قسم بيانات العميل --}}
                                    <div class="col-12">
                                        <div class="fw-bold pb-1 text-primary border-bottom mb-2" style="font-size:13px;">
                                            <i class="bi bi-person me-1"></i> {{ __('بيانات العميل') }}
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">{{ __('اسم العميل') }} <span class="text-danger">*</span></label>
                                        <input type="text" name="client_name" class="form-control form-control-sm" required value="{{ old('client_name', $booking->client_name) }}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">{{ __('رقم الجوال') }} <span class="text-danger">*</span></label>
                                        <input type="text" name="client_phone" class="form-control form-control-sm" required dir="ltr" value="{{ old('client_phone', $booking->client_phone) }}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">{{ __('البريد الإلكتروني') }}</label>
                                        <input type="email" name="client_email" class="form-control form-control-sm" dir="ltr" value="{{ old('client_email', $booking->client_email) }}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">{{ __('المدينة') }}</label>
                                        <input type="text" name="city" class="form-control form-control-sm" value="{{ old('city', $booking->city) }}" placeholder="{{ __('مثال: الرياض') }}">
                                    </div>

                                    {{-- قسم بيانات الطلب والمسؤول --}}
                                    <div class="col-12 pt-2">
                                        <div class="fw-bold pb-1 text-primary border-bottom mb-2" style="font-size:13px;">
                                            <i class="bi bi-gear me-1"></i> {{ __('بيانات وإدارة الطلب') }}
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-bold small">{{ __('حالة الطلب') }} <span class="text-danger">*</span></label>
                                        <select name="status" class="form-select form-select-sm" required>
                                            @foreach($statuses as $key => $s)
                                                <option value="{{ $key }}" {{ old('status', $booking->status) === $key ? 'selected' : '' }}>{{ $s['label'] }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-bold small">{{ __('مسؤول المبيعات') }}</label>
                                        <select name="assigned_to" class="form-select form-select-sm">
                                            <option value="">{{ __('غير معين') }}</option>
                                            @foreach($employees as $emp)
                                                <option value="{{ $emp->id }}" {{ old('assigned_to', $booking->assigned_to) == $emp->id ? 'selected' : '' }}>{{ $emp->name }}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-bold small">{{ __('نوع الطلب') }}</label>
                                        <select name="booking_type" class="form-select form-select-sm">
                                            <option value="">{{ __('غير محدد') }}</option>
                                            <option value="purchase" {{ old('booking_type', $booking->booking_type) === 'purchase' ? 'selected' : '' }}>{{ __('شراء نقدي') }}</option>
                                            <option value="finance" {{ old('booking_type', $booking->booking_type) === 'finance' ? 'selected' : '' }}>{{ __('تمويل / تقسيط') }}</option>
                                            <option value="test_drive" {{ old('booking_type', $booking->booking_type) === 'test_drive' ? 'selected' : '' }}>{{ __('تجربة قيادة') }}</option>
                                            <option value="inquiry" {{ old('booking_type', $booking->booking_type) === 'inquiry' ? 'selected' : '' }}>{{ __('استفسار') }}</option>
                                        </select>
                                    </div>

                                    {{-- قسم السيارة وتفاصيل الأسعار --}}
                                    <div class="col-12 pt-2">
                                        <div class="fw-bold pb-1 text-primary border-bottom mb-2" style="font-size:13px;">
                                            <i class="bi bi-car-front me-1"></i> {{ __('السيارة والتفاصيل المالية') }}
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">{{ __('السيارة المطلوبة') }}</label>
                                        <select name="car_id" class="form-select form-select-sm">
                                            <option value="">{{ __('بدون سيارة محددة') }}</option>
                                            @foreach($cars as $car)
                                                <option value="{{ $car->id }}" {{ old('car_id', $booking->car_id) == $car->id ? 'selected' : '' }}>
                                                    {{ $car->brand->name ?? '' }} - {{ $car->name }} ({{ $car->year ?? '' }})
                                                </option>
                                            @endforeach
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">{{ __('اللون المطلوب') }}</label>
                                        <input type="text" name="preferred_color" class="form-control form-control-sm" value="{{ old('preferred_color', $booking->preferred_color) }}" placeholder="{{ __('مثال: أبيض لؤلؤي، أسود...') }}">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-bold small">{{ __('السعر الإجمالي (ر.س)') }}</label>
                                        <input type="number" step="0.01" min="0" name="total_price" class="form-control form-control-sm" value="{{ old('total_price', $booking->total_price) }}">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-bold small">{{ __('الدفعة الأولى (ر.س)') }}</label>
                                        <input type="number" step="0.01" min="0" name="down_payment" class="form-control form-control-sm" value="{{ old('down_payment', $booking->down_payment) }}">
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-bold small">{{ __('القسط الشهري (ر.س)') }}</label>
                                        <input type="number" step="0.01" min="0" name="monthly_installment" class="form-control form-control-sm" value="{{ old('monthly_installment', $booking->monthly_installment) }}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">{{ __('مدة التمويل (بالسنوات)') }}</label>
                                        <input type="number" min="1" max="10" name="duration_years" class="form-control form-control-sm" value="{{ old('duration_years', $booking->duration_years ?? 5) }}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold small">{{ __('الموقع / الفرع') }}</label>
                                        <input type="text" name="location" class="form-control form-control-sm" value="{{ old('location', $booking->location) }}">
                                    </div>

                                    {{-- الملاحظات --}}
                                    <div class="col-12 pt-2">
                                        <label class="form-label fw-bold small">{{ __('ملاحظات وتفاصيل الطلب') }}</label>
                                        <textarea name="notes" rows="3" class="form-control form-control-sm" placeholder="{{ __('تفاصيل التمويل، الالتزامات، جهة العمل، إلخ...') }}">{{ old('notes', $booking->notes) }}</textarea>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer border-0 bg-light px-4 py-3">
                                <button type="button" class="btn btn-sm btn-secondary rounded-2" data-bs-dismiss="modal">{{ __('إلغاء') }}</button>
                                <button type="submit" class="btn btn-sm btn-crm-primary rounded-2 px-4">{{ __('حفظ التعديلات') }}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        @endcan


    </div>
@endsection

@section('scripts')
    <script>
        window.onbeforeprint = () => document.title = 'طلب #{{ $booking->id }} — hamsh ';
    </script>
@endsection