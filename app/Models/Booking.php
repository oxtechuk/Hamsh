<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Booking extends Model
{
    protected $fillable = [
        'car_id', 'assigned_to', 'client_name', 'client_phone', 'client_email',
        'down_payment', 'last_payment', 'duration_years', 'interest_rate', 'monthly_installment',
        'total_price', 'notes', 'status', 'source', 'last_contacted_at',
        'booking_type', 'location', 'city', 'brand_name', 'model_name',
        'model_year', 'preferred_color', 'salary_range',
        'traffic_source', 'traffic_medium', 'campaign_name', 'referrer_url',
        'landing_page', 'click_id', 'ip_address', 'user_agent', 'device_type',
        'fraud_score', 'is_suspicious', 'fraud_flags',
    ];

    protected $casts = [
        'last_contacted_at' => 'datetime',
        'is_suspicious' => 'boolean',
        'fraud_score' => 'integer',
        'fraud_flags' => 'array',
    ];

    const BOOKING_TYPES = ['test_drive', 'purchase', 'finance', 'inquiry'];

    const BOOKING_TYPES_LABELS = [
        'test_drive' => 'تجربة قيادة',
        'purchase' => 'شراء كاش',
        'finance' => 'طلب تمويل',
        'inquiry' => 'استفسار',
    ];

    const STATUSES = [
        'new' => ['label' => 'جديد',          'color' => 'primary'],
        'contacted' => ['label' => 'تم التواصل',     'color' => 'info'],
        'interested' => ['label' => 'مهتم',           'color' => 'warning'],
        'rejected' => ['label' => 'مرفوض',          'color' => 'danger'],
        'sold' => ['label' => 'تم البيع ✓',     'color' => 'success'],
    ];

    protected static function booted(): void
    {
        static::created(function (Booking $booking) {
            $sourceLabel = $booking->traffic_source_meta['label'] ?? $booking->traffic_source ?? 'المتجر';
            $sourceName = "حجز إلكتروني ($sourceLabel)";

            $source = ContactSource::firstOrCreate(
                ['name' => $sourceName],
                ['is_active' => true]
            );

            $existingLead = Lead::where('client_phone', $booking->client_phone)->first();

            $statusDetails = $booking->notes ?? 'طلب حجز تلقائي من المتجر';
            if ($booking->is_suspicious) {
                $statusDetails .= ' [⚠️ تنبيه: شبهة طلب وهمي / مكرر]';
            }

            if (! $existingLead) {
                Lead::create([
                    'client_name' => $booking->client_name,
                    'client_phone' => $booking->client_phone,
                    'client_email' => $booking->client_email,
                    'contact_source_id' => $source->id,
                    'status' => 'new',
                    'started_at' => now(),
                    'car_id' => $booking->car_id,
                    'assigned_to' => $booking->assigned_to,
                    'status_details' => $statusDetails,
                ]);
            } else {
                $updateData = [];
                if (empty($existingLead->car_id)) {
                    $updateData['car_id'] = $booking->car_id;
                }
                if (empty($existingLead->assigned_to)) {
                    $updateData['assigned_to'] = $booking->assigned_to;
                }
                if (! empty($updateData)) {
                    $existingLead->update($updateData);
                }
            }
        });
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    public function notes_list(): HasMany
    {
        return $this->hasMany(BookingNote::class)->latest();
    }

    public function latestNote(): HasOne
    {
        return $this->hasOne(BookingNote::class)->latestOfMany();
    }

    public function getLastActivity(): array
    {
        $latestNote = $this->relationLoaded('latestNote') ? $this->latestNote : $this->latestNote()->with('employee')->first();

        $bookingUpdated = $this->updated_at ?? $this->created_at;
        $noteDate = $latestNote?->created_at;

        if ($noteDate && $noteDate >= $bookingUpdated) {
            $date = $noteDate;
            $by = $latestNote->employee?->name;
            $action = match ($latestNote->type) {
                'status_change' => 'تغيير الحالة',
                'call' => 'تسجيل اتصال',
                'document' => 'رفع مستند',
                'assignment' => 'توزيع الطلب',
                default => 'ملاحظة'.($latestNote->note ? ': '.Str::limit($latestNote->note, 30) : ''),
            };
        } else {
            $date = $bookingUpdated;
            $by = $this->employee?->name;
            $action = 'تحديث الطلب';
        }

        return [
            'date' => $date,
            'time_ago' => $date->diffForHumans(),
            'action' => $action,
            'by' => $by,
            'note' => $latestNote?->note,
        ];
    }

    public function documents(): HasMany
    {
        return $this->hasMany(BookingDocument::class)->latest();
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status]['label'] ?? $this->status;
    }

    public function getStatusColorAttribute(): string
    {
        return self::STATUSES[$this->status]['color'] ?? 'secondary';
    }

    public function getBookingTypeLabelAttribute(): string
    {
        if (empty($this->booking_type)) {
            return 'طلب شراء كاش';
        }

        return self::BOOKING_TYPES_LABELS[$this->booking_type] ?? $this->booking_type;
    }

    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function scopeInProgress($query)
    {
        return $query->whereIn('status', ['contacted', 'interested']);
    }

    public const TRAFFIC_SOURCES_META = [
        'facebook' => [
            'label' => 'فيسبوك (Facebook)',
            'short_label' => 'Facebook',
            'color' => '#1877F2',
            'bg_class' => 'bg-blue-50 text-blue-700 border-blue-200',
            'icon' => 'ri-facebook-fill',
        ],
        'instagram' => [
            'label' => 'إنستغرام (Instagram)',
            'short_label' => 'Instagram',
            'color' => '#E1306C',
            'bg_class' => 'bg-pink-50 text-pink-700 border-pink-200',
            'icon' => 'ri-instagram-line',
        ],
        'snapchat' => [
            'label' => 'سناب شات (Snapchat)',
            'short_label' => 'Snapchat',
            'color' => '#FFFC00',
            'bg_class' => 'bg-amber-50 text-amber-800 border-amber-200',
            'icon' => 'ri-snapchat-fill',
        ],
        'tiktok' => [
            'label' => 'تيك توك (TikTok)',
            'short_label' => 'TikTok',
            'color' => '#000000',
            'bg_class' => 'bg-slate-100 text-slate-900 border-slate-300',
            'icon' => 'ri-tiktok-fill',
        ],
        'google' => [
            'label' => 'جوجل (Google)',
            'short_label' => 'Google',
            'color' => '#34A853',
            'bg_class' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'icon' => 'ri-google-fill',
        ],
        'direct' => [
            'label' => 'مباشر (Direct)',
            'short_label' => 'Direct',
            'color' => '#6c757d',
            'bg_class' => 'bg-gray-50 text-gray-700 border-gray-200',
            'icon' => 'ri-global-line',
        ],
        'other' => [
            'label' => 'أخرى (Other)',
            'short_label' => 'Other',
            'color' => '#6b7280',
            'bg_class' => 'bg-gray-50 text-gray-600 border-gray-200',
            'icon' => 'ri-link-m',
        ],
    ];

    public function getTrafficSourceMetaAttribute(): array
    {
        $source = strtolower($this->traffic_source ?? 'direct');

        return self::TRAFFIC_SOURCES_META[$source] ?? self::TRAFFIC_SOURCES_META['other'];
    }

    public function scopeSuspicious($query)
    {
        return $query->where('is_suspicious', true);
    }

    public function scopeClean($query)
    {
        return $query->where('is_suspicious', false);
    }

    public function scopeByTrafficSource($query, string $source)
    {
        return $query->where('traffic_source', $source);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'sold');
    }

    public static function getDefaultBank(): ?CalculatorBank
    {
        return CalculatorBank::query()->activeOrdered()->first();
    }

    public static function getDefaultInterestRate(): float
    {
        $defaultBank = self::getDefaultBank();

        return (float) ($defaultBank?->annual_rate ?? 3.5);
    }

    /**
     * حساب وتفصيل العمليات المالية المرتبطة بإعدادات الحاسبة والبنك الافتراضي
     *
     * @return array{
     *     bank_name: string,
     *     annual_rate: float,
     *     cash_price: float,
     *     down_payment: float,
     *     principal: float,
     *     duration_years: int,
     *     total_months: int,
     *     monthly_installment: float,
     *     total_payments: float,
     *     total_interest: float,
     *     total_financed: float
     * }
     */
    public function getFinanceDetails(): array
    {
        $defaultBank = self::getDefaultBank();
        $bankName = $defaultBank?->name ?? 'البنك الافتراضي';

        $annualRate = $this->interest_rate > 0
            ? (float) $this->interest_rate
            : (float) ($defaultBank?->annual_rate ?? 3.5);

        $cashPrice = (float) ($this->car?->cash_price ?: ($this->total_price ?: 0));
        $downPayment = (float) ($this->down_payment ?? 0);

        $lastPaymentEnabledSetting = Setting::where('key', 'finance_enable_last_payment')->value('value');
        $lastPaymentEnabled = $lastPaymentEnabledSetting !== null ? (bool) $lastPaymentEnabledSetting : true;
        $defaultLastPaymentPct = (float) (Setting::where('key', 'finance_default_last_payment_pct')->value('value') ?? 45);

        if ($this->last_payment !== null && (float) $this->last_payment > 0) {
            $lastPayment = (float) $this->last_payment;
        } elseif ($this->booking_type === 'finance' && $lastPaymentEnabled && $cashPrice > 0) {
            $lastPayment = round($cashPrice * ($defaultLastPaymentPct / 100));
        } else {
            $lastPayment = (float) ($this->last_payment ?? 0);
        }

        $durationYears = (int) ($this->duration_years ?: 5);
        $totalMonths = max(1, $durationYears * 12);
        $principal = max(0, $cashPrice - $downPayment);

        $durationYearsFloat = $totalMonths / 12;
        $calculatedInterest = round($principal * ($annualRate / 100) * $durationYearsFloat);
        $totalToRepay = $principal + $calculatedInterest;

        if ($this->monthly_installment > 0 && $this->last_payment !== null) {
            $monthlyInstallment = (float) $this->monthly_installment;
        } elseif ($principal > 0 && $totalMonths > 0) {
            $monthlyInstallment = round(max(0, $totalToRepay - $lastPayment) / $totalMonths);
        } else {
            $monthlyInstallment = (float) ($this->monthly_installment ?: 0);
        }

        $totalPayments = $monthlyInstallment * $totalMonths;
        $totalInterest = $this->monthly_installment > 0 && $this->last_payment !== null
            ? max(0, ($totalPayments + $lastPayment) - $principal)
            : $calculatedInterest;
        $totalFinanced = $totalPayments + $downPayment + $lastPayment;

        return [
            'bank_name' => $bankName,
            'annual_rate' => $annualRate,
            'cash_price' => $cashPrice,
            'down_payment' => $downPayment,
            'last_payment' => $lastPayment,
            'principal' => $principal,
            'duration_years' => $durationYears,
            'total_months' => $totalMonths,
            'monthly_installment' => $monthlyInstallment,
            'total_payments' => $totalPayments,
            'total_interest' => $totalInterest,
            'total_financed' => $totalFinanced,
        ];
    }
}
