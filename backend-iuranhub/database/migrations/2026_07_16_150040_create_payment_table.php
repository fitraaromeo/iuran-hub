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
        Schema::create('payment', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('house_id');
            $table->uuid('residence_id');
            $table->decimal('amount', 12, 2);
            $table->integer('month');
            $table->integer('year');
            $table->string('type');
            $table->enum('status', ['unpaid', 'paid'])->default('unpaid');
            $table->timestamp('payment_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('house_id')->references('id')->on('house')->onDelete('cascade');
            $table->foreign('residence_id')->references('id')->on('residence')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment');
    }
};
