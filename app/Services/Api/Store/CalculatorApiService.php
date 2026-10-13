<?php

declare(strict_types=1);

namespace App\Services\Api\Store;

use App\Models\Booking;
use App\Models\CalculatorBank;
use App\Models\CalculatorLead;
use App\Models\Car;
use App\Services\Api\Store\Data\BookingData;
use App\Services\Tracking\AttributionResolverService;
use App\Services\Tracking\FraudDetectionService;
use App\Services\TwilioOtpService;
use Illuminate\Database\Eloquent\Collection;

final class CalculatorApiService
{
    public function __construct(
        private readonly ?BookingApiService $bookingApiService = null,
    ) {}

    public function saveLead(array $data): CalculatorLead
    {
        $carIds = $data['car_ids'] ?? [];
        $primaryCarId = ! empty($carIds) ? (int) $carIds[0] : null;

        $car = $primaryCarId ? Car::with('brand')->find($primaryCarId) : null;
        $periodMonths = isset($data['period_months']) && (int) $data['period_months'] > 0
            ? (int) $data['period_months']
            : 48;
        $durationYears = max(1, (int) round($periodMonths / 12));
        $downPayment = isset($data['down_payment']) ? (float) $data['down_payment'] : 0.0;
        $carPrice = isset($data['car_price']) && (float) $data['car_price'] > 0
            ? (float) $data['car_price']
            : (float) ($car?->current_price ?? $car?->cash_price ?? 0);

        $annualRate = isset($data['annual_rate']) && (float) $data['annual_rate'] > 0
            ? (float) $data['annual_rate']
            : (float) Booking::getDefaultInterestRate();

        $monthlyPayment = isset($data['monthly_payment']) && (float) $data['monthly_payment'] > 0
            ? (float) $data['monthly_payment']
            : null;

        if ($monthlyPayment === null && $carPrice > 0 && $periodMonths > 0) {
            $principal = max(0, $carPrice - $downPayment);
            $monthlyRate = ($annualRate / 100) / 12;
            if ($monthlyRate > 0) {
                $compounded = pow(1 + $monthlyRate, $periodMonths);
                $monthlyPayment = round($principal * ($monthlyRate * $compounded) / ($compounded - 1));
            } else {
                $monthlyPayment = round($principal / $periodMonths);
            }
        }

        $totalPrice = $monthlyPayment && $periodMonths
            ? ($monthlyPayment * $periodMonths + $downPayment)
            : $carPrice;

        $notesLines = [
            'طلب تمويل من حاسبة التمويل',
            ! empty($data['salary']) ? 'الدخل الشهري: '.number_format((float) $data['salary']).' ر.س' : null,
            ! empty($data['monthly_obligations']) ? 'الالتزامات الشهرية: '.number_format((float) $data['monthly_obligations']).' ر.س' : null,
            $downPayment > 0 ? 'الدفعة الأولى: '.number_format($downPayment).' ر.س' : null,
            $periodMonths > 0 ? "مدة التمويل: {$periodMonths} شهر ({$durationYears} سنوات)" : null,
            $monthlyPayment > 0 ? 'القسط الشهري التقديري: '.number_format($monthlyPayment).' ر.س' : null,
            ! empty($data['notes']) ? 'ملاحظات إضافية: '.$data['notes'] : null,
        ];
        $notes = implode(' | ', array_filter($notesLines));

        $brandName = null;
        if ($car?->brand) {
            $rawBrandName = $car->brand->name;
            $brandName = is_array($rawBrandName) ? ($rawBrandName['ar'] ?? reset($rawBrandName)) : (string) $rawBrandName;
        }

        $modelName = null;
        if ($car) {
            $rawModelName = $car->name;
            $modelName = is_array($rawModelName) ? ($rawModelName['ar'] ?? reset($rawModelName)) : (string) $rawModelName;
        }

        $attribution = app(AttributionResolverService::class)->resolve($data);
        $fraud = app(FraudDetectionService::class)->inspect($data, request()->ip());

        $bookingData = new BookingData(
            car_id: $primaryCarId,
            client_name: $data['name'],
            client_phone: $data['phone'],
            down_payment: $downPayment,
            duration_years: $durationYears,
            interest_rate: $annualRate,
            monthly_installment: $monthlyPayment ? (int) round($monthlyPayment) : null,
            total_price: $totalPrice ? (int) round($totalPrice) : null,
            status: 'new',
            source: 'finance_calculator',
            booking_type: 'finance',
            location: null,
            client_email: $data['email'] ?? null,
            notes: $notes,
            city: $data['city'] ?? null,
            brand_name: $brandName,
            model_name: $modelName,
            model_year: $car?->year ? (string) $car->year : null,
            salary_range: ! empty($data['salary']) ? (string) $data['salary'] : null,
            traffic_source: $attribution['traffic_source'] ?? 'direct',
            traffic_medium: $attribution['traffic_medium'] ?? null,
            campaign_name: $attribution['campaign_name'] ?? null,
            referrer_url: $attribution['referrer_url'] ?? null,
            landing_page: $attribution['landing_page'] ?? null,
            click_id: $attribution['click_id'] ?? null,
            ip_address: request()->ip(),
            user_agent: request()->userAgent(),
            device_type: $attribution['device_type'] ?? 'desktop',
            fraud_score: $fraud['fraud_score'] ?? 0,
            is_suspicious: $fraud['is_suspicious'] ?? false,
            fraud_flags: $fraud['fraud_flags'] ?? null,
        );

        $bookingService = $this->bookingApiService ?? app(BookingApiService::class);
        $booking = $bookingService->create($bookingData);

        return CalculatorLead::create([
            'name' => $data['name'],
            'phone' => $data['phone'],
            'car_id' => $primaryCarId,
            'details' => [
                'booking_id' => $booking->id,
                'email' => $data['email'] ?? null,
                'city' => $data['city'] ?? null,
                'salary' => $data['salary'] ?? null,
                'monthly_obligations' => $data['monthly_obligations'] ?? null,
                'down_payment' => $downPayment,
                'period_months' => $periodMonths,
                'monthly_payment' => $monthlyPayment,
                'car_price' => $carPrice,
                'preferred_bank_id' => $data['preferred_bank_id'] ?? null,
                'car_ids' => $carIds,
                'notes' => $data['notes'] ?? null,
            ],
        ]);
    }

