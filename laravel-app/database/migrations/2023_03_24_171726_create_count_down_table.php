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
        Schema::create('count_down', function (Blueprint $table) {
            $table->id();
            $table->timestamp('target_date');
            $table->tinyInteger('status')->lenght(1)->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
        // Thêm khoá ngoại trỏ tới bảng products
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('count_down_id')->nullable();
            $table->foreign('count_down_id')->references('id')->on('count_down');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('count_down');
    }
};
