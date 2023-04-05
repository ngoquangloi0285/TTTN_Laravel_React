<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CountDown;
use App\Models\Options;
use App\Models\Product;
use App\Models\ProductImages;
use App\Models\TotalProduct;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Storage;

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

    public function createProduct(Request $request)
    {
        $product = Product::create([
            'name_product' => $request['nameProduct'],
            'slug' => Str::slug($request['nameProduct'], '-'),
            'category_id' => $request['category'],
            'brand_id' => $request['brand'],
            'summary' => $request['summary'],
            'cost' => $request['costProduct'],
            'price' => $request['priceSale'],
            'discount' => $request['discount'],
            'color' => $request['color'],
            'inch' => $request['inch'],
            'detail' => $request['detail'],
            // Lưu tên của tài khoản đang đăng nhập vào trường author của sản phẩm
            'author' => $request->user()->name,
            'status' => $request['status']
        ]);

        // $product->save();

        if ($request->hasFile('images')) {
            $files = $request->file('images');
            $paths = [];
            $count = count($files);

            foreach ($files as $key => $file) {
                $path = $request['nameProduct'] . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                $image = Image::make($file);
                $image->resize(800, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
                Storage::disk('public')->put('images/' . $path, (string) $image->encode());
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
        } else {
            return response()->json([
                'error' => 'Created Error! huhu',
                'product' => $product
            ]);
        }

        // Trả về thông tin sản phẩm đã tạo và thông báo thành công
        return response()->json([
            'success' => 'Created Successfully!, hihi',
            'error' => 'Created Error! huhu',
            'product' => $product
        ]);
    }


    public function softDelete($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['error' => 'Product not found.'], 404);
        }

        $product->deleted_at = Carbon::now('Asia/Ho_Chi_Minh');
        $product->save();

        return response()->json(['message' => 'Product has been softly deleted.']);
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
