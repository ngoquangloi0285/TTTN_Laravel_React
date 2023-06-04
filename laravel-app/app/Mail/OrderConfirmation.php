<?php

namespace App\Mail;

use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $arrOrderDetail;

    public function __construct(Order $order, array $arrOrderDetail)
    {
        $this->order = $order;
        $this->arrOrderDetail = $arrOrderDetail;
    }

    public function build()
    {
        return $this->from('nqlit2109@gmail.com', 'E-Mart')
            ->view('emails.orderConfirmation')
            ->subject('Đơn hàng bạn vừa đặt')
            ->with([
                'order' => $this->order,
                'arrOrderDetail' => $this->arrOrderDetail
            ]);
    }
}
