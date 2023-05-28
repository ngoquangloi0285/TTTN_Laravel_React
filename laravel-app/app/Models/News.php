<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class News extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $dates = ['deleted_at'];
    protected $fillable = [
        'news_id',
        'title_news',
        'slug',
        'type',
        'description',
        'content_news',
        'category_id',
        'author',
        'status'
    ];

    public function images()
    {
        return $this->hasMany(NewsImages::class);
    }

    public function newsImages()
    {
        return $this->hasMany(NewsImages::class);
    }
}
