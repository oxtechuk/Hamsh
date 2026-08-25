<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->index(['is_active', 'is_featured'], 'idx_cars_active_featured');
            $table->index(['is_active', 'cash_price'], 'idx_cars_active_price');
            $table->index(['is_active', 'year'], 'idx_cars_active_year');
            $table->index(['is_active', 'is_highlighted'], 'idx_cars_active_highlighted');
        });
    }

    public function down(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            $table->dropIndex('idx_cars_active_featured');
            $table->dropIndex('idx_cars_active_price');
            $table->dropIndex('idx_cars_active_year');
            $table->dropIndex('idx_cars_active_highlighted');
        });
    }
};
