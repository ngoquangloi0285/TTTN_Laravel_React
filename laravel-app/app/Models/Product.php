<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;


    public function images()
    {
        return $this->hasMany(ProductImages::class);
    }

    public function totalProduct()
    {
        return $this->hasOne(TotalProduct::class, 'product_count');
    }
}
