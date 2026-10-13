<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class HomeFeaturesSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_features_can_be_viewed_and_saved_in_crm_settings(): void
    {
        $this->withoutExceptionHandling();
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

        // 1. Visit CRM settings general page
        $response = $this->actingAs($employee, 'employee')
            ->get(route('crm.settings.general'));

        $response->assertStatus(200);
        $response->assertSee('مميزات الشراء والخدمات');
        $response->assertSee('ضمان شامل');

        // 2. Submit new home features
        $updateResponse = $this->actingAs($employee, 'employee')
            ->post(route('crm.settings.update'), [
                'store_home_features_submitted' => '1',
                'show_home_features_section' => '1',
                'feature_icon' => ['bi-shield-check', 'bi-cash-coin'],
                'feature_title_ar' => ['ضمان ذهبي 5 سنوات', 'أقساط ميسرة'],
                'feature_title_en' => ['5-Year Golden Warranty', 'Easy Installments'],
                'feature_desc_ar' => ['ضمان شامل على المحرك وناقل الحركة', 'تمويل بدون تحويل راتب'],
                'feature_desc_en' => ['Comprehensive warranty on engine', 'Financing without salary transfer'],
            ]);

        $updateResponse->assertRedirect();
        $updateResponse->assertSessionHas('success');

        // 3. Verify database settings
        $featuresSetting = Setting::where('key', 'store_home_features')->first();
        $this->assertNotNull($featuresSetting);
        $this->assertCount(2, $featuresSetting->value);
        $this->assertEquals('ضمان ذهبي 5 سنوات', $featuresSetting->value[0]['title']['ar']);
        $this->assertEquals('5-Year Golden Warranty', $featuresSetting->value[0]['title']['en']);
        $this->assertEquals('bi-shield-check', $featuresSetting->value[0]['icon']);

        $showSetting = Setting::where('key', 'show_home_features_section')->first();
        $this->assertNotNull($showSetting);
        $this->assertEquals('1', $showSetting->value);

        // 4. Test Home API returns the updated features
        $apiResponse = $this->getJson(route('store.api.home'));
        $apiResponse->assertStatus(200);
        $apiResponse->assertJsonPath('data.show_home_features', true);
        $features = $apiResponse->json('data.hero.features');
        $this->assertCount(2, $features);
        $this->assertEquals('ضمان ذهبي 5 سنوات', $features[0]['title']);
    }
}
