<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductImages;
use Illuminate\Http\Request;

class ProductImagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $product_images = ProductImages::get();
        return $product_images;
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
    public function show(ProductImages $brand)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductImages $brand)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductImages $brand)
    {
        //
    }
}
