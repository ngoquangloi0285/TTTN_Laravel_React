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
        Schema::create('category', function (Blueprint $table) {
            $table->id();
            $table->string('category_id', 255);
            $table->string('name_category', 255);
            $table->string('slug', 255)->unique();
            $table->integer('parent_category')->unsigned()->nullable();
            $table->string('type', 255)->nullable();
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
        Schema::dropIfExists('category');
    }
};
