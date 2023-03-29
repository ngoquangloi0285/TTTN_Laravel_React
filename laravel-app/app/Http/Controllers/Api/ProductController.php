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
        $product = new Product();
        $product->name_product = $request->name;
        $product->slug = Str::slug($product->name_product = $request->name, '-');
        $product->summary = "summary";
        $product->price = $request->price;
        $product->detail = $request->detail;
        $product->category_id = 1;
        $product->brand_id = 1;
        $product->user_id = 1;
        $product->cost = 10;
        $product->discount = 10;
        $product->color = "red";
        $product->inch = "5inch";
        $product->total = 200;
        $product->type = "hello";
        $product->author = "admin";
        $product->status = 1;
        $product->save();
        return response()->json(['status' => "Created Product Success"]);
    }
}
