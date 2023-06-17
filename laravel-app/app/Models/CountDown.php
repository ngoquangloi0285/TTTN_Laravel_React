<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CountDown extends Model
{
    use HasFactory;
    // use SoftDeletes;

    protected $table = 'countdown';
    // protected $dates = ['deleted_at'];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
