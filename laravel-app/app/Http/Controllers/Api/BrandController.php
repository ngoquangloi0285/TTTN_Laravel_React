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
                    Storage::disk('public')->put('images/' . $path, (string) $image->encode());
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        //
    }

    public function trash()
    {
        $categories = Brand::onlyTrashed()->get();

        if ($categories->isEmpty()) {
            return response()->json(['message' => 'No deleted categories found.'], 200);
        }
        return $categories;
    }


    public function restore($id)
    {
        $category = Brand::withTrashed()->findOrFail($id);
        $products = $category->products()->withTrashed()->get(); // sử dụng phương thức products()
        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        if (!$category->trashed()) {
            return response()->json(['message' => 'Category is not deleted.']);
        }

        $categoryRestored = false;
        $productsRestored = false;

        // Khôi phục category nếu không có sản phẩm liên quan
        if ($products->isEmpty()) {
            $category->status = 1;
            $category->restore();
            $categoryRestored = true;
        }

        // Khôi phục cả category và sản phẩm liên quan
        foreach ($products as $product) {
            if ($product->trashed()) {
                $product->status = 1;
                $product->restore();
                $product->options()->update(['status' => 1]);
                $product->countdown()->update(['status' => 1]);
                $product->images()->update(['status' => 1]);
                $productsRestored = true;
            }
        }

        if ($categoryRestored && !$productsRestored) {
            return response()->json([
                'message' => 'Category has been restored.',
                'category' => $category->fresh()
            ]);
        } elseif (!$categoryRestored && $productsRestored) {
            return response()->json([
                'message' => 'Category and associated products have been restored.',
                'category' => $category->fresh()
            ]);
        } else {
            return response()->json([
                'message' => 'Category and associated products do not exist or have been already restored.'
            ]);
        }
    }
}
