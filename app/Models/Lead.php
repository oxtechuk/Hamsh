<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lead extends Model
{
    protected $fillable = [
        'client_name',
        'client_phone',
        'client_email',
        'subject',
        'country',
        'contact_source_id',
        'status',
        'started_at',
        'status_details',
        'car_id',
        'assigned_to',
        'salary',
        'obligations',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'date',
            'salary' => 'decimal:2',
            'obligations' => 'decimal:2',
        ];
    }

    public const STATUSES = [
        'new' => ['label' => 'جديد', 'color' => 'primary'],
        'contacted' => ['label' => 'تم التواصل', 'color' => 'info'],
        'interested' => ['label' => 'مهتم', 'color' => 'warning'],
        'negotiation' => ['label' => 'قيد التفاوض', 'color' => 'secondary'],
        'converted' => ['label' => 'تم التحويل', 'color' => 'success'],
        'lost' => ['label' => 'غير مهتم / مغلق', 'color' => 'danger'],
    ];

    public function contactSource(): BelongsTo
    {
        return $this->belongsTo(ContactSource::class);
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Booking::class, 'client_phone', 'client_phone');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'assigned_to');
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUSES[$this->status]['label'] ?? $this->status;
    }

    public function getStatusColorAttribute(): string
    {
        return self::STATUSES[$this->status]['color'] ?? 'secondary';
    }

    public function getSalaryAttribute($value): ?string
    {
        if ($value !== null && $value !== '') {
            return (string) $value;
        }

        $resolved = $this->resolveSalary();

        return $resolved !== null ? (string) $resolved : null;
    }

    public function getObligationsAttribute($value): ?string
    {
        if ($value !== null && $value !== '') {
            return (string) $value;
        }

        $resolved = $this->resolveObligations();

        return $resolved !== null ? (string) $resolved : null;
    }

    public function getEffectiveEmployeeAttribute(): ?Employee
    {
        if ($this->employee) {
            return $this->employee;
        }

        if ($this->relationLoaded('orders')) {
            $order = $this->orders->first(fn ($o) => $o->employee !== null);
            if ($order?->employee) {
                return $order->employee;
            }
        } else {
            $order = $this->orders()->whereNotNull('assigned_to')->with('employee')->latest()->first();
            if ($order?->employee) {
                return $order->employee;
            }
        }

        return null;
    }

    public function resolveSalary(): ?float
    {
        if ($salary = self::parseSalaryFromText($this->status_details)) {
            return $salary;
        }

        if ($this->relationLoaded('orders')) {
            foreach ($this->orders as $order) {
                if ($salary = self::parseSalaryFromText($order->notes)) {
                    return $salary;
                }
            }
        } else {
            foreach ($this->orders()->latest()->get() as $order) {
                if ($salary = self::parseSalaryFromText($order->notes)) {
                    return $salary;
                }
            }
        }

        return null;
    }

    public function resolveObligations(): ?float
    {
        $obs = self::parseObligationsFromText($this->status_details);
        if ($obs !== null) {
            return $obs;
        }

        if ($this->relationLoaded('orders')) {
            foreach ($this->orders as $order) {
                $obs = self::parseObligationsFromText($order->notes);
                if ($obs !== null) {
                    return $obs;
                }
            }
        } else {
            foreach ($this->orders()->latest()->get() as $order) {
                $obs = self::parseObligationsFromText($order->notes);
                if ($obs !== null) {
                    return $obs;
                }
            }
        }

        return null;
    }

    public static function parseSalaryFromText(?string $text): ?float
    {
        if (empty($text)) {
            return null;
        }

        // Match patterns like: الدخل الشهري: 12,000 or الراتب الشهري: 12000 or الراتب: 12000 or salary: 12000 or الدخل: 12000
        if (preg_match('/(?:الدخل الشهري|الراتب الشهري|الراتب|الدخل|salary)\s*[:=]?\s*([0-9,]+(?:\.[0-9]+)?)/ui', $text, $matches)) {
            $val = (float) str_replace(',', '', $matches[1]);

            return $val > 0 ? $val : null;
        }

        return null;
    }

    public static function parseObligationsFromText(?string $text): ?float
    {
        if (empty($text)) {
            return null;
        }

        // Check for explicit "بدون التزام" or "بدون التزامات"
        if (preg_match('/بدون\s+التزام(?:ات)?/u', $text) && ! preg_match('/(?:قيمة الالتزامات|الالتزامات الشهرية|الالتزامات)\s*[:=]?\s*[1-9]/u', $text)) {
            return 0.0;
        }

        // Match patterns like: قيمة الالتزامات: 2,500 or الالتزامات الشهرية: 2500 or الالتزامات: 2500 or obligations: 2500
        if (preg_match('/(?:قيمة الالتزامات|الالتزامات الشهرية|الالتزامات|التزامات|obligations)\s*[:=]?\s*([0-9,]+(?:\.[0-9]+)?)/ui', $text, $matches)) {
            return (float) str_replace(',', '', $matches[1]);
        }

        return null;
    }
}
