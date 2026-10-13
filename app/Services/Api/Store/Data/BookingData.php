<?php

declare(strict_types=1);

namespace App\Services\Api\Store\Data;

use App\Models\Booking;
use App\Models\Setting;
use App\Services\Api\Store\Helpers\InstallmentCalculator;
use App\Services\Tracking\AttributionResolverService;
use App\Services\Tracking\FraudDetectionService;

final class BookingData
{
    public function __construct(
        public readonly ?int $car_id,
        public readonly string $client_name,
        public readonly string $client_phone,
        public readonly ?float $down_payment,
        public readonly ?int $duration_years,
        public readonly ?float $interest_rate,
        public readonly ?int $monthly_installment,
        public readonly ?int $total_price,
        public readonly ?float $last_payment = null,
        public readonly string $status = 'new',
        public readonly string $source = 'api',
        public readonly ?string $booking_type = null,
        public readonly ?string $location = null,
        public readonly ?string $client_email = null,
        public readonly ?string $notes = null,
        public readonly ?string $city = null,
        public readonly ?string $brand_name = null,
        public readonly ?string $model_name = null,
        public readonly ?string $model_year = null,
        public readonly ?string $preferred_color = null,
        public readonly ?string $salary_range = null,
        public readonly ?string $traffic_source = 'direct',
        public readonly ?string $traffic_medium = null,
        public readonly ?string $campaign_name = null,
        public readonly ?string $referrer_url = null,
        public readonly ?string $landing_page = null,
        public readonly ?string $click_id = null,
        public readonly ?string $ip_address = null,
        public readonly ?string $user_agent = null,
        public readonly ?string $device_type = 'desktop',
        public readonly int $fraud_score = 0,
        public readonly bool $is_suspicious = false,
        public readonly ?array $fraud_flags = null,
    ) {}

    public static function fromRequest(array $validated, ?float $cashPrice = null): self
    {
        $carId = $validated['car_id'] ?? null;
        $attribution = app(AttributionResolverService::class)->resolve($validated);
        $fraud = app(FraudDetectionService::class)->inspect($validated, request()->ip());

        if ($carId && $cashPrice !== null) {
            // Type 2: Direct purchase or finance — calculate installment
            $interestRate = isset($validated['interest_rate']) && $validated['interest_rate'] > 0
                ? (float) $validated['interest_rate']
                : (float) Booking::getDefaultInterestRate();

            $bookingType = $validated['booking_type'] ?? 'purchase';
            $isFinance = $bookingType === 'finance';

            $downPayment = (float) ($validated['down_payment'] ?? 0);
            $principal = max(0, $cashPrice - $downPayment);
            $durationYears = (int) ($validated['duration_years'] ?? ($isFinance ? 5 : 1));
            $totalMonths = max(1, $durationYears * 12);

            if (isset($validated['last_payment']) && is_numeric($validated['last_payment'])) {
                $lastPayment = (float) $validated['last_payment'];
            } elseif ($isFinance) {
                $defaultLastPaymentPct = (float) (Setting::where('key', 'finance_default_last_payment_pct')->value('value') ?? 45);
                $lastPayment = round($principal * ($defaultLastPaymentPct / 100));
            } else {
                $lastPayment = null;
            }

            $calculator = new InstallmentCalculator;
            $monthly = $calculator->calculate($principal, $totalMonths, $interestRate, (float) ($lastPayment ?? 0));

            return new self(
                car_id: (int) $carId,
                client_name: $validated['client_name'],
                client_phone: $validated['client_phone'],
                down_payment: $downPayment,
                duration_years: $durationYears,
                interest_rate: $interestRate,
                monthly_installment: (int) round($monthly),
                total_price: (int) round($monthly * $totalMonths + $downPayment + (float) ($lastPayment ?? 0)),
                last_payment: $lastPayment,
                booking_type: $bookingType,
                location: $validated['location'] ?? null,
                client_email: $validated['client_email'] ?? null,
                notes: $validated['notes'] ?? null,
                city: $validated['city'] ?? null,
                brand_name: null,
                model_name: null,
                model_year: null,
                preferred_color: null,
                salary_range: null,
                traffic_source: $attribution['traffic_source'],
                traffic_medium: $attribution['traffic_medium'],
                campaign_name: $attribution['campaign_name'],
                referrer_url: $attribution['referrer_url'],
                landing_page: $attribution['landing_page'],
                click_id: $attribution['click_id'],
                ip_address: request()->ip(),
                user_agent: request()->userAgent(),
                device_type: $attribution['device_type'],
                fraud_score: $fraud['fraud_score'],
                is_suspicious: $fraud['is_suspicious'],
                fraud_flags: $fraud['fraud_flags'],
            );
        }

        // Type 1: Inquiry — no installment calculation
        return new self(
            car_id: null,
            client_name: $validated['client_name'],
            client_phone: $validated['client_phone'],
            down_payment: null,
            duration_years: null,
            interest_rate: null,
            monthly_installment: null,
            total_price: null,
            last_payment: isset($validated['last_payment']) ? (float) $validated['last_payment'] : null,
            booking_type: $validated['booking_type'] ?? 'inquiry',
            location: $validated['location'] ?? null,
            client_email: $validated['client_email'] ?? null,
            notes: $validated['notes'] ?? null,
            city: $validated['city'] ?? null,
            brand_name: $validated['brand_name'] ?? null,
            model_name: $validated['model_name'] ?? null,
            model_year: $validated['model_year'] ?? null,
            preferred_color: $validated['preferred_color'] ?? null,
            salary_range: $validated['salary_range'] ?? null,
            traffic_source: $attribution['traffic_source'],
            traffic_medium: $attribution['traffic_medium'],
            campaign_name: $attribution['campaign_name'],
            referrer_url: $attribution['referrer_url'],
            landing_page: $attribution['landing_page'],
            click_id: $attribution['click_id'],
            ip_address: request()->ip(),
            user_agent: request()->userAgent(),
            device_type: $attribution['device_type'],
            fraud_score: $fraud['fraud_score'],
            is_suspicious: $fraud['is_suspicious'],
            fraud_flags: $fraud['fraud_flags'],
        );
    }

    public function toDatabase(): array
    {
        return [
            'car_id' => $this->car_id,
            'client_name' => $this->client_name,
            'client_phone' => $this->client_phone,
            'down_payment' => $this->down_payment,
            'last_payment' => $this->last_payment,
            'duration_years' => $this->duration_years,
            'interest_rate' => $this->interest_rate,
            'monthly_installment' => $this->monthly_installment,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'source' => $this->source,
            'booking_type' => $this->booking_type,
            'location' => $this->location,
            'client_email' => $this->client_email,
            'notes' => $this->notes,
            'city' => $this->city,
            'brand_name' => $this->brand_name,
            'model_name' => $this->model_name,
            'model_year' => $this->model_year,
            'preferred_color' => $this->preferred_color,
            'salary_range' => $this->salary_range,
            'traffic_source' => $this->traffic_source,
            'traffic_medium' => $this->traffic_medium,
            'campaign_name' => $this->campaign_name,
            'referrer_url' => $this->referrer_url,
            'landing_page' => $this->landing_page,
            'click_id' => $this->click_id,
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'device_type' => $this->device_type,
            'fraud_score' => $this->fraud_score,
            'is_suspicious' => $this->is_suspicious,
            'fraud_flags' => $this->fraud_flags,
        ];
    }
}
