<?php

namespace Tests\Feature\Api\Store;

use App\Models\Brand;
use App\Models\Car;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_paginated_cars_with_default_per_page(): void
    {
        $brand = Brand::create([
            'name' => ['en' => 'Toyota', 'ar' => 'تويوتا'],
            'slug' => 'toyota',
            'is_active' => true,
        ]);

        for ($i = 1; $i <= 15; $i++) {
            Car::create([
                'brand_id' => $brand->id,
                'name' => ['en' => "Car {$i}", 'ar' => "سيارة {$i}"],
                'slug' => ['en' => "car-{$i}", 'ar' => "سيارة-{$i}"],
                'model' => 'Camry',
                'cash_price' => 50000 + ($i * 1000),
                'min_down_payment' => 5000,
                'min_installment' => 1000,
                'year' => 2025,
                'type' => 'sedan',
                'is_active' => true,
            ]);
        }

        $response = $this->getJson(route('store.api.cars.index'));

        $response->assertOk()
            ->assertJsonPath('meta.per_page', 12)
            ->assertJsonPath('meta.total', 15)
            ->assertJsonCount(12, 'data');
    }

    public function test_it_supports_custom_per_page_and_all_parameter(): void
    {
        $brand = Brand::create([
            'name' => ['en' => 'Nissan', 'ar' => 'نيسان'],
            'slug' => 'nissan',
            'is_active' => true,
        ]);

        for ($i = 1; $i <= 20; $i++) {
            Car::create([
                'brand_id' => $brand->id,
                'name' => ['en' => "Nissan {$i}", 'ar' => "نيسان {$i}"],
                'slug' => ['en' => "nissan-{$i}", 'ar' => "نيسان-{$i}"],
                'model' => 'Sunny',
                'cash_price' => 40000 + ($i * 1000),
                'min_down_payment' => 4000,
                'min_installment' => 800,
                'year' => 2026,
                'type' => 'sedan',
                'is_active' => true,
            ]);
        }

        $customResponse = $this->getJson(route('store.api.cars.index', ['per_page' => 20]));
        $customResponse->assertOk()
            ->assertJsonPath('meta.per_page', 20)
            ->assertJsonCount(20, 'data');

        $allResponse = $this->getJson(route('store.api.cars.index', ['all' => 1]));
        $allResponse->assertOk()
            ->assertJsonCount(20, 'data');
    }
}
