<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\OrderRemovalJob;
use App\Mail\OrderCancel;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;
use App\Mail\OrderDelivered;
use App\Models\User;
use Carbon\Carbon;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->input('filter');

        $query = Order::query();

        switch ($status) {
            case 'order_waiting_confirmation':
                $query->where('status', 0)->orderBy('created_at', 'desc')
                    ->latest()
                    ->get(); // Đơn hàng đang đợi được xác nhận
                break;
            case 'order_confirmation':
                $query->where('status', 1)->orderBy('created_at', 'desc')
                    ->latest()
                    ->get(); // Đơn hàng đã được xác nhận và đang đợi đóng hàng
                break;
            case 'order_waiting_packing':
                $query->where('status', '>', 0)->where('status', '<', 2)
                    ->latest()
                    ->orderBy('created_at', 'desc')->get(); // Đơn hàng đã được vận chuyển và đang đợi giao
                break;
            case 'order_packed':
                $query->where('status', 2)->orderBy('created_at', 'desc')
                    ->latest()
                    ->get(); // Đơn hàng đã được đóng hàng và đang đợi vận chuyển
                break;
            case 'order_waiting_shipped':
                $query->where('status', '>', 1)->where('status', '<', 3)
                    ->latest()
                    ->orderBy('created_at', 'desc')->get(); // Đơn hàng đang đợi giao
                break;
            case 'order_shipping':
                $query->where('status', 3)->orderBy('created_at', 'desc')
                    ->latest()
                    ->get(); // Đơn hàng đã giao
                break;
            case 'order_delivered':
                $query->where('status', 4)->orderBy('created_at', 'desc')
                    ->latest()
                    ->get(); // Đơn hàng đã giao
                break;
            default:
                // Không lọc theo trạng thái
                break;
        }

        $orders = $query->orderBy('created_at', 'desc')->latest()->get();

        return response()->json($orders);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $products = $request->input('product');
        $user = auth()->user();
        $user_id = $user->id;

        foreach ($products as $product) {
            $productId = $product['product_id'];
            $color = $product['color'];

            // Kiểm tra xem sản phẩm và màu sắc đã tồn tại trong chi tiết đơn hàng hay chưa
            $existingOrderDetail = OrderDetail::where('product_id', $productId)
                ->where('color', $color)
                ->where('user_id', $user_id)
                ->first();

            if ($existingOrderDetail) {
                // Sản phẩm và màu sắc đã tồn tại trong chi tiết đơn hàng của người dùng hiện tại
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
        $order->note = $request->input('note');
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
                $orderDetail->user_id = auth()->user()->id; // Điền user_id tương ứng
                $orderDetail->order_id = $order->id;
                $orderDetail->product_id = $product['product_id'];
                $orderDetail->product_name = $product['product_name'];
                $orderDetail->slug_product = $product['slug_product'];
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

    public function your_order(Request $request, $id)
    {
        $userOrders = Order::where('user_id', $id)->get();
        $orderData = [];

        foreach ($userOrders as $order) {
            $orderDetails = OrderDetail::where('order_id', $order->id)->latest()
                ->get();
            $orderData[] = [
                'order' => $order,
                'orderDetails' => $orderDetails,
            ];
        }

        return response()->json([
            'orders' => $orderData,
        ]);
    }

    public function edit($id)
    {
        $order = Order::find($id);
        if ($order) {
            $orderDetails = OrderDetail::where('order_id', $order->id)
                ->get();
            $order->orderDetails = $orderDetails;
        }
        return response()->json($order);
    }



    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Kiểm tra xem ID có tồn tại trong cơ sở dữ liệu hay không
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => 'Không tìm thấy đơn hàng'], 404);
        }

        // Cập nhật trạng thái đơn hàng
        $status = $request->input('status');
        $deliveryTime = $request->input('deliveryTime');
        $noteAdmin = $request->input('note_admin');

        $order->status = $status;
        $order->deliveryTime = $deliveryTime;

        // Kiểm tra nếu trạng thái đơn hàng là 4, thực hiện xóa tạm
        if ($status == 4) {
            $now = Carbon::now('Asia/Ho_Chi_Minh');
            $orderDetails = OrderDetail::where('order_id', $id)->get();

            foreach ($orderDetails as $orderDetail) {
                $orderDetail->deleted_at = $now;
                $orderDetail->status = $status;
                $orderDetail->save();
            }

            $order->deleted_at = $now;
            $order->note_admin = 'Giao hàng thành công';

            if ($order->save()) {
                // Gửi email
                $userEmail = $order->email_order;
                Mail::to($userEmail)->send(new OrderDelivered($order));

                return response()->json([
                    'success' => 'Đơn hàng đã giao hàng thành công',
                    'message' => 'Đơn hàng đã lưu lại lịch sử',
                ], 200);
            } else {
                return response()->json(['error' => 'Đã xảy ra lỗi'], 500);
            }
        }

        if (auth()->user()->roles === 'admin') {
            $order->note_admin = 'Đơn hàng được hủy bởi Quản trị viên' . ' ; Mã hủy: ' . auth()->user()->id;
        } else {
            $order->note_admin = 'Đơn hàng được hủy bởi ' . auth()->user()->name;
        }

        $order->note_admin = $noteAdmin;
        $orderDetails = OrderDetail::where('order_id', $id)->get();
        if ($order->save()) {
            foreach ($orderDetails as $orderDetail) {
                $orderDetail->status = $status;
                $orderDetail->save();
            }
        }

        return response()->json(['success' => 'Cập nhật thành công'], 200);
    }


    public function destroy(Request $request, $id)
    {
        $order = Order::find($id);
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        if (!$order) {
            return response()->json(['error' => 'Không tìm thấy đơn hàng'], 404);
        }

        // Xóa tạm orderDetail
        $orderDetails = OrderDetail::where('order_id', $id)->get();
        foreach ($orderDetails as $orderDetail) {
            $orderDetail->deleted_at = $now;
            $orderDetail->status = 0;
            $orderDetail->save();
        }

        // Đánh dấu đơn hàng là đã bị xóa tạm thời
        $order->deleted_at = $now;
        if (auth()->user()->roles === 'admin') {
            $order->note_admin = 'Đơn hàng được hủy bởi Quản trị viên' . ' ; Mã hủy: ' . auth()->user()->id;
        } else {
            $order->note_admin = 'Đơn hàng được hủy bởi ' . auth()->user()->name;
        }
        // $order->note_admin = 'Đơn hàng được hủy bởi, ' . $request->user()->name . ' ID user: ' . $request->user()->id;
        $order->status = 0;
        if ($order->save()) {
            // Gửi email
            $userEmail = $order->email_order;
            Mail::to($userEmail)->send(new OrderCancel($order, $orderDetails));
            return response()->json([
                'success' => 'Đơn hàng đã bị hủy, vui lòng kiểm tra Email của bạn',
                'message' => 'Đơn hàng đã bị hủy! Đã lưu lại lịch sử',
            ], 200);
        } else {
            return response()->json(['error' => 'Đã xảy ra lỗi khi hủy đơn hàng'], 500);
        }
    }

    public function history($id)
    {
        $userOrders = Order::onlyTrashed()
            ->where('user_id', $id)
            ->latest()
            ->get();

        $orderData = [];

        foreach ($userOrders as $order) {
            $deletedOrder = $order;
            $orderDetails = $order->orderDetails()->onlyTrashed()->get();

            $orderData[] = [
                'order' => $deletedOrder,
                'orderDetails' => $orderDetails,
            ];
        }

        return response()->json([
            'orders' => $orderData,
        ]);
    }

    public function historyTrash($id)
    {
        $order = Order::withTrashed()->find($id);
        $orderData = [];
        if ($order) {
            $orderDetails = OrderDetail::where('order_id', $order->id)
                ->withTrashed()
                ->get();

            $orderData = [
                'order' => $order,
                'orderDetails' => $orderDetails,
            ];
        }

        return response()->json($orderData);
    }


    public function trash(Request $request)
    {
        $status = $request->input('filter');

        $query = Order::onlyTrashed()->latest();

        switch ($status) {
            case 'order_waiting_confirmation':
                $query->where('status', 0);
                break;
            case 'order_confirmation':
                $query->where('status', 1);
                break;
            case 'order_waiting_packing':
                $query->where('status', '>', 0)->where('status', '<', 2);
                break;
            case 'order_packed':
                $query->where('status', 2);
                break;
            case 'order_waiting_shipped':
                $query->where('status', '>', 1)->where('status', '<', 3);
                break;
            case 'order_shipping':
                $query->where('status', 3);
                break;
            case 'order_delivered':
                $query->where('status', 4);
                break;
            default:
                // Không lọc theo trạng thái
                break;
        }

        $orders = $query->get();

        return response()->json($orders);
    }


    public function revenue(Request $request)
    {
        $month = $request->input('month');
        $year = $request->input('year');

        $revenue = Order::onlyTrashed()
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->where('status', 4)
            ->sum('total_amount');

        return response()->json([
            'revenue' => $revenue,
        ]);
    }

    public function completedOrders(Request $request)
    {
        $month = $request->input('month');
        $year = $request->input('year');

        $completedOrdersCount = Order::onlyTrashed()
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->where('status', 4)
            ->count();

        return response()->json([
            'completed_orders' => $completedOrdersCount,
        ]);
    }

    public function canceledOrders(Request $request)
    {
        $month = $request->input('month');
        $year = $request->input('year');

        $canceledOrdersCount = Order::onlyTrashed()
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->where('status', '<', 4)
            ->count();

        return response()->json([
            'canceled_orders' => $canceledOrdersCount,
        ]);
    }

    public function countUser(Request $request)
    {
        $month = $request->input('month');
        $year = $request->input('year');

        $userCount = User::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count();

        return response()->json([
            'user_count' => $userCount,
        ]);
    }

    public function remove($id)
    {
    }
}
