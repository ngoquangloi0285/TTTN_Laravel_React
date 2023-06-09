<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;

class OrderDelivered extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->from('nqlit2109@gmail.com', 'E-Mart')
            ->markdown('emails.order.delivered')
            ->subject('Đơn hàng đã được giao thành công')
            ->with([
                'order' => $this->order,
            ]);
    }
}
