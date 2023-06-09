<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'contact';
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'user_id',
        'contact_id',
        'name_contact',
        'email_contact',
        'phone_contact',
        'comments_contact',
        'author',
        'status'
    ];
}