    public function sendOtp(string $phone): array
    {
        $otpService = app(TwilioOtpService::class);

        $result = $otpService->sendOtp($phone);

        return [
            'success' => $result['success'] ?? false,
            'message' => $result['message'] ?? 'OTP sent',
        ];
    }

    public function verifyOtp(string $phone, string $code): bool
    {
        $otpService = app(TwilioOtpService::class);

        $result = $otpService->verifyOtp($phone, $code);

        return $result['success'] ?? false;
    }

    public function createLeadFromVerified(string $name, string $phone): CalculatorLead
    {
        return CalculatorLead::create([
            'name' => $name,
            'phone' => $phone,
            'details' => [
                'page' => 'calculator_page',
                'otp_verified_at' => now()->toISOString(),
            ],
        ]);
    }

    /** @return Collection<int, CalculatorBank> */
    public function banks(): Collection
    {
        return CalculatorBank::query()->activeOrdered()->get();
    }

    public function calculate(int $carId, float $downPaymentPct, int $periodMonths, int $bankId): array
    {
        $car = Car::findOrFail($carId);
        $bank = CalculatorBank::findOrFail($bankId);

        $carPrice = (float) ($car->current_price ?? $car->cash_price);
        $downPaymentAmount = round($carPrice * $downPaymentPct / 100);
        $loanAmount = $carPrice - $downPaymentAmount;
        $annualRate = $bank->annual_rate;
        $monthlyRate = $annualRate / 12 / 100;

        if ($monthlyRate > 0) {
            $compounded = pow(1 + $monthlyRate, $periodMonths);
            $monthlyPayment = round($loanAmount * ($monthlyRate * $compounded) / ($compounded - 1));
        } else {
            $monthlyPayment = round($loanAmount / $periodMonths);
        }

        $totalPayment = $monthlyPayment * $periodMonths;
        $totalInterest = $totalPayment - $loanAmount;

        return [
            'car_price' => $carPrice,
            'down_payment_amount' => $downPaymentAmount,
            'down_payment_percentage' => $downPaymentPct,
            'loan_amount' => $loanAmount,
            'monthly_payment' => $monthlyPayment,
            'period_months' => $periodMonths,
            'total_payment' => $totalPayment,
            'total_interest' => max(0, $totalInterest),
            'annual_rate' => $annualRate,
            'bank' => [
                'id' => $bank->id,
                'name' => $bank->name,
            ],
        ];
    }
}
