<?php

namespace Database\Seeders;

use App\Models\ProjectDesign;
use Illuminate\Database\Seeder;

class DesignSeeder extends Seeder
{
    public function run(): void
    {
        $designs = [
            [
                'type' => 'social',
                'name' => ['ar' => 'عرض صيفي على تويوتا كامري', 'en' => 'Summer Offer on Toyota Camry'],
                'image' => 'settings/hero/JO4J8vNqFu66Z1qINHW9OkTtmbneChFEpCxi74YN.webp',
                'link' => '/cars',
                'price' => null,
                'top_speed' => null,
                'power' => null,
                'year' => null,
                'badge_text' => null,
                'is_featured' => false,
                'sort_order' => 1,
            ],
            [
                'type' => 'social',
                'name' => ['ar' => 'تأمين شامل بأسعار مميزة', 'en' => 'Comprehensive Insurance at Special Prices'],
                'image' => 'settings/home/zpklAzlCw7aF1CDKUA0hWo4BNZM8NFlt9t19jOpd.png',
                'link' => '/offers',
                'price' => null,
                'top_speed' => null,
                'power' => null,
                'year' => null,
                'badge_text' => null,
                'is_featured' => false,
                'sort_order' => 2,
            ],
            [
                'type' => 'featured_offer',
                'name' => ['ar' => 'بي إم دبليو X5 2025', 'en' => 'BMW X5 2025'],
                'image' => 'settings/cars/Yo5PWrfPke5e2WIrQTpluOELt91Mq8mu6VCYggfm.png',
                'link' => '/cars',
                'price' => '280,000',
                'top_speed' => '250 كم/س',
                'power' => '375 حصان',
                'year' => '2025',
                'badge_text' => 'جديد',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'type' => 'featured_offer',
                'name' => ['ar' => 'تويوتا لاند كروزر 2025', 'en' => 'Toyota Land Cruiser 2025'],
                'image' => 'settings/hero/JO4J8vNqFu66Z1qINHW9OkTtmbneChFEpCxi74YN.webp',
                'link' => '/cars',
                'price' => '320,000',
                'top_speed' => '210 كم/س',
                'power' => '409 حصان',
                'year' => '2025',
                'badge_text' => 'الأكثر مبيعاً',
                'is_featured' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($designs as $data) {
            if (! ProjectDesign::where('link', $data['link'])->where('type', $data['type'])->exists()) {
                ProjectDesign::create($data);
            }
        }
    }
}
