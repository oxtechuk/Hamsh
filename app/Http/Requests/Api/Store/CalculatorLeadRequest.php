<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Store;

use App\Http\Requests\Api\ApiBaseRequest;

final class CalculatorLeadRequest extends ApiBaseRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'monthly_obligations' => ['nullable', 'numeric', 'min:0'],
            'preferred_bank_id' => ['nullable', 'integer', 'exists:calculator_banks,id'],
            'car_ids' => ['nullable', 'array'],
            'car_ids.*' => ['integer', 'exists:cars,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'down_payment' => ['nullable', 'numeric', 'min:0'],
            'last_payment' => ['nullable', 'numeric', 'min:0'],
            'last_payment_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'period_months' => ['nullable', 'integer', 'min:1', 'max:120'],
            'monthly_payment' => ['nullable', 'numeric', 'min:0'],
            'car_price' => ['nullable', 'numeric', 'min:0'],
            'annual_rate' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
