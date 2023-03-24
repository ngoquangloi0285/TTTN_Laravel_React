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
            $table->bigIncrements('id');
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('brand_id');
            $table->unsignedBigInteger('user_id');
            $table->string('name_product', 255);
            $table->string('images', 255)->nullable();
            $table->string('slug')->unique();
            $table->string('summary', 255);
            $table->text('detail', 255);
            $table->decimal('price', 8, 2);
            $table->decimal('cost', 8, 2);
            $table->decimal('discount', 8, 2);
            $table->string('color', 255);
            $table->string('inch', 255);
            $table->integer('total')->unsigned();
            $table->string('type', 255)->nullable();
            $table->string('author', 255);
            $table->tinyInteger('status')->lenght(1)->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
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
