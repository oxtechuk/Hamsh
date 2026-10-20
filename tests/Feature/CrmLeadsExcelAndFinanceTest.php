<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ContactSource;
use App\Models\Employee;
use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CrmLeadsExcelAndFinanceTest extends TestCase
{
    use RefreshDatabase;

    private Employee $employee;

    protected function setUp(): void
    {
        parent::setUp();

        $permission = Permission::firstOrCreate([
            'name' => 'manage-leads',
            'guard_name' => 'employee',
        ]);

        $this->employee = Employee::create([
            'name' => 'Test Manager',
            'username' => 'test_manager',
            'email' => 'manager@test.com',
            'password' => 'Password123!',
            'role' => 'admin',
            'is_active' => true,
        ]);

        $this->employee->givePermissionTo($permission);
    }

    public function test_leads_page_displays_salary_and_obligations_columns(): void
    {
        $source = ContactSource::create(['name' => 'واتساب', 'is_active' => true]);

        Lead::create([
            'client_name' => 'عبد الله المنصور',
            'client_phone' => '0512345678',
            'contact_source_id' => $source->id,
            'status' => 'new',
            'started_at' => now(),
            'salary' => 14500.00,
            'obligations' => 3200.00,
        ]);

        $response = $this->actingAs($this->employee, 'employee')
            ->get(route('crm.leads.index'));

        $response->assertStatus(200);
        $response->assertSee('تصدير إكسيل');
        $response->assertSee('استيراد إكسيل');
        $response->assertSee('الراتب');
        $response->assertSee('الالتزامات');
        $response->assertSee('14,500');
        $response->assertSee('3,200');
    }

    public function test_can_export_leads_to_excel_csv_with_salary_and_obligations(): void
    {
        $source = ContactSource::create(['name' => 'إعلان تويتر', 'is_active' => true]);

        Lead::create([
            'client_name' => 'خالد السالم',
            'client_phone' => '0598765432',
            'client_email' => 'khaled@example.com',
            'contact_source_id' => $source->id,
            'status' => 'interested',
            'started_at' => now(),
            'salary' => 18000.00,
            'obligations' => 4500.00,
            'status_details' => 'طلب تمويل فوري',
        ]);

        $response = $this->actingAs($this->employee, 'employee')
            ->get(route('crm.leads.export'));

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $content = $response->getContent();

        $this->assertStringContainsString('رقم العميل', $content);
        $this->assertStringContainsString('الراتب الشهري (ر.س)', $content);
        $this->assertStringContainsString('الالتزامات الشهرية (ر.س)', $content);
        $this->assertStringContainsString('خالد السالم', $content);
        $this->assertStringContainsString('18000.00', $content);
        $this->assertStringContainsString('4500.00', $content);
    }

    public function test_can_download_sample_excel_template(): void
    {
        $response = $this->actingAs($this->employee, 'employee')
            ->get(route('crm.leads.sample'));

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $content = $response->getContent();

        $this->assertStringContainsString('اسم العميل', $content);
        $this->assertStringContainsString('الراتب الشهري', $content);
        $this->assertStringContainsString('الالتزامات الشهرية', $content);
    }

    public function test_can_import_leads_from_csv_with_salary_and_obligations(): void
    {
        ContactSource::create(['name' => 'إنستغرام', 'is_active' => true]);

        $csvContent = "\xEF\xBB\xBF"
            ."اسم العميل,رقم الجوال,البريد الإلكتروني,المصدر,الراتب الشهري,الالتزامات الشهرية,الحالة,الملاحظات\r\n"
            .'فهد المطيري,0551122334,fahad@test.com,إنستغرام,16000,2000,جديد,طلب استفسار عن تمويل';

        $file = UploadedFile::fake()->createWithContent('leads.csv', $csvContent);

        $response = $this->actingAs($this->employee, 'employee')
            ->post(route('crm.leads.import'), [
                'file' => $file,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('leads', [
            'client_name' => 'فهد المطيري',
            'client_phone' => '0551122334',
            'client_email' => 'fahad@test.com',
            'salary' => 16000.00,
            'obligations' => 2000.00,
            'status' => 'new',
        ]);
    }

    public function test_can_create_lead_with_salary_and_obligations(): void
    {
        $source = ContactSource::create(['name' => 'اتصال هاتفي', 'is_active' => true]);

        $response = $this->actingAs($this->employee, 'employee')
            ->post(route('crm.leads.store'), [
                'client_name' => 'سلطان القحطاني',
                'client_phone' => '0567890123',
                'client_email' => 'sultan@test.com',
                'contact_source_id' => $source->id,
                'status' => 'new',
                'started_at' => now()->toDateString(),
                'salary' => 12500.50,
                'obligations' => 1500.00,
            ]);

        $response->assertRedirect(route('crm.leads.index'));

        $this->assertDatabaseHas('leads', [
            'client_name' => 'سلطان القحطاني',
            'salary' => 12500.50,
            'obligations' => 1500.00,
        ]);
    }

    public function test_can_update_lead_with_salary_and_obligations(): void
    {
        $source = ContactSource::create(['name' => 'المعرض', 'is_active' => true]);

        $lead = Lead::create([
            'client_name' => 'عمر الفاروق',
            'client_phone' => '0543210987',
            'contact_source_id' => $source->id,
            'status' => 'new',
            'started_at' => now(),
            'salary' => 9000.00,
            'obligations' => 1000.00,
        ]);

        $response = $this->actingAs($this->employee, 'employee')
            ->put(route('crm.leads.update', $lead), [
                'client_name' => 'عمر الفاروق المحدث',
                'client_phone' => '0543210987',
                'contact_source_id' => $source->id,
                'status' => 'contacted',
                'started_at' => now()->toDateString(),
                'salary' => 11000.00,
                'obligations' => 800.00,
            ]);

        $response->assertRedirect(route('crm.leads.show', $lead));

        $this->assertDatabaseHas('leads', [
            'id' => $lead->id,
            'client_name' => 'عمر الفاروق المحدث',
            'salary' => 11000.00,
            'obligations' => 800.00,
            'status' => 'contacted',
        ]);
    }

    public function test_leads_extracts_salary_and_obligations_from_status_details_when_columns_are_null(): void
    {
        $source = ContactSource::create(['name' => 'المتجر الإلكتروني', 'is_active' => true]);

        $lead = Lead::create([
            'client_name' => 'عميل قديم',
            'client_phone' => '0509988776',
            'contact_source_id' => $source->id,
            'status' => 'new',
            'started_at' => now(),
            'status_details' => 'طلب تمويل سيارة | الدخل الشهري: 13,500 ر.س | جهة العمل: خاص | طبيعة الالتزامات: التزام شخصي | قيمة الالتزامات: 2,750 ر.س',
            'salary' => null,
            'obligations' => null,
        ]);

        $this->assertEquals('13500', $lead->salary);
        $this->assertEquals('2750', $lead->obligations);

        $response = $this->actingAs($this->employee, 'employee')
            ->get(route('crm.leads.index'));

        $response->assertStatus(200);
        $response->assertSee('13,500');
        $response->assertSee('2,750');
    }

    public function test_leads_resolves_assigned_employee_from_related_booking_when_lead_assigned_to_is_null(): void
    {
        $source = ContactSource::create(['name' => 'المتجر', 'is_active' => true]);

        $salesRep = Employee::create([
            'name' => 'مندوب المبيعات سامي',
            'username' => 'sami_rep',
            'email' => 'sami@test.com',
            'password' => 'Password123!',
            'role' => 'sales',
            'is_active' => true,
        ]);

        $lead = Lead::create([
            'client_name' => 'عميل بحجز إلكتروني',
            'client_phone' => '0533344455',
            'contact_source_id' => $source->id,
            'status' => 'new',
            'started_at' => now(),
            'assigned_to' => null,
        ]);

        Booking::create([
            'client_name' => 'عميل بحجز إلكتروني',
            'client_phone' => '0533344455',
            'assigned_to' => $salesRep->id,
            'status' => 'new',
        ]);

        $this->assertEquals($salesRep->id, $lead->effective_employee?->id);

        $response = $this->actingAs($this->employee, 'employee')
            ->get(route('crm.leads.index'));

        $response->assertStatus(200);
        $response->assertSee('مندوب المبيعات سامي');
    }

    public function test_source_column_is_not_displayed_in_leads_table(): void
    {
        $response = $this->actingAs($this->employee, 'employee')
            ->get(route('crm.leads.index'));

        $response->assertStatus(200);
        // The table header shouldn't contain Source
        $response->assertDontSee('<th class="py-3 text-muted fw-bold" style="font-size:12px;">المصدر</th>', false);
    }
}
