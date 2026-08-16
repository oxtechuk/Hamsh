<?php

namespace Tests\Feature\Api\Store;

use App\Models\Brand;
use App\Models\Car;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarCompareTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_compares_two_or_three_cars_successfully(): void
    {
        $brand = Brand::create([
            'name' => ['en' => 'Toyota', 'ar' => 'تويوتا'],
            'slug' => 'toyota',
            'is_active' => true,
        ]);

        $car1 = Car::create([
            'brand_id' => $brand->id,
            'name' => ['en' => 'Camry', 'ar' => 'كامري'],
            'slug' => ['en' => 'camry', 'ar' => 'كامري'],
            'model' => 'Camry',
            'year' => 2025,
            'type' => 'sedan',
            'cash_price' => 125000,
            'min_down_payment' => 25000,
            'min_installment' => 3500,
            'specs' => [
                'hp' => '203 HP',
                'max_speed' => '210 km/h',
                'acceleration' => '5.6 seconds',
                'seats' => 5,
                'gearbox' => 'Automatic',
            ],
            'is_active' => true,
        ]);

        $car2 = Car::create([
            'brand_id' => $brand->id,
            'name' => ['en' => 'RAV4', 'ar' => 'راف فور'],
            'slug' => ['en' => 'rav4', 'ar' => 'راف-فور'],
            'model' => 'RAV4',
            'year' => 2025,
            'type' => 'suv',
            'cash_price' => 145000,
            'min_down_payment' => 29000,
            'min_installment' => 4000,
            'specs' => [
                'hp' => '219 HP',
                'max_speed' => '200 km/h',
                'acceleration' => '7.2 seconds',
                'seats' => 5,
                'gearbox' => 'Automatic',
            ],
            'is_active' => true,
        ]);

        $car3 = Car::create([
            'brand_id' => $brand->id,
            'name' => ['en' => 'Corolla', 'ar' => 'كورولا'],
            'slug' => ['en' => 'corolla', 'ar' => 'كورولا'],
            'model' => 'Corolla',
            'year' => 2025,
            'type' => 'sedan',
            'cash_price' => 95000,
            'min_down_payment' => 19000,
            'min_installment' => 2700,
            'specs' => [
                'hp' => '139 HP',
                'max_speed' => '180 km/h',
                'acceleration' => '9.0 seconds',
                'seats' => 5,
                'gearbox' => 'CVT',
            ],
            'is_active' => true,
        ]);

        // Request with 2 cars
        $response = $this->getJson(route('store.api.cars.compare', [
            'cars' => ['camry', 'rav4'],
        ]), ['Accept-Language' => 'en']);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'cars',
                'sections',
            ],
        ]);

        $data = $response->json('data');
        $this->assertCount(2, $data['cars']);
        $this->assertEquals('camry', $data['cars'][0]['slug']);
        $this->assertEquals('rav4', $data['cars'][1]['slug']);

        // Request with 3 cars
        $response3 = $this->getJson(route('store.api.cars.compare', [
            'cars' => ['camry', 'rav4', 'corolla'],
        ]), ['Accept-Language' => 'en']);

        $response3->assertStatus(200);
        $data3 = $response3->json('data');
        $this->assertCount(3, $data3['cars']);
        $this->assertEquals('corolla', $data3['cars'][2]['slug']);

        // Check specs/prices rows have 3 values
        $priceSection = collect($data3['sections'])->firstWhere('title', __('store-api.compare.sections.price'));
        $this->assertNotNull($priceSection);
        $this->assertCount(3, $priceSection['rows'][0]['values']);
        $this->assertEquals('125,000 SAR', $priceSection['rows'][0]['values'][0]);
        $this->assertEquals('145,000 SAR', $priceSection['rows'][0]['values'][1]);
        $this->assertEquals('95,000 SAR', $priceSection['rows'][0]['values'][2]);
    }

    public function test_it_reads_specs_from_array_format(): void
    {
        $brand = Brand::create([
            'name' => ['en' => 'Kia', 'ar' => 'كيا'],
            'slug' => 'kia',
            'is_active' => true,
        ]);

        $car1 = Car::create([
            'brand_id' => $brand->id,
            'name' => ['en' => 'K5', 'ar' => 'كيا K5'],
            'slug' => ['en' => 'k5', 'ar' => 'كيا-k5'],
            'model' => 'K5',
            'year' => 2025,
            'type' => 'sedan',
            'cash_price' => 96000,
            'min_down_payment' => 0,
            'min_installment' => 1375,
            'specs' => [
                ['label' => 'Horsepower', 'value' => '188 HP'],
                ['label' => 'Seats', 'value' => '5 Seats'],
                ['label' => 'Transmission', 'value' => 'Xtronic CVT'],
                ['label' => 'Fuel Type', 'value' => 'Gasoline'],
            ],
            'is_active' => true,
        ]);

        $car2 = Car::create([
            'brand_id' => $brand->id,
            'name' => ['en' => 'Altima', 'ar' => 'نيسان ألتيما'],
            'slug' => ['en' => 'altima', 'ar' => 'نيسان-ألتيما'],
            'model' => 'Altima',
            'year' => 2025,
            'type' => 'sedan',
            'cash_price' => 110000,
            'min_down_payment' => 0,
            'min_installment' => 1585,
            'specs' => [
                'hp' => 'HP 300',
                'seats' => '500',
                'gearbox' => 'اوتوماتيك',
            ],
            'is_active' => true,
        ]);

        $response = $this->getJson(route('store.api.cars.compare', [
            'cars' => ['k5', 'altima'],
        ]), ['Accept-Language' => 'en']);

        $response->assertStatus(200);
        $sections = $response->json('data.sections');

        $performance = collect($sections)->firstWhere('title', __('store-api.compare.sections.performance'));
        $this->assertNotNull($performance);
        $hpRow = collect($performance['rows'])->firstWhere('label', __('store-api.compare.labels.horsepower'));
        $this->assertNotNull($hpRow);
        $this->assertEquals('188 HP HP', $hpRow['values'][0]);
        $this->assertEquals('HP 300 HP', $hpRow['values'][1]);

        $design = collect($sections)->firstWhere('title', __('store-api.compare.sections.design'));
        $this->assertNotNull($design);
        $seatsRow = collect($design['rows'])->firstWhere('label', __('store-api.compare.labels.seats'));
        $this->assertNotNull($seatsRow);
        $this->assertEquals('5 Seats seats', $seatsRow['values'][0]);
        $this->assertEquals('500 seats', $seatsRow['values'][1]);

        $gearboxRow = collect($design['rows'])->firstWhere('label', __('store-api.compare.labels.gearbox'));
        $this->assertNotNull($gearboxRow);
        $this->assertEquals('Xtronic CVT', $gearboxRow['values'][0]);
        $this->assertEquals('اوتوماتيك', $gearboxRow['values'][1]);
    }
}
