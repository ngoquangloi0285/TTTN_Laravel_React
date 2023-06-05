<!DOCTYPE html>
<html>

<head>
    <title>Xác nhận đơn hàng</title>
    <!-- Link to Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>

<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <h2 class="text-center">Đơn hàng {{ $order->orderer_name }} vừa đặt </h2>

                <h3>Xin chào, {{ $order->orderer_name }}</h3>

                <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được nhận và đang được xử lý.</p>

                <h3>Thông tin đơn hàng:</h3>
                <p>Địa chỉ giao hàng: {{ $order->address_order }}</p>
                <p>Số điện thoại: {{ $order->phone_order }}</p>
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sản phẩm</th>
                            <th>Màu sắc</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($arrOrderDetail as $orderDetail)
                            <tr>
                                <td>{{ $orderDetail->product_id }}</td>
                                <td>{{ $orderDetail->product_name }}</td>
                                <td>{{ $orderDetail->color }}</td>
                                <td>{{ $orderDetail->quantity }}</td>
                                <td>{{ number_format($orderDetail->price, 0, ',', '.') }}đ</td>
                                <td>{{ number_format($orderDetail->total_amount, 0, ',', '.') }}đ</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <p>
                    <strong>Tổng số tiền:</strong> {{ number_format($order->total_amount, 0, ',', '.') }}đ
                </p>

                <p>
                    <strong>
                        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận và tiếp tục xử lý đơn hàng
                        của
                        bạn.
                    </strong>
                </p>

                <p>Xin cảm ơn và chúc bạn một ngày tốt lành!</p>
                <p><strong>
                        <i>Nếu có thắc mắc xin vui lòng liên hệ với chúng tôi: 0352412318</i>
                    </strong></p>
            </div>
        </div>
    </div>
</body>

</html>
