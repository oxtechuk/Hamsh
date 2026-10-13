<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Brand;
use App\Models\CalculatorBank;
use App\Models\Car;
use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CrmBookingManagementTest extends TestCase
{
    use RefreshDatabase;

    private Employee $employee;

    protected function setUp(): void
    {
        parent::setUp();

        $permission = Permission::firstOrCreate([
            'name' => 'manage-bookings',
            'guard_name' => 'employee',
        ]);

        $this->employee = Employee::create([
            'name' => 'Booking Manager',
            'username' => 'booking_mgr',
            'email' => 'bmgr@test.com',
            'password' => 'Password123!',
            'role' => 'admin',
            'is_active' => true,
        ]);

        $this->employee->givePermissionTo($permission);
    }

    public function test_bookings_index_displays_with_pagination_and_query_string(): void
    {
        CalculatorBank::create([
            'name' => 'البنك الأهلي',
            'annual_rate' => 3.5,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        for ($i = 1; $i <= 25; $i++) {
            Booking::create([
                'client_name' => "عميل تجريبي {$i}",
                'client_phone' => "05000000{$i}",
                'status' => 'new',
                'booking_type' => 'finance',
                'total_price' => 100000,
                'down_payment' => 10000,
                'duration_years' => 5,
            ]);
        }

        $response = $this->actingAs($this->employee, 'employee')
            ->get(route('crm.bookings.index', ['status' => 'new', 'page' => 2]));

        $response->assertStatus(200);
        $response->assertSee('سجل الطلبات');
        $response->assertSee('تصدير إكسيل');
        $response->assertSee('استيراد إكسيل');
        $response->assertSee('bookings-table');
        $response->assertSee('width:18%');
        $response->assertSee('width:10%');
        $response->assertSee('page=1');
        $response->assertSee('status=new');
    }

    public function test_financial_details_calculate_based_on_calculator_default_bank(): void
    {
        $defaultBank = CalculatorBank::create([
            'name' => 'بنك الراجحي الافتراضي',
            'annual_rate' => 4.25,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $brand = Brand::create([
            'name' => 'تويوتا',
            'slug' => 'toyota-test',
        ]);

        $car = Car::create([
            'brand_id' => $brand->id,
            'name' => 'كامري 2026',
            'slug' => 'camry-2026-test',
            'model' => 'Camry',
            'year' => 2026,
            'cash_price' => 120000,
            'min_down_payment' => 10000,
            'min_installment' => 1500,
            'is_active' => true,
        ]);

        $booking = Booking::create([
            'client_name' => 'سعد عبد الله',
            'client_phone' => '0512345678',
            'car_id' => $car->id,
            'booking_type' => 'finance',
            'total_price' => 120000,
            'down_payment' => 20000,
            'duration_years' => 5,
        ]);

        $finance = $booking->getFinanceDetails();

        $this->assertEquals('بنك الراجحي الافتراضي', $finance['bank_name']);
        $this->assertEquals(4.25, $finance['annual_rate']);
        $this->assertEquals(120000, $finance['cash_price']);
        $this->assertEquals(20000, $finance['down_payment']);
        $this->assertEquals(100000, $finance['principal']);
        $this->assertGreaterThan(0, $finance['monthly_installment']);
        $this->assertGreaterThan(0, $finance['total_interest']);
        $this->assertGreaterThan(120000, $finance['total_financed']);

        // Test Show view renders financial details properly without dummy 0.035 commission
        $response = $this->actingAs($this->employee, 'employee')
            ->get(route('crm.bookings.show', $booking));

        $response->assertStatus(200);
        $response->assertSee('التفاصيل المالية والتمويل');
        $response->assertSee('بنك الراجحي الافتراضي');
        $response->assertSee('4.25%');
        $response->assertDontSee('125'); // No old dummy delivery fee
    }

    public function test_bookings_export_generates_valid_excel_csv(): void
    {
        CalculatorBank::create([
            'name' => 'البنك الأهلي',
            'annual_rate' => 3.5,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Booking::create([
            'client_name' => 'عبد الرحمن المطيري',
            'client_phone' => '0599999999',
            'client_email' => 'mutairi@example.com',
            'city' => 'الرياض',
            'booking_type' => 'finance',
            'total_price' => 80000,
            'down_payment' => 10000,
            'duration_years' => 3,
        ]);

        $response = $this->actingAs($this->employee, 'employee')
            ->get(route('crm.bookings.export'));

        $response->assertStatus(200);
        $this->assertStringContainsString('text/csv', $response->headers->get('Content-Type'));
        $content = $response->getContent();

        $this->assertStringStartsWith("\xEF\xBB\xBF", $content);
        $this->assertStringContainsString('رقم الطلب', $content);
        $this->assertStringContainsString('اسم العميل', $content);
        $this->assertStringContainsString('رقم الجوال', $content);
        $this->assertStringContainsString('عبد الرحمن المطيري', $content);
        $this->assertStringContainsString('0599999999', $content);
    }

    public function test_bookings_sample_excel_template_download(): void
    {
        $response = $this->actingAs($this->employee, 'employee')
            ->get(route('crm.bookings.sample-excel'));

        $response->assertStatus(200);
        $content = $response->getContent();
        $this->assertStringContainsString('اسم العميل', $content);
        $this->assertStringContainsString('محمد أحمد علي', $content);
    }

    public function test_bookings_import_from_csv(): void
    {
        CalculatorBank::create([
            'name' => 'البنك الافتراضي',
            'annual_rate' => 3.5,
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $csvContent = "\xEF\xBB\xBF";
        $csvContent .= "اسم العميل,رقم الجوال,البريد الإلكتروني,المدينة,نوع الطلب,سعر السيارة,الدفعة الأولى,مدة التمويل,الملاحظات\n";
        $csvContent .= "\"يوسف إبراهيم\",\"0541112233\",\"yousef@test.com\",\"جدة\",\"تمويل\",\"90000\",\"10000\",\"5\",\"عميل قادم من الإكسيل\"\n";

        $file = UploadedFile::fake()->createWithContent('import_test.csv', $csvContent);

        $response = $this->actingAs($this->employee, 'employee')
            ->post(route('crm.bookings.import'), [
                'file' => $file,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('bookings', [
            'client_name' => 'يوسف إبراهيم',
            'client_phone' => '0541112233',
            'city' => 'جدة',
            'source' => 'Excel Import',
        ]);

        $imported = Booking::where('client_phone', '0541112233')->first();
        $this->assertNotNull($imported);
        $this->assertGreaterThan(0, $imported->monthly_installment);
        $this->assertEquals(3.5, $imported->interest_rate);
    }

    public function test_booking_assignment_creates_note_with_assignment_type(): void
    {
        $assignee = Employee::create([
            'name' => 'موسى الحقوي',
            'username' => 'musa_test',
            'email' => 'musa@test.com',
            'password' => 'Password123!',
            'role' => 'sales',
            'is_active' => true,
        ]);

        $booking = Booking::create([
            'client_name' => 'عميل توزيع تجريبي',
            'client_phone' => '0555551234',
            'booking_type' => 'finance',
            'status' => 'new',
        ]);

        $response = $this->actingAs($this->employee, 'employee')
            ->patch(route('crm.bookings.assign', $booking), [
                'employee_id' => $assignee->id,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'assigned_to' => $assignee->id,
        ]);

        $this->assertDatabaseHas('booking_notes', [
            'booking_id' => $booking->id,
            'type' => 'assignment',
        ]);

        $activity = $booking->fresh()->getLastActivity();
        $this->assertEquals('توزيع الطلب', $activity['action']);
    }
}
