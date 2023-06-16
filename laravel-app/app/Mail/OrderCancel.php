<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderCancel extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $arrOrderDetail;

    public function __construct(Order $order, $arrOrderDetail)
    {
        $this->order = $order;
        $this->arrOrderDetail = $arrOrderDetail;
    }

    public function build()
    {
        return $this->from('nqlit2109@gmail.com', 'E-Mart')
            ->markdown('emails.order.cancel')
            ->subject('Đơn hàng đã bị hủy')
            ->with([
                'order' => $this->order,
                'arrOrderDetail' => $this->arrOrderDetail
            ]);
    }
}
