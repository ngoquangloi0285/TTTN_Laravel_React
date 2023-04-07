<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Helper;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CountDown;
use App\Models\Options;
use App\Models\ProductImages;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Product::query();

        $products = $query->get();

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        /** Generate id */
        $helper = new Helper();
        // $id = $helper->Id(new Product, 'id', 10, 'nql');
        $id = str_pad(random_int(0, 9999999999), 10, '0', STR_PAD_LEFT);
        $product = Product::create([
            'product_id' => $id,
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
            'author' => $request->user()->name,
            'status' => $request['status']
        ]);


        // $product->save();

        if ($request->hasFile('images')) {
            $files = $request->file('images');
            $paths = [];
            $count = count($files);

            foreach ($files as $key => $file) {
                $path = $product->name_product . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
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
                    $productImage->status = $request['status'];
                    $productImage->save();
                }
            }

            // Lưu thông tin options của sản phẩm vào bảng Options
            $options = new Options();
            $options->product_id = $product->id;
            $options->color = $product->color;
            $options->inch = $product->inch;
            $options->author = $request->user()->name;
            $options->status = $request['status'];
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

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return $product;
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Destroy
     */

    public function destroy(Product $product)
    {
        $now = Carbon::now('Asia/Ho_Chi_Minh');
        $product->deleted_at = $now;
        $product->status = 0;

        if ($product->save()) {
            $option = Options::where('product_id', $product->id)->update(['status' => 0]);
            $countdown = CountDown::where('product_id', $product->id)->update(['status' => 0]);
            $images = ProductImages::where('product_id', $product->id)->update(['status' => 0]);

            return response()->json(['message' => 'Product has been softly deleted.']);
        } else {
            return response()->json(['message' => 'Failed to delete product.']);
        }
    }
    /**
     * Remove
     */
    public function remove(Product $product)
    {
        $product->forceDelete();
        return response()->json(['message' => 'Xóa vĩnh viễn thành công']);
    }
    /**
     * Trash
     */
    public function trash()
    {
        return $products = Product::onlyTrashed()->paginate(25);
    }
    /**
     * Restore
     */
    public function restore($id)
    {
        return  Product::withTrashed()->find($id)->restore();
    }
}
