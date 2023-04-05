<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'name_product',
        'category_id',
        'brand_id',
        'slug',
        'summary',
        'cost',
        'price',
        'discount',
        'color',
        'inch',
        'detail',
        'author',
        'status'
    ];
    
    protected $dates = ['deleted_at'];

    public function images()
    {
        return $this->hasMany(ProductImages::class);
    }

    public function totalProduct()
    {
        return $this->hasOne(TotalProduct::class, 'product_count');
    }
}
