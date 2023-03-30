<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('options', function (Blueprint $table) {
            $table->id();
            $table->string('color');
            $table->integer('inch');
            $table->tinyInteger('status')->lenght(1)->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Thêm khoá ngoại trỏ tới bảng products
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('option_id')->nullable();
            $table->foreign('option_id')->references('id')->on('options');
        });
    }

    public function down()
    {
        // Xóa khoá ngoại trỏ tới bảng products
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['option_id']);
            $table->dropColumn('option_id');
        });

        Schema::dropIfExists('options');
    }
};
