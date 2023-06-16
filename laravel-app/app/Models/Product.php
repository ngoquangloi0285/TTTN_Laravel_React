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
        'product_id',
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
        'type',
        'total',
        'detail',
        'author',
        'status'
    ];

    protected $dates = ['deleted_at'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    public function brand()
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }
    public function images()
    {
        return $this->hasMany(ProductImages::class, 'product_id');
    }

    public function productImages()
    {
        return $this->hasMany(ProductImages::class);
    }

    public function options()
    {
        return $this->hasMany(Options::class);
    }
    public function countdown()
    {
        return $this->hasMany(CountDown::class);
    }
    public function totalProduct()
    {
        return $this->hasOne(TotalProduct::class, 'product_count');
    }
}
