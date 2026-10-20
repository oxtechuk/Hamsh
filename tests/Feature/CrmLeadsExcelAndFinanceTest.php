<?php

namespace Tests\Feature;

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
}
