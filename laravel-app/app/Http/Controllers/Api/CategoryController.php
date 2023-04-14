<?php

namespace App\Http\Controllers\Api;

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


class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $category = Category::get();
        return $category;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $category = Category::where([
            ['name_category', $request['nameCategory']],
            ['slug', Str::slug($request['nameCategory'], '-')]
        ])->first();
        if ($category) {
            return response()->json([
                'error' => 'Category with this name already exists, please choose another name.',
                'product' => $category
            ], 500);
        } else {
            $id = random_int(0, 9999999999);
            $category_id = str_pad($id, 10, '0', STR_PAD_LEFT);
            if (strlen($category_id) > 10) {
                $category_id = substr($category_id, 0, 10);
            }
            $category = Category::create([
                'category_id' => $category_id,
                'name_category' => $request['nameCategory'],
                'slug' => Str::slug($request['nameCategory'], '-'),
                'parent_category' => $request['parent_category'],
                'author' => $request->user()->name,
                'status' => $request['status']
            ]);
            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $paths = [];
                $count = count($files);

                foreach ($files as $key => $file) {
                    $path = $category->name_category . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                    $image = Image::make($file);
                    $image->resize(800, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    Storage::disk('public')->put('images/' . $path, (string) $image->encode());
                    $paths[] = $path;

                    // Lưu ảnh đầu tiên vào trường images của bảng products
                    if ($key == 0) {
                        $category->image = $path;
                        $category->save();
                    }
                }
            }
            // Trả về thông tin sản phẩm đã tạo và thông báo thành công
            return response()->json([
                'status' => 'Created Successfully!, hihi',
                'product' => $category
            ], 200);
        }
        // Trả về thông tin sản phẩm đã tạo và thông báo thành công
        return response()->json([
            'status' => 'Created Not Successfully!, hihi',
            'product' => $category
        ], 500);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return $category;
    }

    /**
     * Update the specified resource in storage.
     */
    public function edit($id)
    {
        $data = Category::find($id);

        if ($data) {
            return response()->json([
                'status' => 200,
                'message' => 'Edit category ' . $data->id . ' ready!',
                'category' => $data,
            ],);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Category Found',
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json([
                'status' => 404,
                'error' => 'Category not exists',
            ]);
        } else {
            $category->name_category = $request['nameCategory'];
            $category->slug = Str::slug($request['nameCategory'], '-');
            $category->parent_category = $request['parent_category'];
            $category->author = $request->user()->name;
            $category->status = $request['status'];

            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $paths = [];

                if ($category->image && Storage::disk('public')->exists('images/' . $category->image)) {
                    Storage::disk('public')->delete('images/' . $category->image);
                } else {
                    return response()->json([
                        'status' => 404,
                        'error' => 'Image not exists',
                    ]);
                }

                foreach ($files as $key => $file) {
                    $path = $request['nameCategory'] . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                    $image = Image::make($file);
                    $image->resize(800, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    Storage::disk('public')->put('images/' . $path, (string) $image->encode());
                    $paths[] = $path;

                    // Lưu ảnh đầu tiên vào trường images của bảng products
                    if ($key == 0) {
                        $category->image = $path;
                    }
                }
            }

            // Lưu thay đổi vào CSDL
            $category->save();

            // Trả về thông tin sản phẩm đã tạo và thông báo thành công
            return response()->json([
                'status' => 'Updated Successfully!',
                'category' => $category
            ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category = Category::find($id);
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        // Kiểm tra xem có tồn tại Category không
        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        // Kiểm tra xem có sản phẩm nào có category_id bằng $category->id không
        $products = Product::where('category_id', '=', $category->id)->get();
        if ($products->isEmpty()) {
            $category->deleted_at = $now;
            $category->status = 0;
            $category->save();
            return response()->json(['message' => 'Category has been softly deleted.']);
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

        $category->deleted_at = $now;
        $category->status = 0;
        $category->save();

        return response()->json(['message' => 'Category and its products have been softly deleted.']);
    }



    public function trash()
    {
        $categories = Category::onlyTrashed()->get();

        if ($categories->isEmpty()) {
            return response()->json(['message' => 'No deleted categories found.'], 200);
        }
        return $categories;
    }


    public function restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
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

    public function remove($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $products = $category->products()->withTrashed()->get();

        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        if (!$category->trashed()) {
            return response()->json(['message' => 'Category is not deleted.']);
        }

        // Xóa ảnh đại diện của category nếu có
        if ($category->image && Storage::disk('public')->exists('images/' . $category->image)) {
            Storage::disk('public')->delete('images/' . $category->image);
        }

        // Xóa vĩnh viễn category nếu không có sản phẩm liên quan
        if ($products->isEmpty()) {
            $category->forceDelete();
            return response()->json(['message' => 'Category has been permanently deleted.']);
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

        $category->forceDelete();
        return response()->json(['message' => 'Category and associated products have been permanently deleted.']);
    }
}
