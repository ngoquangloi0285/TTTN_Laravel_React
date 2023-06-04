<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $products = $request->input('product');

        foreach ($products as $product) {
            $productId = $product['product_id'];
            $color = $product['color'];

            // Kiểm tra xem sản phẩm và màu sắc đã tồn tại trong chi tiết đơn hàng hay chưa
            $existingOrderDetail = OrderDetail::where('product_id', $productId)
                ->where('color', $color)
                ->first();
            // dd($existingOrderDetail);
            if ($existingOrderDetail) {
                // Sản phẩm và màu sắc đã tồn tại trong chi tiết đơn hàng
                // Thực hiện xử lý lỗi và trả về thông báo lỗi
                return response()->json(['message' => 'Có một hoặc nhiều sản phẩm đã tồn tại trong đơn hàng của bạn!'], 400);
            }
        }


        // Lưu dữ liệu đơn hàng
        $order = new Order();
        $order->user_id = auth()->user()->id; // Điền user_id tương ứng
        $order->total_amount = $request->input('total_amount');
        $order->orderer_name = $request->input('fullName');
        $order->email_order = $request->input('email');
        $order->phone_order = $request->input('phone');
        $order->address_order = $request->input('address');
        $order->city = $request->input('city');
        $order->zip_code = $request->input('code');
        $order->payment_method = $request->input('paymentMethod');
        $order->status = 0;

        $arrOrderDetail = [];

        if ($request->input('product')) {
            $order->save();
            $products = $request->input('product');
            foreach ($products as $product) {
                $existingOrderDetail = OrderDetail::where('order_id', $order->id)
                    ->where('product_id', $product['product_id'])
                    ->where('color', $product['color'])
                    ->first();

                if ($existingOrderDetail) {
                    // Sản phẩm và màu sắc đã tồn tại trong chi tiết đơn hàng
                    // Thực hiện xử lý lỗi và trả về thông báo lỗi
                    return response()->json(['message' => 'Sản phẩm và màu sắc đã tồn tại trong đơn hàng'], 400);
                }

                // Tiếp tục lưu chi tiết đơn hàng
                $orderDetail = new OrderDetail();
                $orderDetail->order_id = $order->id;
                $orderDetail->product_id = $product['product_id'];
                $orderDetail->product_name = $product['product_name'];
                $orderDetail->color = $product['color'];
                $orderDetail->image = $product['image'];
                $orderDetail->quantity = $product['quantity'];
                $orderDetail->price = $product['price'];
                $orderDetail->total_amount = $product['total_amount'];
                $orderDetail->status = $order->status;
                $orderDetail->save();
                $arrOrderDetail[] = $orderDetail;
            }
            // dd($arrOrderDetail);
            // Gửi email xác nhận đơn hàng thành công
            Mail::to($request->input('email'))->send(new OrderConfirmation($order, $arrOrderDetail));
            // Trả về kết quả thành công
            return response()->json(['message' => 'Chúng tôi đã gửi một thư đến mail của bạn'], 200);
        } else {
            // Trả về kết quả thất bại
            return response()->json(['message' => 'Đặt hàng không thành công'], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
