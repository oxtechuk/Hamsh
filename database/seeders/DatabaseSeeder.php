<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionSeeder::class);
        $this->call(AdminSeeder::class);
        $this->call(CalculatorDefaultsSeeder::class);
        $this->call(ContactSourcesSeeder::class);
        $this->call(CitySeeder::class);
        $this->call(CarTypeSeeder::class);
        $this->call(CarSeeder::class);
        $this->call(SettingsSeeder::class);
        $this->call(DesignSeeder::class);
        $this->call(PartnerSeeder::class);
        $this->call(TestimonialSeeder::class);
        $this->call(FaqSeeder::class);
        $this->call(BlogPostSeeder::class);
    }
}
