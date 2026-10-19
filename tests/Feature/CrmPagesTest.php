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

    public function test_employee_with_only_bookings_permission_is_redirected_to_bookings(): void
    {
        $permission = Permission::create([
            'name' => 'manage-bookings',
            'guard_name' => 'employee',
        ]);

        $employee = Employee::create([
            'name' => 'Sales Agent',
            'username' => 'sales_test',
            'email' => 'sales@test.com',
            'password' => 'Password123!',
            'role' => 'employee',
            'is_active' => true,
        ]);

        $employee->givePermissionTo($permission);

        // When accessing /crm/dashboard, redirected to /crm/bookings
        $response = $this->actingAs($employee, 'employee')
            ->get(route('crm.dashboard'));

        $response->assertRedirect(route('crm.bookings.index'));

        // When accessing /crm root, redirected to /crm/bookings
        $rootResponse = $this->actingAs($employee, 'employee')
            ->get('/crm');

        $rootResponse->assertRedirect(route('crm.bookings.index'));
    }

    public function test_employee_without_reports_permission_does_not_see_income_stat(): void
    {
        $dashboardPerm = Permission::create([
            'name' => 'manage-dashboard',
            'guard_name' => 'employee',
        ]);

        $employee = Employee::create([
            'name' => 'Supervisor',
            'username' => 'supervisor_test',
            'email' => 'sup@test.com',
            'password' => 'Password123!',
            'role' => 'employee',
            'is_active' => true,
        ]);

        $employee->givePermissionTo($dashboardPerm);

        $response = $this->actingAs($employee, 'employee')
            ->get(route('crm.dashboard'));

        $response->assertStatus(200);
        $response->assertSee('لوحة الإدارة والمتابعة');
        $response->assertDontSee('إجمالي الدخل');
    }
}
