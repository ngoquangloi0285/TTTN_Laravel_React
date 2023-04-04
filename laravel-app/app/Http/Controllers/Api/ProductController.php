<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CountDown;
use App\Models\Options;
use App\Models\Product;
use App\Models\ProductImages;
use App\Models\TotalProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = Product::query();

        if ($search) {
            $query->where('name_product', 'like', "%$search%");
        }

        $products = $query->get();

        return response()->json($products);
    }


    public function store(Request $request)
    {
        $product = new Product();
        $product->name_product = $request['nameProduct'];
        $product->slug = Str::slug($product->name_product, '-');
        $product->category_id = $request['category'];
        $product->brand_id = $request['brand'];
        $product->summary = $request['summary'];
        $product->cost = $request['costProduct'];
        $product->price = $request['priceSale'];
        $product->discount = $request['discount'];
        $product->color = $request['color'];
        $product->inch = $request['inch'];
        $product->detail = $request['detail'];

        // Lưu tên của tài khoản đang đăng nhập vào trường author của sản phẩm
        $product->author = $request->user()->name;
        $product->status = $request['status'];

        $product->save();

        // Lưu trữ hình ảnh sản phẩm
        if ($request->hasFile('images')) {
            $files = $request->file('images');
            $paths = [];
            $count = count($files);

            foreach ($files as $key => $file) {
                $path = $product->name_product . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                $file->move('images/', $path);
                $paths[] = $path;

                // Lưu ảnh đầu tiên vào trường images của bảng products
                if ($key == 0) {
                    $product->images = $path;
                    $product->save();
                } else {
                    // Lưu các ảnh còn lại vào bảng product_images
                    $productImage = new ProductImages();
                    $productImage->product_id = $product->id;
                    $productImage->image = $path;
                    $productImage->author = $request->user()->name;
                    $productImage->save();
                }
            }
            // Lưu thông tin options của sản phẩm vào bảng Options
            $options = new Options();
            $options->product_id = $product->id;
            $options->color = $product->color;
            $options->inch = $product->inch;
            $options->author = $request->user()->name;
            $options->save();

            // Lưu thông tin countdown của sản phẩm vào bảng CountDown (nếu có request)
            if ($request->has('start_time') && $request->has('end_time')) {
                $countdown = new CountDown();
                $countdown->product_id = $product->id;
                $countdown->start_time = $request['start_time'];
                $countdown->end_time = $request['end_time'];
                $countdown->author = $request->user()->name;
                $countdown->status = $request['status'];
                $countdown->save();
            }
        }

        // Trả về thông tin sản phẩm đã tạo và thông báo thành công
        return response()->json([
            'success' => 'Created Successfully!, hihi',
            'error' => 'Created Error! huhu',
            'product' => $product
        ]);
    }



    public function updateTotalProductCount()
    {
        // Lấy ra bản ghi đầu tiên trong bảng total_product
        $totalProduct = TotalProduct::first();

        // Đếm tổng số sản phẩm trong bảng product
        $productCount = Product::count();

        // Gán giá trị vào trường product_count của bản ghi total_product
        $totalProduct->product_count = $productCount;
        $totalProduct->save();

        return response()->json("Update total product successfully");
    }
}
