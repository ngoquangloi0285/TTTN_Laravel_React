<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TotalProduct extends Model
{
    use HasFactory;
    protected $table = 'total_product';

    protected $fillable = ['product_count'];

    public function products()
    {
        return $this->belongsTo(Product::class, 'product_count');
    }
}
