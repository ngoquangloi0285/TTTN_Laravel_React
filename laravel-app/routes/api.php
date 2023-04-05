<?php

use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChangePassController;
use App\Http\Controllers\Api\OptionController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->group(function () {
    // Product
    Route::post("/create-product", [ProductController::class, 'createProduct'])->name('product.create');
    Route::get("/products", [ProductController::class, 'index']);
    Route::delete('/products/{id}/soft-delete', [ProductController::class, 'softDelete'])->name('product.soft-delete');
    Route::get('/update-total-product-count', [ProductController::class, 'updateTotalProductCount'])->name('totalProductCount');
    // Category
    Route::get("/categorys", [CategoryController::class, 'index']);
    // Brand
    Route::get("/brands", [BrandController::class, 'index']);

    Route::post("/change-password", [ChangePassController::class, 'ChangePassWord']);
});
