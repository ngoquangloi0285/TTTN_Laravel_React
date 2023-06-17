<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\CountDown;
use App\Models\ImageSlide;
use App\Models\Options;
use App\Models\ProductImages;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Storage;
use PhpOption\Option;

class ProductController extends Controller
{
    public function show_slide()
    {
        $titles = ['product_sale', 'product_special'];

        $data = ImageSlide::whereIn('title', $titles)
            ->orderBy('created_at', 'desc')
            ->latest()
            ->get();

        return response()->json($data);
    }

    public function getProductData(Request $request)
    {
        $params = $request->all();

        $query = Product::where('status', 1)
            ->where('total', '>', 0);

        if (isset($params['random_product'])) {
            $products = $query->where('type', '=', 'new_product')->inRandomOrder()
                ->where('status', 1)
                ->where('total', '>', 0)
                ->limit(3)
                ->latest()
                ->get();
        }
        // Load sản phẩm mới và sản phẩm giảm giá
        if (isset($params['newProduct']) || isset($params['saleProduct'])) {
            $typeNew = $params['newProduct'];
            $typeSale = $params['saleProduct'];
            $products = $query->whereIn('type', [$typeNew, $typeSale])
                ->where('status', 1)
                ->where('total', '>', 0)
                ->orderBy('created_at', 'desc')
                ->inRandomOrder()
                ->limit(10)
                ->latest()
                ->get();
        }
        // Sản phẩm đặc biệt
        else if (isset($params['specialProduct'])) {
            $type = $params['specialProduct'];
            $products = $query->where('type', $type)
                ->where('status', 1)
                ->where('total', '>', 0)
                ->orderBy('price', 'asc')
                ->inRandomOrder()
                ->latest()
                ->limit(4)
                ->get();

            $countdowns = Countdown::with('product')
                ->whereIn('product_id', $products->pluck('id'))
                ->get();

            foreach ($products as $product) {
                $countdown = $countdowns->firstWhere('product_id', $product->id);
                if ($countdown) {
                    // Gán dữ liệu từ Countdown vào Product
                    $product->start_time = $countdown->start_time;
                    $product->end_time = $countdown->end_time;
                }
            }
        }

        // Sản phẩm gợi ý ngẫu nhiên
        else if (isset($params['suggestion'])) {
            $products = $query->inRandomOrder()
                ->where('status', 1)
                ->where('total', '>', 0)
                ->limit(5)
                ->latest()
                ->get();
        }
        // Sản phẩm liên quan
        else if (isset($params['relatedproducts'])) {
            $productId = $request->input('relatedproducts');
            // Gọi hàm getRelatedProducts để lấy danh sách sản phẩm liên quan
            $products = $this->getRelatedProducts($productId);
        }
        return response()->json($products);
    }

    public function getRelatedProducts($productId)
    {
        // Lấy thông tin của sản phẩm hiện tại
        $currentProduct = Product::find($productId);

        // Kiểm tra xem sản phẩm hiện tại có tồn tại không
        if ($currentProduct) {
            $categoryId = $currentProduct->category_id;
            $brandId = $currentProduct->brand_id;
            $productType = $currentProduct->type;

            // Tìm kiếm các sản phẩm liên quan dựa trên cùng loại, cùng danh mục và cùng thương hiệu
            $relatedProducts = Product::where('category_id', $categoryId)
                // ->where('brand_id', $brandId)
                ->where('type', $productType)
                ->where('id', '!=', $productId) // Loại trừ sản phẩm hiện tại
                ->where('status', 1)
                ->where('total', '>', 0)
                ->get();
            return $relatedProducts;
        } else {
            // Xử lý khi không tìm thấy sản phẩm hiện tại
            return [];
        }
    }

    // ...
    public function searchProducts($slug)
    {
        $products = Product::where('status', 1)
            ->when($slug, function ($query) use ($slug) {
                return $query->where('name_product', 'like', "%{$slug}%");
            })
            ->where('total', '>', 0)
            ->get();

        return $products;
    }

