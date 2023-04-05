<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CountDown extends Model
{
    use HasFactory;
    protected $table = 'countdown';
    use SoftDeletes;

}
