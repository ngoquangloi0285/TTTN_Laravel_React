<?php

namespace App\Http\Controllers\Api;

use App\Models\Brand;
use App\Models\Category;
use App\Http\Controllers\Controller;
use App\Models\CountDown;
use App\Models\Options;
use App\Models\Product;
use App\Models\ProductImages;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('id')) {
            $id = $request('id');
            $brand = Brand::findOrFail($id);
            return $brand;
        } else {
            $brand = Brand::get();
            return $brand;
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $brand = Brand::where([
            ['name', $request['nameBrand']],
            ['slug', Str::slug($request['nameBrand'], '-')]
        ])->first();
        if ($brand) {
            return response()->json([
                'error' => 'Brand with this name already exists, please choose another name.',
                'product' => $brand
            ], 500);
        } else {
            $id = random_int(0, 9999999999);
            $brand_id = str_pad($id, 10, '0', STR_PAD_LEFT);
            if (strlen($brand_id) > 10) {
                $brand_id = substr($brand_id, 0, 10);
            }
            $brand = Brand::create([
                'brand_id' => $brand_id,
                'name' => $request['nameBrand'],
                'slug' => Str::slug($request['nameBrand'], '-'),
                'parent_brand' => $request['parent_brand'],
                'author' => $request->user()->name,
                'status' => $request['status']
            ]);
            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $paths = [];
                $count = count($files);

                foreach ($files as $key => $file) {
                    $path = $brand->name . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                    $image = Image::make($file);
                    $image->resize(800, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    Storage::disk('public')->put('brand/' . $path, (string) $image->encode());
                    $paths[] = $path;

                    // Lưu ảnh đầu tiên vào trường images của bảng products
                    if ($key == 0) {
                        $brand->image = $path;
                        $brand->save();
                    }
                }
            }
            // Trả về thông tin sản phẩm đã tạo và thông báo thành công
            return response()->json([
                'status' => 'Created Successfully!, hihi',
                'product' => $brand
            ], 200);
        }
        // Trả về thông tin sản phẩm đã tạo và thông báo thành công
        return response()->json([
            'status' => 'Created Not Successfully!, hihi',
            'product' => $brand
        ], 500);
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        return $brand;
    }

    /**
     * Update the specified resource in storage.
     */

    public function edit($id)
    {
        $data = Brand::find($id);

        if ($data) {
            return response()->json([
                'status' => 200,
                'message' => 'Edit Brand ' . $data->id . ' ready!',
                'category' => $data,
            ],);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Brand Found',
            ]);
        }
    }

    public function update(Request $request, Brand $brand)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $brand = Brand::find($id);
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        // Kiểm tra xem có tồn tại Category không
        if (!$brand) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        // Kiểm tra xem có sản phẩm nào có category_id bằng $category->id không
        $products = Product::where('brand_id', '=', $brand->category_id)->get();
        if ($products->isEmpty()) {
            $brand->deleted_at = $now;
            $brand->status = 0;
            $brand->save();
            return response()->json(['message' => 'Brand has been softly deleted.']);
        }

        // Nếu tìm thấy sản phẩm có category_id thì thực hiện xóa tạm
        foreach ($products as $product) {
            $product->deleted_at = $now;
            $product->status = 0;

            $options = Options::where('product_id', $product->id)->get();
            if (!$options->isEmpty()) {
                Options::where('product_id', $product->id)->update(['status' => 0]);
            }

            $countDowns = CountDown::where('product_id', $product->id)->get();
            if (!$countDowns->isEmpty()) {
                CountDown::where('product_id', $product->id)->update(['status' => 0]);
            }

            $productImages = ProductImages::where('product_id', $product->id)->get();
            if (!$productImages->isEmpty()) {
                ProductImages::where('product_id', $product->id)->update(['status' => 0]);
            }

            $product->save();
        }

        $brand->deleted_at = $now;
        $brand->status = 0;
        $brand->save();

        return response()->json(['message' => 'Brand and its products have been softly deleted.']);
    }

    public function trash()
    {
        $brand = Brand::onlyTrashed()->get();
        return $brand;
    }


    public function restore($id)
    {
        $brand = Brand::withTrashed()->find($id);
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        // Kiểm tra xem có tồn tại Category không
        if (!$brand) {
            return response()->json(['message' => 'Brand not found.'], 404);
        }

        // Kiểm tra xem có sản phẩm nào có category_id bằng $category->id không
        $products = Product::where('category_id', '=', $brand->brand_id)->withTrashed()->get();

        if ($products->isEmpty()) {
            $brand->status = 1;
            $brand->restore();
            return response()->json(['message' => 'Brand has been softly deleted.']);
        }

        if ($products) {
            foreach ($products as $product) {
                $product->status = 1;

                $options = Options::where('product_id', $product->id)->get();
                if (!$options->isEmpty()) {
                    Options::where('product_id', $product->id)->update(['status' => 1]);
                }

                $countDowns = CountDown::where('product_id', $product->id)->get();
                if (!$countDowns->isEmpty()) {
                    CountDown::where('product_id', $product->id)->update(['status' => 1]);
                }

                $productImages = ProductImages::where('product_id', $product->id)->get();
                if (!$productImages->isEmpty()) {
                    ProductImages::where('product_id', $product->id)->update(['status' => 1]);
                }

                $product->restore();
            }
        }

        $brand->status = 1;
        $brand->restore();

        return response()->json(['message' => 'Brand and its products have been softly restore.']);
    }
    public function remove($id)
    {
        $brand = Brand::withTrashed()->findOrFail($id);
        $products = $brand->products()->withTrashed()->get();

        if (!$brand) {
            return response()->json(['message' => 'Brand not found.'], 404);
        }

        if (!$brand->trashed()) {
            return response()->json(['message' => 'Brand is not deleted.']);
        }

        // Xóa ảnh đại diện của category nếu có
        if ($brand->image && Storage::disk('public')->exists('brand/' . $brand->image)) {
            Storage::disk('public')->delete('brand/' . $brand->image);
        }

        // Xóa vĩnh viễn category nếu không có sản phẩm liên quan
        if ($products->isEmpty()) {
            $brand->forceDelete();
            return response()->json(['message' => 'Brand has been permanently deleted.']);
        }

        // Xóa vĩnh viễn cả category và sản phẩm liên quan
        foreach ($products as $product) {
            if ($product->trashed()) {
                $product->options()->delete();
                $product->countdown()->delete();
                $product->images()->delete();
                $product->forceDelete();
            }
        }

        $brand->forceDelete();
        return response()->json(['message' => 'Brand and associated products have been permanently deleted.']);
    }
}
