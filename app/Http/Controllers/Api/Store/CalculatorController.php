<?php

namespace App\Http\Controllers\Api\Store;

use App\Http\Api\Response\Builder\ApiResponseBuilder;
use App\Http\Controllers\Api\ApiBaseController;
use App\Http\Requests\Api\Store\CalculatorCalculateRequest;
use App\Http\Requests\Api\Store\CalculatorLeadRequest;
use App\Http\Requests\Api\Store\CalculatorOtpSendRequest;
use App\Http\Requests\Api\Store\CalculatorOtpVerifyRequest;
use App\Http\Resources\Store\CalculatorBankResource;
use App\Models\CalculatorBank;
use App\Models\Setting;
use App\Services\Api\Store\CalculatorApiService;
use App\Services\TrackingService;

final class CalculatorController extends ApiBaseController
{
    public function __construct(
        private readonly CalculatorApiService $calculatorService,
    ) {
        parent::__construct(app(ApiResponseBuilder::class));
    }

    public function banks()
    {
        $banks = $this->calculatorService->banks();

        return $this->respondSuccess(
            CalculatorBankResource::collection($banks),
        );
    }

    public function settings()
    {
        $otpSetting = Setting::where('key', 'enable_twilio_otp')->first();
        $otpEnabled = $otpSetting ? (bool) $otpSetting->value : false;

        $dbrPersonal = Setting::where('key', 'finance_dbr_limit_personal')->first();
        $dbrRealEstate = Setting::where('key', 'finance_dbr_limit_real_estate')->first();
        $debtSolutionText = Setting::where('key', 'finance_debt_solution_text')->first();
        $exceededWarningText = Setting::where('key', 'finance_exceeded_warning_text')->first();

        $lastPaymentSetting = Setting::where('key', 'finance_enable_last_payment')->first();
        $lastPaymentEnabled = $lastPaymentSetting !== null ? (bool) $lastPaymentSetting->value : true;
        $defaultLastPaymentPct = (int) (Setting::where('key', 'finance_default_last_payment_pct')->value('value') ?? 45);
        $maxLastPaymentPct = (int) (Setting::where('key', 'finance_max_last_payment_pct')->value('value') ?? 50);

        return $this->respondSuccess([
            'otp_enabled' => $otpEnabled,
            'dbr_limit_personal' => $dbrPersonal && is_numeric($dbrPersonal->value) ? (int) $dbrPersonal->value : 45,
            'dbr_limit_real_estate' => $dbrRealEstate && is_numeric($dbrRealEstate->value) ? (int) $dbrRealEstate->value : 65,
            'debt_solution_text' => $debtSolutionText ? (string) $debtSolutionText->value : 'أرغب في الاستفادة من خيارات الحلول التمويلية وتوحيد الالتزامات',
            'exceeded_warning_text' => $exceededWarningText ? (string) $exceededWarningText->value : 'نسبة الاستقطاع تتجاوز الحد المسموح به للتمويل.',
            'last_payment_enabled' => $lastPaymentEnabled,
            'default_last_payment_pct' => $defaultLastPaymentPct,
            'max_last_payment_pct' => $maxLastPaymentPct,
        ]);
    }

    public function calculate(CalculatorCalculateRequest $request)
    {
        $result = $this->calculatorService->calculate(
            carId: (int) $request->input('car_id'),
            downPaymentPct: (float) $request->input('down_payment_percentage', 10),
            periodMonths: (int) $request->input('period_months', 12),
            bankId: (int) $request->input('bank_id', CalculatorBank::query()->first()->id),
            lastPaymentPct: (float) $request->input('last_payment_percentage', 0),
        );

        return $this->respondSuccess($result);
    }

    public function saveLead(CalculatorLeadRequest $request)
    {
        $lead = $this->calculatorService->saveLead($request->validated());

        TrackingService::sendLead([
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'value' => $request->input('car_price'),
            'currency' => 'SAR',
        ]);

        return $this->respondCreated(
            ['lead_id' => $lead->id],
            'Lead saved successfully'
        );
    }

    public function sendOtp(CalculatorOtpSendRequest $request)
    {
        $result = $this->calculatorService->sendOtp(
            $request->input('phone')
        );

        if (! $result['success']) {
            return $this->respondError($result['message'], 422);
        }

        return $this->respondSuccess(null, $result['message']);
    }

    public function verifyOtp(CalculatorOtpVerifyRequest $request)
    {
        $verified = $this->calculatorService->verifyOtp(
            $request->input('phone'),
            $request->input('code')
        );

        if (! $verified) {
            return $this->respondError('Invalid or expired code', 422);
        }

        $lead = $this->calculatorService->createLeadFromVerified(
            $request->input('name'),
            $request->input('phone')
        );

        TrackingService::sendLead([
            'name' => $request->input('name'),
            'phone' => $request->input('phone'),
            'currency' => 'SAR',
        ]);

        return $this->respondCreated(
            ['lead_id' => $lead->id],
            'OTP verified successfully'
        );
    }
}
