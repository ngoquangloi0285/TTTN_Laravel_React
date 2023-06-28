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
    public function index(Request $request)
    {
        if ($request->has('id')) {
            // Lấy thông tin của một danh mục với id được truyền vào
            $id = $request->input('id');
            $category = Category::findOrFail($id);
            return response()->json($category);
        }

        // Lấy danh sách tất cả các danh mục
        $categories = Category::all();
        return response()->json($categories);
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
            // if ($request->hasFile('images')) {
            //     $files = $request->file('images');
            //     $paths = [];
            //     $count = count($files);

            //     foreach ($files as $key => $file) {
            //         $path = $category->name_category . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
            //         $image = Image::make($file);
            //         $image->resize(800, null, function ($constraint) {
            //             $constraint->aspectRatio();
            //             $constraint->upsize();
            //         });
            //         Storage::disk('public')->put('category/' . $path, (string) $image->encode());
            //         $paths[] = $path;

            //         // Lưu ảnh đầu tiên vào trường images của bảng products
            //         if ($key == 0) {
            //             $category->image = $path;
            //             $category->save();
            //         }
            //     }
            // }
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

            // // khi cập nhật xong thì tôi muốn cập nhật lại category của tất cả sản phẩm có liên quan đến category
            // $products = Product::where('category_id', '=', $id)->get();
            // foreach ($products as $product) {
            //     $product->category_id = $category->id; // Gán lại id của danh mục vừa cập nhật
            //     $product->save(); // Lưu lại thông tin sản phẩm
            // }

            // if ($request->hasFile('images')) {
            //     $files = $request->file('images');
            //     $paths = [];

            //     if ($category->image && Storage::disk('public')->exists('category/' . $category->image)) {
            //         Storage::disk('public')->delete('category/' . $category->image);
            //     } else {
            //         return response()->json([
            //             'status' => 404,
            //             'error' => 'Image not exists',
            //         ]);
            //     }

            //     foreach ($files as $key => $file) {
            //         $path = $request['nameCategory'] . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
            //         $image = Image::make($file);
            //         $image->resize(800, null, function ($constraint) {
            //             $constraint->aspectRatio();
            //             $constraint->upsize();
            //         });
            //         Storage::disk('public')->put('category/' . $path, (string) $image->encode());
            //         $paths[] = $path;

            //         // Lưu ảnh đầu tiên vào trường images của bảng products
            //         if ($key == 0) {
            //             $category->image = $path;
            //         }
            //     }
            // }

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

    public function destroyALL(Request $request)
    {
        $ids = $request['ids'];
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        foreach ($ids as $id) {
            $category = Category::find($id);

            // Kiểm tra xem có tồn tại Category không
            if (!$category) {
                $restoredUsers[] = ['id' => $id, 'message' => 'Category not found.'];
                continue;
            }

            // Kiểm tra xem có sản phẩm nào có category_id bằng $category->id không
            $products = Product::where('category_id', '=', $category->id)->get();
            if ($products->isEmpty()) {
                $category->deleted_at = $now;
                $category->status = 0;
                $category->save();
                continue;
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
        }

        return response()->json(['message' => 'Categories and their products have been softly deleted.']);
    }


    public function trash()
    {
        $categories = Category::onlyTrashed()->get();
        return $categories;
    }

    public function restore($id)
    {
        $category = Category::withTrashed()->find($id);
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        // Kiểm tra xem có tồn tại Category không
        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        // Kiểm tra xem có sản phẩm nào có category_id bằng $category->id không
        $products = Product::where('category_id', '=', $category->id)->withTrashed()->get();

        if ($products->isEmpty()) {
            $category->status = 1;
            $category->restore();
            return response()->json(['message' => 'Category has been softly deleted.']);
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

        $category->status = 1;
        $category->restore();

        return response()->json(['message' => 'Category and its products have been softly restore.']);
    }

    public function restoreAll(Request $request)
    {
        $ids = $request['ids'];

        foreach ($ids as $id) {
            $category = Category::withTrashed()->find($id);

            // Kiểm tra xem có tồn tại Category không
            if (!$category) {
                $restoredUsers[] = ['id' => $id, 'message' => 'Category not found.'];
                continue;
            }

            // Kiểm tra xem có sản phẩm nào có category_id bằng $category->id không
            $products = Product::where('category_id', '=', $category->id)->withTrashed()->get();

            if ($products->isEmpty()) {
                $category->status = 1;
                $category->restore();
            } else {
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

                $category->status = 1;
                $category->restore();
            }
        }

        return response()->json(['message' => 'Categories and their products have been softly restored.']);
    }

    public function remove($id)
    {
        $category = Category::withTrashed()->findOrFail($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found.'], 404);
        }

        if (!$category->trashed()) {
            return response()->json(['message' => 'Category is not deleted.']);
        }

        // // Xóa ảnh đại diện của category nếu có
        // if ($category->image && Storage::disk('public')->exists('category/' . $category->image)) {
        //     Storage::disk('public')->delete('category/' . $category->image);
        // }
        // Kiểm tra xem có sản phẩm nào có category_id bằng $category->id không
        $products = Product::where('category_id', '=', $category->id)->withTrashed()->get();
        // Xóa vĩnh viễn category nếu không có sản phẩm liên quan
        if ($products->isEmpty()) {
            $category->forceDelete();
            return response()->json(['message' => 'Category has been permanently deleted.']);
        }

        if ($products) {
            foreach ($products as $product) {
                $options = Options::where('product_id', $product->id)->get();
                if (!$options->isEmpty()) {
                    Options::where('product_id', $product->id)->delete();
                }

                $countDowns = CountDown::where('product_id', $product->id)->get();
                if (!$countDowns->isEmpty()) {
                    CountDown::where('product_id', $product->id)->delete();
                }

                $product_images = ProductImages::where('product_id', $product->id)->get();

                if ($product_images->isNotEmpty()) {
                    foreach ($product_images as $image) {
                        if ($image->image && Storage::disk('public')->exists('product/' . $image->image)) {
                            Storage::disk('public')->delete('product/' . $image->image);
                            $image->delete();
                        }
                    }
                }

                if ($product->image && Storage::disk('public')->exists('product/' . $product->image)) {
                    Storage::disk('public')->delete('product/' . $product->image);
                }

                $product->forceDelete();
            }
        }

        $category->forceDelete();
        return response()->json(['message' => 'Category and associated products have been permanently deleted.']);
    }


    public function removeALL(Request $request)
    {
        $ids = $request['ids'];

        foreach ($ids as $id) {

            $category = Category::withTrashed()->findOrFail($id);

            if (!$category) {
                $restoredUsers[] = ['id' => $id, 'message' => 'Category not found.'];
                continue;
            }

            if (!$category->trashed()) {
                return response()->json(['message' => 'Category is not deleted.']);
            }

            // Xóa ảnh đại diện của category nếu có
            // if ($category->image && Storage::disk('public')->exists('category/' . $category->image)) {
            //     Storage::disk('public')->delete('category/' . $category->image);
            // }
            // Kiểm tra xem có sản phẩm nào có category_id bằng $category->id không
            $products = Product::where('category_id', '=', $category->id)->withTrashed()->get();
            // Xóa vĩnh viễn category nếu không có sản phẩm liên quan
            if ($products->isEmpty()) {
                $category->forceDelete();
                return response()->json(['message' => 'Category has been permanently deleted.']);
            }

            if ($products) {
                foreach ($products as $product) {
                    $options = Options::where('product_id', $product->id)->get();
                    if (!$options->isEmpty()) {
                        Options::where('product_id', $product->id)->delete();
                    }

                    $countDowns = CountDown::where('product_id', $product->id)->get();
                    if (!$countDowns->isEmpty()) {
                        CountDown::where('product_id', $product->id)->delete();
                    }

                    $product_images = ProductImages::where('product_id', $product->id)->get();

                    if ($product_images->isNotEmpty()) {
                        foreach ($product_images as $image) {
                            if ($image->image && Storage::disk('public')->exists('product/' . $image->image)) {
                                Storage::disk('public')->delete('product/' . $image->image);
                                $image->delete();
                            }
                        }
                    }

                    if ($product->image && Storage::disk('public')->exists('product/' . $product->image)) {
                        Storage::disk('public')->delete('product/' . $product->image);
                    }

                    $product->forceDelete();
                }
            }

            $category->forceDelete();
        }

        return response()->json(['message' => 'Categories and associated products have been permanently deleted.']);
    }
}