    // hàm lọc
    public function filterProducts($filter)
    {
        return Product::where('status', 1)
            ->when($filter === 'bestSelling', function ($query) {
                return $query->orderBy('sales', 'desc');
            })
            ->when($filter === 'lowToHigh', function ($query) {
                return $query->orderBy('price', 'asc');
            })
            ->when($filter === 'highToLow', function ($query) {
                return $query->orderBy('price', 'desc');
            })
            ->when($filter === 'oldToNew', function ($query) {
                return $query->orderBy('created_at', 'asc');
            })
            ->when($filter === 'newToOld', function ($query) {
                return $query->orderBy('created_at', 'desc');
            })
            ->where('total', '>', 0)
            ->get();
    }

    public function searchBySlug($slug)
    {
        return Product::where('status', 1)
            ->where('total', '>', 0)
            ->when($slug, function ($query, $slug) {
                return $query->where(function ($query) use ($slug) {
                    $query->whereHas('category', function ($query) use ($slug) {
                        $query->where('slug', $slug);
                    })
                        ->orWhereHas('brand', function ($query) use ($slug) {
                            $query->where('slug', $slug);
                        })
                        ->orWhere(function ($query) use ($slug) {
                            $query->where('color', $slug)
                                ->orWhere('inch', $slug);
                        });
                });
            })
            ->latest()
            ->get();
    }

    public function index(Request $request)
    {
        $params = $request->all();
        $search = isset($params['search']) ? $params['search'] : null;
        $filter = isset($params['filter']) ? $params['filter'] : null;
        $slug = isset($params['slug']) ? $params['slug'] : null;
        $products = [];

        if ($search) {
            $products = $this->searchProducts($search);
        } elseif ($slug) {
            $products = $this->searchBySlug($slug);
        } elseif ($filter) {
            $products = $this->filterProducts($filter);
        } else {
            $products = Product::where('status', 1)
                ->where('total', '>', 0)
                ->inRandomOrder()
                ->latest()
                ->get();
        }
        return response()->json($products);
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
                'type' => $request['type'],
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

    public function product_detail(Request $request)
    {
        $data = $request['slug'];
        $product = Product::where('slug', $data)->with('images')->first();
        return response()->json($product);
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
            $product->type = $request['type'];
            $product->detail = $request['detail'];
            $product->author = $request->user()->name;
            $product->status = $request['status'];

            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $paths = [];

                // Xóa các đường dẫn đã tồn tại trong folder "product" trước khi tạo mới
                foreach ($files as $key => $file) {
                    $path = $request['nameProduct'] . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                    $image = Image::make($file);
                    $image->resize(800, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    Storage::disk('public')->put('product/' . $path, (string) $image->encode());
                    $paths[] = $path;
                }

                // Xóa đường dẫn đã tồn tại trong folder "product" trước khi tạo mới
                if ($product->image && Storage::disk('public')->exists('product/' . $product->image)) {
                    Storage::disk('public')->delete('product/' . $product->image);
                }
                foreach ($product->productImages as $productImage) {
                    if ($productImage->image && Storage::disk('public')->exists('product/' . $productImage->image)) {
                        Storage::disk('public')->delete('product/' . $productImage->image);
                    }
                }

                // Lưu ảnh đầu tiên vào trường "image" của bảng "products"
                if (isset($paths[0])) {
                    $product->image = $paths[0];
                    $product->save();
                }

                // Xóa các bản ghi cũ trong bảng "product_images" liên quan đến sản phẩm
                $product->productImages()->delete();

                // Tạo các bản ghi mới trong bảng "product_images"
                foreach ($paths as $key => $path) {
                    if ($key > 0) {
                        $productImage = new ProductImages;
                        $productImage->product_id = $product->id;
                        $productImage->image = $path;
                        $productImage->author = $request->user()->name;
                        $productImage->status = $request['status'];
                        $productImage->save();
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
                $restoredUsers[] = ['id' => $id, 'message' => 'Product not found.'];
                continue;
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
                $restoredUsers[] = ['id' => $id, 'message' => 'Product not found.'];
                continue;
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
                $restoredUsers[] = ['id' => $id, 'message' => 'Product not found.'];
                continue;
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
