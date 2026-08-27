<?php

namespace Tests\Feature;

use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CrmPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_manager_login_page_renders_successfully(): void
    {
        $response = $this->get('/manager-login');

        $response->assertStatus(200);
        $response->assertSee('تسجيل الدخول');
    }

    public function test_crm_leads_page_renders_with_dynamic_stats(): void
    {
        $permission = Permission::create([
            'name' => 'manage-leads',
            'guard_name' => 'employee',
        ]);

        $employee = Employee::create([
            'name' => 'Admin Manager',
            'username' => 'admin_test',
            'email' => 'admin@test.com',
            'password' => 'Password123!',
            'role' => 'admin',
            'is_active' => true,
        ]);

        $employee->givePermissionTo($permission);

        $response = $this->actingAs($employee, 'employee')
            ->get(route('crm.leads.index'));

        $response->assertStatus(200);
        $response->assertSee('إجمالي العملاء');
        $response->assertSee('العملاء الجدد');
        $response->assertSee('قيد المتابعة والتفاوض');
        $response->assertSee('تم التحويل بنجاح');
    }

    public function test_crm_dashboard_page_renders_with_hamesh_branding(): void
    {
        $permission = Permission::create([
            'name' => 'manage-dashboard',
            'guard_name' => 'employee',
        ]);

        $employee = Employee::create([
            'name' => 'General Manager',
            'username' => 'gm_test',
            'email' => 'gm@test.com',
            'password' => 'Password123!',
            'role' => 'admin',
            'is_active' => true,
        ]);

        $employee->givePermissionTo($permission);

        $response = $this->actingAs($employee, 'employee')
            ->get(route('crm.dashboard'));

        $response->assertStatus(200);
        $response->assertSee('لوحة الإدارة والمتابعة');
    }
}
