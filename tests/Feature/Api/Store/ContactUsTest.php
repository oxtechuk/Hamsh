<?php

namespace Tests\Feature\Api\Store;

use App\Models\ContactSource;
use App\Models\Employee;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactUsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_submits_contact_us_form_successfully(): void
    {
        // Enable auto assignment in settings
        Setting::create([
            'key' => 'auto_assign_bookings',
            'value' => '1',
        ]);

        // Create an active sales representative
        $salesRep = Employee::create([
            'name' => 'Sales Representative',
            'username' => 'sales_rep_1',
            'email' => 'sales1@example.com',
            'password' => 'password123',
            'phone' => '0500000001',
            'role' => 'sales',
            'is_active' => true,
        ]);

        $payload = [
            'name' => 'John Doe',
            'phone' => '1234567890',
            'email' => 'john@example.com',
            'message' => 'I would like to inquire about a car.',
        ];

        $response = $this->postJson(route('store.api.contact.store'), $payload);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'lead_id',
            ],
            'meta',
        ]);

        $this->assertDatabaseHas('contact_sources', [
            'name' => 'Contact Us Form',
        ]);

        $source = ContactSource::where('name', 'Contact Us Form')->first();

        $this->assertDatabaseHas('leads', [
            'client_name' => 'John Doe',
            'client_phone' => '1234567890',
            'client_email' => 'john@example.com',
            'status_details' => 'I would like to inquire about a car.',
            'contact_source_id' => $source->id,
            'status' => 'new',
            'assigned_to' => $salesRep->id, // Asserts it is auto-assigned
        ]);
    }
}
