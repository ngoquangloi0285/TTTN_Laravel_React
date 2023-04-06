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

Route::prefix('product/v1')->group(function () {
    // Lấy danh sách sản phẩm
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    // Lấy thông tin sản phẩm theo id
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
    // Tạo sản phẩm mới
    Route::post("/create-product", [ProductController::class, 'store'])->name('product.store');
    // Cập nhật sp phuong thuc PUT
    Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
    // Cập nhật sp phuong thuc PATCH
    Route::patch('products/{product}', [ProductController::class, 'update'])->name('products.update');
    // Xóa tạm SP
    Route::delete('products/{product}/soft-delete', [ProductController::class, 'destroy'])->name('products.destroy');
    // Khôi phục SP với ID
    Route::get('/products.restore/{id}', [ProductController::class, 'restore']);
    // Lấy tất cả SP trong đã xóa tạm
    Route::get('/products.trash', [ProductController::class, 'trash']);
    // Xóa vĩnh viễn SP
    Route::delete('products.remove/{product}', [ProductController::class, 'remove'])->name('products.remove');
});

Route::prefix('category/v1')->group(function () {
    // Category
    Route::get("/category", [CategoryController::class, 'index']);
    // Brand
    Route::get("/brands", [BrandController::class, 'index']);

});
Route::prefix('brands/v1')->group(function () {
    // Brand
    Route::get("/brands", [BrandController::class, 'index']);

});
Route::post("/change-password", [ChangePassController::class, 'ChangePassWord']);
