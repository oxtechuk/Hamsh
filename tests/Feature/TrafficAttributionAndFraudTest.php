<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Employee;
use App\Services\Tracking\AttributionResolverService;
use App\Services\Tracking\FraudDetectionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class TrafficAttributionAndFraudTest extends TestCase
{
    use RefreshDatabase;

    public function test_attribution_resolver_detects_snapchat(): void
    {
        $resolver = new AttributionResolverService;

        // Via UTM source
        $res = $resolver->resolve([
            'utm_source' => 'snapchat',
            'utm_campaign' => 'eid_deals',
        ]);
        $this->assertEquals('snapchat', $res['traffic_source']);
        $this->assertEquals('eid_deals', $res['campaign_name']);

        // Via click_id
        $res2 = $resolver->resolve([
            'sc_click_id' => 'snap_click_12345',
        ]);
        $this->assertEquals('snapchat', $res2['traffic_source']);
    }

    public function test_attribution_resolver_detects_instagram_and_facebook(): void
    {
        $resolver = new AttributionResolverService;

        // Instagram via referrer
        $res = $resolver->resolve([
            'referrer_url' => 'https://l.instagram.com/',
        ]);
        $this->assertEquals('instagram', $res['traffic_source']);

        // Facebook via UTM
        $resFb = $resolver->resolve([
            'utm_source' => 'facebook',
            'utm_medium' => 'cpc',
            'utm_campaign' => 'march_promo',
        ]);
        $this->assertEquals('facebook', $resFb['traffic_source']);
        $this->assertEquals('cpc', $resFb['traffic_medium']);
    }

    public function test_fraud_detector_catches_bot_honeypot_and_dummy_phones(): void
    {
        $fraudService = new FraudDetectionService;

        // Honeypot filled by bot
        $resultBot = $fraudService->inspect([
            'client_name' => 'John Bot',
            'client_phone' => '0512345678',
            'website_hp' => 'spam_bot_input',
        ]);
        $this->assertTrue($resultBot['is_suspicious']);
        $this->assertGreaterThanOrEqual(80, $resultBot['fraud_score']);

        // Dummy repeated digits
        $resultDummy = $fraudService->inspect([
            'client_name' => 'سالم علي',
            'client_phone' => '0500000000',
        ]);
        $this->assertTrue($resultDummy['is_suspicious']);

        // Clean normal client
        $resultClean = $fraudService->inspect([
            'client_name' => 'عبدالله المنصور',
            'client_phone' => '0567891234',
        ]);
        $this->assertFalse($resultClean['is_suspicious']);
        $this->assertEquals(0, $resultClean['fraud_score']);
    }

    public function test_store_booking_api_saves_attribution_and_clean_flags(): void
    {
        $payload = [
            'client_name' => 'خالد العمري',
            'client_phone' => '0551234567',
            'city' => 'الرياض',
            'brand_name' => 'تويوتا',
            'model_name' => 'كامري',
            'booking_type' => 'inquiry',
            'utm_source' => 'instagram',
            'utm_campaign' => 'ramadan_deals',
            'referrer_url' => 'https://l.instagram.com/',
            'landing_page' => '/cars/toyota-camry',
        ];

        $response = $this->postJson(route('store.api.booking.store'), $payload);
        $response->assertCreated();

        $this->assertDatabaseHas('bookings', [
            'client_name' => 'خالد العمري',
            'client_phone' => '0551234567',
            'traffic_source' => 'instagram',
            'campaign_name' => 'ramadan_deals',
            'is_suspicious' => false,
        ]);
    }

    public function test_crm_tracking_page_accessible_to_authorized_employee(): void
    {
        Permission::findOrCreate('manage-tracking', 'employee');

        $employee = Employee::create([
            'name' => 'موظف تجريبي',
            'username' => 'test_emp_1',
            'email' => 'emp1@hamsh.test',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $employee->givePermissionTo('manage-tracking');

        Booking::create([
            'client_name' => 'محمد السبيعي',
            'client_phone' => '0511223344',
            'traffic_source' => 'snapchat',
            'campaign_name' => 'snap_promo',
            'is_suspicious' => false,
            'status' => 'new',
            'booking_type' => 'inquiry',
        ]);

        $response = $this->actingAs($employee, 'employee')
            ->get(route('crm.tracking.index'));

        $response->assertOk();
        $response->assertSee('تتبع مصادر الطلبات وكشف الزور');
        $response->assertSee('سناب شات');
    }

    public function test_crm_can_toggle_suspicious_order(): void
    {
        Permission::findOrCreate('manage-tracking', 'employee');

        $employee = Employee::create([
            'name' => 'موظف تجريبي',
            'username' => 'test_emp_2',
            'email' => 'emp2@hamsh.test',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);
        $employee->givePermissionTo('manage-tracking');

        $booking = Booking::create([
            'client_name' => 'مستخدم للتجربة',
            'client_phone' => '0599887766',
            'traffic_source' => 'facebook',
            'is_suspicious' => false,
            'status' => 'new',
            'booking_type' => 'inquiry',
        ]);

        $response = $this->actingAs($employee, 'employee')
            ->patch(route('crm.tracking.toggle-suspicious', $booking));

        $response->assertRedirect();
        $booking->refresh();
        $this->assertTrue($booking->is_suspicious);
    }
}
