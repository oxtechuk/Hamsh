<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            'الرياض',
            'جدة',
            'الدمام',
            'مكة المكرمة',
            'المدينة المنورة',
            'القصيم',
            'أبها',
            'تبوك',
            'حائل',
            'الجبيل',
            'الخبر',
            'القطيف',
            'بريدة',
            'خميس مشيط',
            'ينبع',
            'الأحساء',
            'جازان',
            'عرعر',
            'سكاكا',
            'وادي الدواسر',
            'الباحة',
            'الطائف',
        ];

        foreach ($cities as $index => $name) {
            City::firstOrCreate(
                ['name' => $name],
                ['is_active' => true, 'sort_order' => $index],
            );
        }
    }
}
