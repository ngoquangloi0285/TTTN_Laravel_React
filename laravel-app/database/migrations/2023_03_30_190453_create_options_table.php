<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('options', function (Blueprint $table) {
            $table->unsignedInteger('id');
            $table->unsignedBigInteger('product_id');
            $table->string('color');
            $table->integer('inch');
            $table->string('author', 255);
            $table->tinyInteger('status')->lenght(1)->unsigned()->nullable();
            $table->timestamps();
        });

    }

    public function down()
    {
        Schema::dropIfExists('options');
    }
};
