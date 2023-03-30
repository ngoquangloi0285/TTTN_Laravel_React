<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CountDown extends Model
{
    use HasFactory;
    protected $table = 'count_down';
    protected $fillable = [
        'product_id',
        'count_down_date',
    ];
}
