<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'order';
    protected $fillable = [
        'user_id',
        'total_amount',
        'orderer_name',
        'email_order',
        'phone_order',
        'address_order',
        'city',
        'zip_code',
        'note',
        'note_admin',
        'payment_method',
        'deliveryTime',
        'status'
    ];

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }
    // Định nghĩa quan hệ với mô hình Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
