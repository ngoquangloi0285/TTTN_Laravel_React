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
        Schema::create('order', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->decimal('total_amount', 10);
            $table->string('orderer_name');
            $table->string('email_order');
            $table->string('phone_order');
            $table->string('address_order');
            $table->string('city');
            $table->string('zip_code');
            $table->string('payment_method');
            $table->string('deliveryTime')->nullable();
            $table->tinyInteger('status')->unsigned();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order');
    }
};
