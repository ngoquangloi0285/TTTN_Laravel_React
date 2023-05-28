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
        Schema::create('image_slide', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('slide_id');
            $table->string('title');
            $table->string('image');
            $table->string('author', 255);
            $table->tinyInteger('status')->lenght(1)->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('image_slide');
    }
};
