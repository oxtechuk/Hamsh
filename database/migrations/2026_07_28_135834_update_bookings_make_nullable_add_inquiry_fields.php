<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->foreignId('car_id')->nullable()->change();
            $table->unsignedBigInteger('down_payment')->nullable()->change();
            $table->unsignedTinyInteger('duration_years')->nullable()->change();
            $table->decimal('interest_rate', 5, 2)->nullable()->change();
            $table->unsignedBigInteger('monthly_installment')->nullable()->change();
            $table->unsignedBigInteger('total_price')->nullable()->change();

            $table->string('city')->nullable()->after('client_email');
            $table->string('brand_name')->nullable()->after('city');
            $table->string('model_name')->nullable()->after('brand_name');
            $table->string('model_year')->nullable()->after('model_name');
            $table->string('preferred_color')->nullable()->after('model_year');
            $table->string('salary_range')->nullable()->after('preferred_color');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'city', 'brand_name', 'model_name',
                'model_year', 'preferred_color', 'salary_range',
            ]);

            $table->foreignId('car_id')->constrained('cars')->onDelete('cascade')->change();
            $table->unsignedBigInteger('down_payment')->change();
            $table->unsignedTinyInteger('duration_years')->change();
            $table->decimal('interest_rate', 5, 2)->default(0)->change();
            $table->unsignedBigInteger('monthly_installment')->change();
            $table->unsignedBigInteger('total_price')->change();
        });
    }
};
