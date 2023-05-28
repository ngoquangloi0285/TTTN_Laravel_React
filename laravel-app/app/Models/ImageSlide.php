<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImageSlide extends Model
{
    use HasFactory;
    protected $table = 'image_slide';
    protected $fillable = [
        'product_id',
        'title',
        'slug_product',
        'author',
        'status'
    ];
}
