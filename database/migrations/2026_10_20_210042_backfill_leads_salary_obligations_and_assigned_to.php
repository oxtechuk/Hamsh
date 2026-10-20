<?php

use App\Models\Lead;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Lead::with(['orders.employee'])->chunkById(100, function ($leads) {
            foreach ($leads as $lead) {
                $updates = [];

                if ($lead->getRawOriginal('salary') === null) {
                    $salary = $lead->resolveSalary();
                    if ($salary !== null) {
                        $updates['salary'] = $salary;
                    }
                }

                if ($lead->getRawOriginal('obligations') === null) {
                    $obs = $lead->resolveObligations();
                    if ($obs !== null) {
                        $updates['obligations'] = $obs;
                    }
                }

                if ($lead->assigned_to === null) {
                    $emp = $lead->effective_employee;
                    if ($emp) {
                        $updates['assigned_to'] = $emp->id;
                    }
                }

                if (! empty($updates)) {
                    $lead->updateQuietly($updates);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op
    }
};
