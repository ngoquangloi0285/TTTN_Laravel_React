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
        Schema::create('products', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('brand_id');
            $table->string('name_product', 255);
            $table->string('image', 255)->nullable();
            $table->string('slug')->unique();
            $table->string('summary', 255);
            $table->text('detail', 255);
            $table->decimal('cost', 10);
            $table->decimal('price', 10);
            $table->decimal('discount', 3)->nullable();
            $table->string('color', 255);
            $table->string('inch', 255);
            $table->integer('total')->unsigned()->nullable();
            $table->string('type', 255)->nullable();
            $table->string('author', 255);
            $table->tinyInteger('status')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function ($table) {
            Schema::drop('products');
        });
    }
};
