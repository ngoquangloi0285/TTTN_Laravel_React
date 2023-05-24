<?php

namespace App\Http\Controllers\Api;

use App\Models\ImageSlide;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImages;
use Illuminate\Http\Request;

class ImageSlideController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = $request->query('filter');
        $products = Product::where('type', $filter)->with('images')
            ->limit(8)
            ->get();
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function update(Request $request, ImageSlide $imageSlide)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ImageSlide $imageSlide)
    {
        //
    }
}
