<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = Product::query();

        if ($search) {
            $query->where('name_product', 'like', "%$search%");
        }

        $products = $query->get();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'nameProduct' => 'required|max:255',
            'summary' => 'required',
            'costProduct' => 'required|numeric|min:0',
            'priceSale' => 'required|numeric|min:0',
            'discount' => 'numeric|min:0',
            'countDown' => 'numeric|min:0',
            'image' => 'required',
            'detail' => 'required',
            'color' => 'required|max:255',
            'inch' => 'required|max:255',
            'category' => 'required|max:255',
            'brand' => 'required|max:255',
            'status' => 'required|in:active,inactive',
        ]);
    }
}
