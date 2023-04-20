<?php

namespace App\Http\Controllers\Api;

use App\Models\NewsImages;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NewsImagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $images = NewsImages::get();
        return $images;
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
    public function show(NewsImages $newsImages)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NewsImages $newsImages)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NewsImages $newsImages)
    {
        //
    }
}
