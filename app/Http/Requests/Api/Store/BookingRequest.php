<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Store;

use App\Http\Requests\Api\ApiBaseRequest;

final class BookingRequest extends ApiBaseRequest
{
    public function rules(): array
    {
        $carId = $this->input('car_id');

        $rules = [
            'client_name' => ['required', 'string', 'max:255'],
            'client_phone' => ['required', 'string', 'max:20'],
            'client_email' => ['nullable', 'email', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];

        if ($carId) {
            // Type 2: Direct purchase (car selected)
            $rules['car_id'] = ['required', 'exists:cars,id'];
            $rules['down_payment'] = ['required', 'integer', 'min:0'];
            $rules['last_payment'] = ['nullable', 'numeric', 'min:0'];
            $rules['duration_years'] = ['nullable', 'integer', 'min:1', 'max:10'];
            $rules['interest_rate'] = ['nullable', 'numeric', 'min:0', 'max:50'];
        } else {
            // Type 1: Inquiry (no car selected)
            $rules['car_id'] = ['nullable', 'exists:cars,id'];
            $rules['brand_name'] = ['required', 'string', 'max:255'];
            $rules['model_name'] = ['nullable', 'string', 'max:255'];
            $rules['model_year'] = ['nullable', 'string', 'max:4'];
            $rules['preferred_color'] = ['nullable', 'string', 'max:100'];
            $rules['salary_range'] = ['nullable', 'string', 'max:100'];
            $rules['down_payment'] = ['nullable', 'integer', 'min:0'];
            $rules['last_payment'] = ['nullable', 'numeric', 'min:0'];
            $rules['duration_years'] = ['nullable', 'integer', 'min:1', 'max:10'];
            $rules['interest_rate'] = ['nullable', 'numeric', 'min:0', 'max:50'];
        }

        $rules['booking_type'] = ['nullable', 'string', 'in:test_drive,purchase,finance,inquiry'];

        // Attribution & Anti-Fraud Rules
        $rules['traffic_source'] = ['nullable', 'string', 'max:50'];
        $rules['traffic_medium'] = ['nullable', 'string', 'max:100'];
        $rules['campaign_name'] = ['nullable', 'string', 'max:150'];
        $rules['referrer_url'] = ['nullable', 'string', 'max:500'];
        $rules['landing_page'] = ['nullable', 'string', 'max:255'];
        $rules['click_id'] = ['nullable', 'string', 'max:255'];
        $rules['utm_source'] = ['nullable', 'string', 'max:100'];
        $rules['utm_medium'] = ['nullable', 'string', 'max:100'];
        $rules['utm_campaign'] = ['nullable', 'string', 'max:150'];
        $rules['utm_content'] = ['nullable', 'string', 'max:150'];
        $rules['utm_term'] = ['nullable', 'string', 'max:150'];
        $rules['form_duration'] = ['nullable', 'numeric'];
        $rules['hp_field'] = ['nullable', 'string'];
        $rules['website_hp'] = ['nullable', 'string'];

        return $rules;
    }
}
