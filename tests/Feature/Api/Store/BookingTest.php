<?php

namespace Tests\Feature\Api\Store;

use App\Models\Booking;
use App\Models\Brand;
use App\Models\CalculatorBank;
use App\Models\Car;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    private function createCar(): Car
    {
        $brand = Brand::create([
            'name' => ['en' => 'Toyota', 'ar' => 'تويوتا'],
            'slug' => 'toyota',
            'is_active' => true,
        ]);

        return Car::create([
            'brand_id' => $brand->id,
            'name' => ['en' => 'Camry', 'ar' => 'كامري'],
            'slug' => ['en' => 'camry', 'ar' => 'كامري'],
            'model' => 'Camry',
            'year' => 2025,
            'type' => 'sedan',
            'cash_price' => 125000,
            'min_down_payment' => 25000,
            'min_installment' => 3500,
            'is_active' => true,
        ]);
    }

    public function test_it_returns_booking_page_metadata(): void
    {
        Setting::create([
            'key' => 'store_booking_hero',
            'value' => [
                'title' => 'Book Your Car',
                'subtitle' => 'Easy financing',
                'image' => 'booking/hero.jpg',
            ],
        ]);

        $response = $this->getJson(route('store.api.booking.meta'));

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'hero' => ['title', 'subtitle', 'image'],
                'steps',
                'sections',
            ],
            'meta',
        ]);

        $this->assertEquals('Book Your Car', $response->json('data.hero.title.text'));
    }

    public function test_it_creates_a_booking_successfully(): void
    {
        $car = $this->createCar();

        $payload = [
            'car_id' => $car->id,
            'client_name' => 'Ahmed Ali',
            'client_phone' => '0501234567',
            'client_email' => 'ahmed@example.com',
            'city' => 'Riyadh',
            'down_payment' => 25000,
            'duration_years' => 5,
            'booking_type' => 'purchase',
        ];

        $response = $this->postJson(route('store.api.booking.store'), $payload);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'booking_id',
                'client_name',
                'client_phone',
                'car_id',
                'booking_type',
                'monthly_installment',
                'total_price',
                'down_payment',
                'duration_years',
                'status',
            ],
            'meta',
        ]);

        $this->assertEquals('Ahmed Ali', $response->json('data.client_name'));
        $this->assertEquals('purchase', $response->json('data.booking_type'));
        $this->assertEquals('new', $response->json('data.status'));

        $this->assertDatabaseHas('leads', [
            'client_name' => 'Ahmed Ali',
            'client_phone' => '0501234567',
            'client_email' => 'ahmed@example.com',
            'car_id' => $car->id,
            'status' => 'new',
        ]);
    }

    public function test_it_creates_a_finance_booking_successfully(): void
    {
        $car = $this->createCar();

        $payload = [
            'car_id' => $car->id,
            'client_name' => 'Sara Khaled',
            'client_phone' => '0555555555',
            'client_email' => 'sara@example.com',
            'city' => 'الرياض',
            'down_payment' => 0,
            'duration_years' => 5,
            'booking_type' => 'finance',
            'notes' => 'طلب تمويل سيارة',
        ];

        $response = $this->postJson(route('store.api.booking.store'), $payload);

        $response->assertStatus(201);
        $this->assertEquals('finance', $response->json('data.booking_type'));
    }

    public function test_it_creates_a_finance_booking_from_calculator_lead(): void
    {
        $car = $this->createCar();

        $payload = [
            'name' => 'محمد عبدالله',
            'phone' => '0551234567',
            'email' => 'mohammed@example.com',
            'city' => 'الرياض',
            'salary' => 12000,
            'monthly_obligations' => 2000,
            'car_ids' => [$car->id],
            'down_payment' => 15000,
            'last_payment' => 25000,
            'period_months' => 48,
            'monthly_payment' => 2450,
            'car_price' => 125000,
            'annual_rate' => 3.5,
            'notes' => 'أرغب بالتمويل بدون كفيل',
        ];

        $response = $this->postJson(route('store.api.calculator.lead'), $payload);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => ['lead_id'],
        ]);

        $this->assertDatabaseHas('bookings', [
            'client_name' => 'محمد عبدالله',
            'client_phone' => '0551234567',
            'car_id' => $car->id,
            'city' => 'الرياض',
            'booking_type' => 'finance',
            'status' => 'new',
            'source' => 'finance_calculator',
            'down_payment' => 15000,
            'last_payment' => 25000,
            'monthly_installment' => 2450,
            'salary_range' => '12000',
        ]);

        $this->assertDatabaseHas('calculator_leads', [
            'name' => 'محمد عبدالله',
            'phone' => '0551234567',
            'car_id' => $car->id,
        ]);

        $this->assertDatabaseHas('leads', [
            'client_name' => 'محمد عبدالله',
            'client_phone' => '0551234567',
            'status' => 'new',
        ]);
    }

    public function test_it_calculates_finance_with_last_payment(): void
    {
        $car = $this->createCar();
        $bank = CalculatorBank::create([
            'name' => 'بنك الراجحي',
            'annual_rate' => 3.5,
            'is_active' => true,
        ]);

        $response = $this->postJson(route('store.api.calculator.calculate'), [
            'car_id' => $car->id,
            'down_payment_percentage' => 10,
            'last_payment_percentage' => 20,
            'period_months' => 48,
            'bank_id' => $bank->id,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'car_price',
                'down_payment_amount',
                'down_payment_percentage',
                'last_payment_amount',
                'last_payment_percentage',
                'monthly_payment',
                'period_months',
            ],
        ]);
        $this->assertEquals(25000, $response->json('data.last_payment_amount'));
        $this->assertEquals(20, $response->json('data.last_payment_percentage'));
        $this->assertEquals(15750, $response->json('data.total_interest')); // 112,500 * 3.5% * 4 years = 15,750
        $this->assertEquals(2151, $response->json('data.monthly_payment'));
    }

    public function test_it_calculates_flat_interest_correctly_for_custom_bank_rate(): void
    {
        $car = $this->createCar(); // cash_price: 125,000
        $bank = CalculatorBank::create([
            'name' => 'بنك تجريبي 2.5%',
            'annual_rate' => 2.5,
            'is_active' => true,
        ]);

        $response = $this->postJson(route('store.api.calculator.calculate'), [
            'car_id' => $car->id,
            'down_payment_percentage' => 0,
            'last_payment_percentage' => 45,
            'period_months' => 60,
            'bank_id' => $bank->id,
        ]);

        $response->assertStatus(200);
        // Principal = 125,000, 2.5% annual rate, 5 years
        // Total interest = 125,000 * 2.5% * 5 = 15,625
        $this->assertEquals(15625, $response->json('data.total_interest'));
        $this->assertEquals(56250, $response->json('data.last_payment_amount')); // 45% of 125,000
        // (125,000 + 15,625 - 56,250) / 60 = 84,375 / 60 = 1,406.25 -> 1,406
        $this->assertEquals(1406, $response->json('data.monthly_payment'));
    }

    public function test_booking_requires_car_id_and_client_details(): void
    {
        $response = $this->postJson(route('store.api.booking.store'), []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['client_name', 'client_phone', 'city', 'brand_name']);
    }

    public function test_finance_booking_calculates_and_defaults_last_payment(): void
    {
        $car = $this->createCar();

        // 1. When submitting finance booking from modal without explicit last_payment
        $payload = [
            'car_id' => $car->id,
            'client_name' => 'فهد المطيري',
            'client_phone' => '0509876543',
            'city' => 'الرياض',
            'down_payment' => 0,
            'booking_type' => 'finance',
        ];

        $response = $this->postJson(route('store.api.booking.store'), $payload);
        $response->assertStatus(201);

        $booking = Booking::where('client_phone', '0509876543')->firstOrFail();
        $this->assertEquals(56250, $booking->last_payment); // 45% of 125,000

        $fin = $booking->getFinanceDetails();
        $this->assertEquals(56250, $fin['last_payment']);
        $this->assertEquals(5, $fin['duration_years']);
        $this->assertEquals(60, $fin['total_months']);
        $this->assertGreaterThan(0, $fin['monthly_installment']);
    }
}
