<?php

namespace Database\Seeders;

use App\Models\Partner;
use Illuminate\Database\Seeder;

class PartnerSeeder extends Seeder
{
    public function run(): void
    {
        $partners = [
            [
                'name' => 'نوادر للسيارات',
                'logo' => 'partners/phgh7BHU6U96Ig0KVeQnLQ9bcvYyiiVWbgzD7U5P.webp',
                'link' => 'https://www.alinma.com',
                'sort_order' => 1,
            ],
            [
                'name' => 'البنك الأهلي السعودي',
                'logo' => 'partners/phgh7BHU6U96Ig0KVeQnLQ9bcvYyiiVWbgzD7U5P.webp',
                'link' => 'https://www.alrajhibank.com.sa',
                'sort_order' => 2,
            ],
            [
                'name' => 'مصرف الراجحي',
                'logo' => 'partners/phgh7BHU6U96Ig0KVeQnLQ9bcvYyiiVWbgzD7U5P.webp',
                'link' => 'https://www.snba.com',
                'sort_order' => 3,
            ],
        ];

        foreach ($partners as $data) {
            Partner::query()->firstOrCreate(
                ['link' => $data['link']],
                $data,
            );
        }
    }
}
