<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'menu';
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name',
        'link',
        'position',
        'author',
        'status'
    ];
}
