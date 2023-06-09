<!DOCTYPE html>
<html>
<head>
    <title>Đơn hàng đã giao</title>
</head>
<body>
    <h1>Thông báo: Đơn hàng đã giao</h1>
    <p>Xin chào {{ $order->orderer_name }},</p>

    <p>Chúng tôi xin thông báo rằng đơn hàng của bạn đã được giao thành công.</p>
    <p>Thông tin đơn hàng:</p>

    <ul>
        <li>Mã đơn hàng: {{ $order->id }}</li>
        <li>Tổng cộng: {{ number_format($order->total_amount) }} VND</li>
        <!-- Thêm các thông tin khác về đơn hàng mà bạn muốn hiển thị -->
    </ul>

    <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi.</p>
    <p>Chúng tôi hy vọng được phục vụ bạn trong tương lai.</p>

    <p>Trân trọng,</p>
    <p>Đội ngũ dịch vụ khách hàng</p>
</body>
</html>
