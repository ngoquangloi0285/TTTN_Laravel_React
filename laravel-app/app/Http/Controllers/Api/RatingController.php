<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Reviews;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function index()
    {
    }

    public function getRatings(Request $request)
    {
        $product_id = $request->query('product_id');
        $user_id = $request->query('user_id');

        // Lấy danh sách đánh giá dựa trên product_id và user_id,
        // và kết hợp thông tin user từ bảng User
        $ratings = Reviews::with('user')
            ->where('product_id', $product_id)
            ->where('user_id', $user_id)
            ->get();

        return response()->json($ratings);
    }

    public function create_review(Request $request)
    {
        // Lấy dữ liệu từ request
        $productId = $request->input('productId');
        $rating = $request->input('rating');
        $comment = $request->input('comment');
        $userId = $request->user()->id;

        // Kiểm tra sản phẩm có tồn tại không
        $product = Product::find($productId);
        if (!$product) {
            return response()->json(['status' => 'Sản phẩm không tồn tại'], 404);
        }

        // Kiểm tra xem người dùng đã đánh giá sản phẩm chưa
        $existingReview = Reviews::where('product_id', $productId)
            ->where('user_id', $userId)
            ->first();

        if ($existingReview) {
            return response()->json(['status' => 'Bạn đã đánh giá sản phẩm này'], 400);
        }

        // Tạo đánh giá trong cơ sở dữ liệu
        $review = Reviews::create([
            'product_id' => $productId,
            'rating' => $rating,
            'content' => $comment,
            'user_id' => $userId,
            'status' => '1'
            // Thêm các trường khác của đánh giá nếu cần
        ]);

        // Phản hồi với dữ liệu đánh giá đã được tạo
        return response()->json(['status' => 'Cảm ơn đánh giá của bạn'], 200);
    }
}
