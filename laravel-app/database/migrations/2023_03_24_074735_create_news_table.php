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
        Schema::create('news', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('news_id');
            $table->string('title_news', 255);
            $table->string('slug', 255)->unique();
            $table->string('content_news', 255);
            $table->string('images', 255)->nullable();
            $table->string('type', 255)->nullable();
            $table->unsignedBigInteger('category_id')->nullable();;
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
        Schema::dropIfExists('news');
    }
};
