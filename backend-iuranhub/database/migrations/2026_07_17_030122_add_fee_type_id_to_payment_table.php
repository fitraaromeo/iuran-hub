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
        Schema::table('payment', function (Blueprint $table) {
            $table->uuid('fee_type_id')->after('residence_id');
            
            $table->foreign('fee_type_id')->references('id')->on('fee_type')->onDelete('cascade');
            $table->dropColumn('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment', function (Blueprint $table) {
            $table->dropForeign(['fee_type_id']);
            $table->dropColumn('fee_type_id');
            $table->string('type')->after('residence_id');
        });
    }
};
