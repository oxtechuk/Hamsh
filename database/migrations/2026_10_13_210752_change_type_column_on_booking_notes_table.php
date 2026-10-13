<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE `booking_notes` MODIFY COLUMN `type` VARCHAR(50) NOT NULL DEFAULT 'note'");
        } else {
            Schema::table('booking_notes', function (Blueprint $table) {
                $table->string('type', 50)->default('note')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() === 'mysql') {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE `booking_notes` MODIFY COLUMN `type` ENUM('note', 'call', 'status_change') NOT NULL DEFAULT 'note'");
        } else {
            Schema::table('booking_notes', function (Blueprint $table) {
                $table->string('type', 50)->default('note')->change();
            });
        }
    }
};
