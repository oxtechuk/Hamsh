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
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('traffic_source')->nullable()->index()->after('source');
            $table->string('traffic_medium')->nullable()->after('traffic_source');
            $table->string('campaign_name')->nullable()->index()->after('traffic_medium');
            $table->text('referrer_url')->nullable()->after('campaign_name');
            $table->string('landing_page')->nullable()->after('referrer_url');
            $table->string('click_id')->nullable()->after('landing_page');
            $table->string('ip_address', 45)->nullable()->index()->after('click_id');
            $table->text('user_agent')->nullable()->after('ip_address');
            $table->string('device_type', 20)->nullable()->after('user_agent');
            $table->unsignedTinyInteger('fraud_score')->default(0)->after('device_type');
            $table->boolean('is_suspicious')->default(false)->index()->after('fraud_score');
            $table->json('fraud_flags')->nullable()->after('is_suspicious');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'traffic_source',
                'traffic_medium',
                'campaign_name',
                'referrer_url',
                'landing_page',
                'click_id',
                'ip_address',
                'user_agent',
                'device_type',
                'fraud_score',
                'is_suspicious',
                'fraud_flags',
            ]);
        });
    }
};
