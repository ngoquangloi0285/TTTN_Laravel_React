<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CountDown;
use App\Models\Options;
use App\Models\ProductImages;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index_admin()
    {
        $query = Product::query();

        $products = $query->get();

        return response()->json($products);
    }

    public function index_homepage(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);

        $query = Product::query();

        $total = $query->count();

        $products = $query->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        return response()->json([
            'products' => $products,
            'pagination' => [
                'total' => $total,
                'perPage' => $perPage,
                'currentPage' => $page,
                'lastPage' => ceil($total / $perPage),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product = Product::where([
            ['name_product', $request['nameProduct']],
            ['slug', Str::slug($request['nameProduct'], '-')]
        ])->first();

        if ($product) {
            return response()->json([
                'error' => 'Product with this name already exists, please choose another name.',
                'product' => $product
            ], 500);
        } else {
            /** Generate id */
            $id = random_int(0, 9999999999);
            $product_id = str_pad($id, 10, '0', STR_PAD_LEFT);
            if (strlen($product_id) > 10) {
                $product_id = substr($product_id, 0, 10);
            }
            $product = Product::create([
                'product_id' => $product_id,
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
                'total' => $request['total'],
                'detail' => $request['detail'],
                'author' => $request->user()->name,
                'status' => $request['status']
            ]);

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
                    Storage::disk('public')->put('product/' . $path, (string) $image->encode());
                    $paths[] = $path;

                    // Lưu ảnh đầu tiên vào trường images của bảng products
                    if ($key == 0) {
                        $product->image = $path;
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
                    if ($countdown->save()) {
                    }
                }
            }

            // Trả về thông tin sản phẩm đã tạo và thông báo thành công
            return response()->json([
                'status' => 'Created Successfully!, hihi',
                'product' => $product
            ], 200);
        }
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
    public function edit($id)
    {
        $data = Product::find($id);

        if ($data) {
            return response()->json([
                'status' => 200,
                'product' => $data,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No Product Found',
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'status' => 404,
                'error' => 'Product not exists',
            ]);
        } else {
            $product->name_product = $request['nameProduct'];
            $product->slug = Str::slug($request['nameProduct'], '-');
            $product->category_id = $request['category'];
            $product->brand_id = $request['brand'];
            $product->summary = $request['summary'];
            $product->cost = $request['costProduct'];
            $product->price = $request['priceSale'];
            $product->discount = $request['discount'];
            $product->color = $request['color'];
            $product->inch = $request['inch'];
            $product->detail = $request['detail'];
            $product->author = $request->user()->name;
            $product->status = $request['status'];
            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $paths = [];
                if ($product->image && Storage::disk('public')->exists('product/' . $product->image)) {
                    Storage::disk('public')->delete('product/' . $product->image);
                }
                foreach ($files as $key => $file) {
                    $path = $request['nameProduct'] . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                    $image = Image::make($file);
                    $image->resize(800, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    Storage::disk('public')->put('product/' . $path, (string) $image->encode());
                    $paths[] = $path;

                    // Lưu ảnh đầu tiên vào trường images của bảng products
                    if ($key == 0) {
                        $product->image = $path;
                        $product->save();
                    } else {
                        $productImage = ProductImages::where('product_id', '=', $product->id)->first();

                        if ($productImage) {
                            // Nếu có bản ghi ảnh cho sản phẩm này trong bảng product_images
                            if ($productImage->image && Storage::disk('public')->exists('product/' . $productImage->image)) {
                                // Nếu có ảnh trong bảng và tồn tại file ảnh trên disk, thực hiện xóa ảnh cũ
                                Storage::disk('public')->delete('product/' . $productImage->image);
                            }
                            // Cập nhật thông tin ảnh mới vào bảng
                            $productImage->image = $path;
                            $productImage->author = $request->user()->name;
                            $productImage->status = $request['status'];
                            $productImage->save();
                        } else {
                            // Nếu không có bản ghi ảnh cho sản phẩm này trong bảng product_images, thêm bản ghi mới
                            $productImage = new ProductImages;
                            $productImage->product_id = $product->id;
                            $productImage->image = $path;
                            $productImage->author = $request->user()->name;
                            $productImage->status = $request['status'];
                            $productImage->save();
                        }
                    }
                }
                // Lưu thông tin options của sản phẩm vào bảng Options
                $options = Options::where('product_id', '=', $product->id)->first();
                $options->color = $request['color'];
                $options->inch = $request['inch'];
                $options->author = $request->user()->name;
                $options->status = $request['status'];
                $options->save();

                // Lưu thông tin countdown của sản phẩm vào bảng CountDown (nếu có request)
                if ($request->has('start_time') && $request->has('end_time')) {
                    $countdown = CountDown::where('product_id', '=', $product->id)->first();
                    $countdown->start_time = $request['start_time'];
                    $countdown->end_time = $request['end_time'];
                    $countdown->author = $request->user()->name;
                    $countdown->status = $request['status'];
                    $countdown->save();
                    // Thành công
                } else {
                    return response()->json([
                        'status' => 'Error',
                        'message' => 'Could not save countdown information',
                    ], 500);
                }
            }
            return response()->json([
                'status' => 'Update successfully',
                'product' => $product
            ], 200);
        }
    }

    /**
     * Destroy
     */

    public function destroy($id)
    {
        $product = Product::find($id);
        $now = Carbon::now('Asia/Ho_Chi_Minh');
        $product->deleted_at = $now;
        $product->status = 0;

        if ($product->save()) {
            Options::where('product_id', $product->id)->update(['status' => 0]);
            CountDown::where('product_id', $product->id)->update(['status' => 0]);
            ProductImages::where('product_id', $product->id)->update(['status' => 0]);
            return response()->json(['message' => 'Product has been softly deleted.']);
        } else {
            return response()->json(['message' => 'Failed to delete product.']);
        }
    }

    public function destroyALL(Request $request)
    {
        $data = $request['ids'];
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        foreach ($data as $id) {
            $product = Product::find($id);
            if (!$product) {
                return response()->json(['message' => "Product with id $id does not exist."]);
            }
            $product->deleted_at = $now;
            $product->status = 0;
            $product->save();

            Options::where('product_id', $id)->update(['status' => 0]);
            CountDown::where('product_id', $id)->update(['status' => 0]);
            ProductImages::where('product_id', $id)->update(['status' => 0]);
        }
        return response()->json(['message' => 'Products have been softly deleted.']);
    }

    public function trash()
    {
        $products = Product::onlyTrashed()->get();
        return $products;
    }

    public function restore($id)
    {
        // tìm id có xóa tạm không
        $product = Product::withTrashed()->find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        // tìm id có trong danh sách xóa tạm không
        if ($product->trashed()) {
            $product->status = 1;
            if ($product->save()) {
                Options::where('product_id', $product->id)->update(['status' => 1]);
                CountDown::where('product_id', $product->id)->update(['status' => 1]);
                ProductImages::where('product_id', $product->id)->update(['status' => 1]);
                $product->restore();
            }
            return response()->json(['message' => 'Product has been restored.', 'product' => $product->fresh()]);
        } else {
            return response()->json(['message' => 'Product is not deleted.']);
        }
    }

    public function restoreALL(Request $request)
    {
        $data = $request['ids'];

        foreach ($data as $id) {
            // tìm id có xóa tạm không
            $product = Product::withTrashed()->find($id);

            if (!$product) {
                return response()->json(['message' => 'Product not found.'], 404);
            }

            // tìm id có trong danh sách xóa tạm không
            if ($product->trashed()) {
                $product->status = 1;
                if ($product->save()) {
                    Options::where('product_id', $product->id)->update(['status' => 1]);
                    CountDown::where('product_id', $product->id)->update(['status' => 1]);
                    ProductImages::where('product_id', $product->id)->update(['status' => 1]);
                    $product->restore();
                }
            }
        }

        return response()->json(['message' => 'Products have been restored.']);
    }

    /**
     * Remove
     */
    public function remove($id)
    {
        // tìm id có xóa tạm không
        $product = Product::withTrashed()->find($id);
        $product_id = $product->id;

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }
        // Xóa ảnh đại diện của category nếu có
        if ($product->image && Storage::disk('public')->exists('product/' . $product->image)) {
            Storage::disk('public')->delete('product/' . $product->image);
        }
        // tìm id có trong danh sách xóa tạm không
        if ($product->trashed()) {
            // Xóa các bảng liên quan
            Options::where('product_id', $product_id)->delete();
            CountDown::where('product_id', $product_id)->delete();

            $product_image = ProductImages::where('product_id', $product_id)->get();

            if ($product_image->isNotEmpty()) {
                foreach ($product_image as $image) {
                    if ($image->image && Storage::disk('public')->exists('product/' . $image->image)) {
                        Storage::disk('public')->delete('product/' . $image->image);
                        $image->delete();
                    }
                }
            }
            $product->forceDelete();
            return response()->json(['message' => 'Permanently deleted successfully']);
        }
        return response()->json(['message' => 'Product is not deleted.']);
    }

    public function removeALL(Request $request)
    {
        $data = $request['ids'];

        foreach ($data as $id) {
            $product = Product::withTrashed()->find($id);

            if (!$product) {
                return response()->json(['message' => 'Product not found.'], 404);
            }

            // Xóa ảnh đại diện của category nếu có
            if ($product->image && Storage::disk('public')->exists('product/' . $product->image)) {
                Storage::disk('public')->delete('product/' . $product->image);
            }

            // tìm id có trong danh sách xóa tạm không
            if ($product->trashed()) {
                // Xóa các bảng liên quan
                Options::where('product_id', $id)->delete();
                CountDown::where('product_id', $id)->delete();

                $product_image = ProductImages::where('product_id', $id)->get();

                if ($product_image->isNotEmpty()) {
                    foreach ($product_image as $image) {
                        if ($image->image && Storage::disk('public')->exists('product/' . $image->image)) {
                            Storage::disk('public')->delete('product/' . $image->image);
                            $image->delete();
                        }
                    }
                }

                $product->forceDelete();
            } else {
                $product->delete();
            }
        }
        return response()->json(['message' => 'Permanently deleted successfully']);
    }
}
