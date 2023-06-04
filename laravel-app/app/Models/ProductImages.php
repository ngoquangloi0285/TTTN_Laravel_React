<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class ProductImages extends Model
{
    use HasFactory;
    // use SoftDeletes;
    protected $table = 'product_images';
    // protected $dates = ['deleted_at'];
    
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
