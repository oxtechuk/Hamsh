<?php

namespace Tests\Feature\Api\Store;

use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_footer_settings_with_car_popup_enabled(): void
    {
        $this->withoutExceptionHandling();
        config(['app.url' => 'http://localhost']);

        Setting::create([
            'key' => 'car_popup_enabled',
            'value' => '1',
        ]);

        $response = $this->getJson(route('store.api.settings.footer'));

        $response->assertStatus(200);
        $response->assertJsonPath('data.car_popup_enabled', true);
    }

    public function test_it_returns_false_for_car_popup_enabled_when_disabled(): void
    {
        $this->withoutExceptionHandling();
        config(['app.url' => 'http://localhost']);

        Setting::create([
            'key' => 'car_popup_enabled',
            'value' => '0',
        ]);

        $response = $this->getJson(route('store.api.settings.footer'));

        $response->assertStatus(200);
        $response->assertJsonPath('data.car_popup_enabled', false);
    }
}
