<?php

namespace App\Http\Controllers\Api;

use App\Models\ImageSlide;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImages;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;

class ImageSlideController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = $request->query('filter');
        $products = Product::where('type', $filter)->with('images')
            // ->limit(1)
            ->get();
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        if ($request->has('images')) {
            // Xóa tất cả các bản ghi slide hiện có
            ImageSlide::truncate();

            // Xóa tất cả các tệp ảnh trong thư mục slide
            $files = Storage::disk('public')->files('slide');
            Storage::disk('public')->delete($files);

            foreach ($request->input('images') as $file) {
                $path = $file;
                $imagePath = 'slide/' . $path;
                Storage::disk('public')->put($imagePath, (string)$request->input('product_id'));

                $slide = new ImageSlide();
                $slide->product_id = $request->input('product_id');
                $slide->title = $request->input('type');
                $slide->name_product = $request->input('name_product');
                $slide->price = $request->input('price');
                $slide->discount = $request->input('discount');
                $slide->image = $path;
                $slide->author = $request->user()->name;
                $slide->slug_product = Str::slug($request->input('slug_product'), '-');
                $slide->status = '1';
                $slide->save();
            }

            return response()->json([
                'status' => 'Created Successfully!',
            ], 200);
        }

        return response()->json([
            'status' => 'No images uploaded!',
        ], 400);

        return response()->json([
            'status' => 'No images uploaded!',
        ], 400);
    }

    public function show_slide()
    {
        $product_sale = "product_sale";
        $product_special = "product_special";
        $data = ImageSlide::where(function ($query) use ($product_sale, $product_special) {
            $query->where('title', $product_sale)
                ->orWhere('title', $product_special);
        })->orderBy('created_at', 'desc')->latest()->get();

        return response()->json($data);
    }
    /**
     * Display the specified resource.
     */
    public function show(ImageSlide $imageSlide)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ImageSlide $imageSlide)
    {
        //
    }

    // public function remove($id)
    // {
    //     $imageSlides = ImageSlide::where('product_id', $id)->get();
    //     if ($imageSlides->isEmpty()) {
    //         return response()->json([
    //             'error' => 'Slide not found in Slide Table',
    //         ], 404);
    //     }
    //     if ($imageSlides) {
    //         foreach ($imageSlides as $imageSlide) {
    //             $imageSlide->delete();
    //         }
    //     }

    //     return response()->json([
    //         'message' => 'Permanently deleted successfully',
    //     ]);
    // }
}
