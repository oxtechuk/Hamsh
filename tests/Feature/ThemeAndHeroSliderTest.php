<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class ThemeAndHeroSliderTest extends TestCase
{
    use RefreshDatabase;

    public function test_theme_colors_and_hero_slides_can_be_saved_in_crm(): void
    {
        Storage::fake('public');

        $permission = Permission::create([
            'name' => 'manage-settings',
            'guard_name' => 'employee',
        ]);

        $employee = Employee::create([
            'name' => 'Settings Admin',
            'username' => 'settings_admin',
            'email' => 'settings@test.com',
            'password' => 'Password123!',
            'role' => 'admin',
            'is_active' => true,
        ]);
        $employee->givePermissionTo($permission);

        $desktopImage = UploadedFile::fake()->image('desktop_banner.jpg', 1920, 600);
        $mobileImage = UploadedFile::fake()->image('mobile_banner.jpg', 750, 600);

        $response = $this->actingAs($employee, 'employee')
            ->post(route('crm.settings.update'), [
                'theme_primary_color' => '#E0A938',
                'theme_secondary_color' => '#1E293B',
                'theme_button_bg_color' => '#E0A938',
                'theme_button_text_color' => '#FFFFFF',
                'theme_text_primary_color' => '#0F172A',
                'theme_text_secondary_color' => '#64748B',
                'theme_background_color' => '#FAFAFA',
                'theme_footer_bg_color' => '#0F172A',
                'commercial_registration_no' => '7054436493',
                'tax_number' => '3148150319',
                'maroof_number' => '373677',
                'maroof_url' => 'https://maroof.sa/373677',
                'gps_map_link' => 'https://maps.google.com/?q=24.7136,46.6753',
                'show_footer_map' => '1',
                'hero_slides_submitted' => '1',
                'hero_slides' => [
                    [
                        'image_desktop' => $desktopImage,
                        'image_mobile' => $mobileImage,
                        'link' => '/cars',
                        'button_text' => 'تصفح السيارات الآن',
                    ],
                ],
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertEquals('#E0A938', Setting::where('key', 'theme_primary_color')->value('value'));
        $this->assertEquals('#1E293B', Setting::where('key', 'theme_secondary_color')->value('value'));
        $this->assertEquals('7054436493', Setting::where('key', 'commercial_registration_no')->value('value'));
        $this->assertEquals('3148150319', Setting::where('key', 'tax_number')->value('value'));
        $this->assertEquals('373677', Setting::where('key', 'maroof_number')->value('value'));
        $this->assertEquals('https://maps.google.com/?q=24.7136,46.6753', Setting::where('key', 'gps_map_link')->value('value'));

        $slides = Setting::where('key', 'hero_slides')->value('value');
        $this->assertIsArray($slides);
        $this->assertCount(1, $slides);
        $this->assertNotEmpty($slides[0]['image_desktop']);
        $this->assertNotEmpty($slides[0]['image_mobile']);
        $this->assertEquals('/cars', $slides[0]['link']);
        $this->assertEquals('تصفح السيارات الآن', $slides[0]['button_text']);
    }

    public function test_finance_dbr_limits_can_be_saved_and_retrieved(): void
    {
        $permission = Permission::create([
            'name' => 'manage-settings',
            'guard_name' => 'employee',
        ]);

        $employee = Employee::create([
            'name' => 'Settings Admin 2',
            'username' => 'settings_admin_2',
            'email' => 'settings2@test.com',
            'password' => 'Password123!',
            'role' => 'admin',
            'is_active' => true,
        ]);
        $employee->givePermissionTo($permission);

        $response = $this->actingAs($employee, 'employee')
            ->post(route('crm.settings.update'), [
                'finance_dbr_limit_personal' => '40',
                'finance_dbr_limit_real_estate' => '60',
                'finance_debt_solution_text' => 'أرغب في حلول تمويلية إضافية',
                'finance_exceeded_warning_text' => 'تجاوزت الحد المسموح',
            ]);

        $response->assertRedirect();
        $this->assertEquals('40', Setting::where('key', 'finance_dbr_limit_personal')->value('value'));
        $this->assertEquals('60', Setting::where('key', 'finance_dbr_limit_real_estate')->value('value'));

        $calcResponse = $this->getJson(route('store.api.calculator.settings'));
        $calcResponse->assertStatus(200);
        $calcResponse->assertJsonPath('data.dbr_limit_personal', 40);
        $calcResponse->assertJsonPath('data.dbr_limit_real_estate', 60);
        $calcResponse->assertJsonPath('data.debt_solution_text', 'أرغب في حلول تمويلية إضافية');

        $footerResponse = $this->getJson(route('store.api.settings.footer'));
        $footerResponse->assertStatus(200);
        $footerResponse->assertJsonPath('data.finance_calculator.dbr_limit_personal', 40);
        $footerResponse->assertJsonPath('data.finance_calculator.dbr_limit_real_estate', 60);
    }

    public function test_store_api_settings_returns_theme_colors_and_business_info(): void
    {
        Setting::create(['key' => 'theme_primary_color', 'value' => '#FF5500']);
        Setting::create(['key' => 'theme_secondary_color', 'value' => '#002244']);
        Setting::create(['key' => 'theme_button_bg_color', 'value' => '#FF5500']);
        Setting::create(['key' => 'theme_button_text_color', 'value' => '#FFFFFF']);
        Setting::create(['key' => 'commercial_registration_no', 'value' => '7054436493']);
        Setting::create(['key' => 'tax_number', 'value' => '3148150319']);
        Setting::create(['key' => 'maroof_number', 'value' => '373677']);
        Setting::create(['key' => 'gps_map_link', 'value' => 'https://maps.google.com/?q=24.7136,46.6753']);

        $response = $this->getJson(route('store.api.settings.footer'));

        $response->assertStatus(200);
        $response->assertJsonPath('data.theme.primary_color', '#FF5500');
        $response->assertJsonPath('data.theme.secondary_color', '#002244');
        $response->assertJsonPath('data.theme.button_bg_color', '#FF5500');
        $response->assertJsonPath('data.theme.button_text_color', '#FFFFFF');
        $response->assertJsonPath('data.business_info.cr_number', '7054436493');
        $response->assertJsonPath('data.business_info.tax_number', '3148150319');
        $response->assertJsonPath('data.business_info.maroof_number', '373677');
        $response->assertJsonPath('data.business_info.map_link', 'https://maps.google.com/?q=24.7136,46.6753');
        $response->assertJsonPath('data.business_info.show_footer_map', true);
    }

    public function test_home_api_returns_desktop_and_mobile_hero_slides(): void
    {
        Setting::create([
            'key' => 'hero_slides',
            'value' => [
                [
                    'image_desktop' => 'settings/hero/desktop.jpg',
                    'image_mobile' => 'settings/hero/mobile.jpg',
                    'link' => '/cars',
                    'button_text' => 'عرض السيارات',
                ],
            ],
        ]);

        $response = $this->getJson(route('store.api.home'));

        $response->assertStatus(200);
        $heroSlides = $response->json('data.hero_slides');
        $this->assertIsArray($heroSlides);
        $this->assertCount(1, $heroSlides);
        $this->assertStringContainsString('settings/hero/desktop.jpg', $heroSlides[0]['image_desktop']);
        $this->assertStringContainsString('settings/hero/mobile.jpg', $heroSlides[0]['image_mobile']);
        $this->assertEquals('/cars', $heroSlides[0]['link']);
    }
}
