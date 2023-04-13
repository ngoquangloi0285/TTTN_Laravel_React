<?php

use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChangePassController;
use App\Http\Controllers\Api\CountDownController;
use App\Http\Controllers\Api\OptionController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImagesController;
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
    Route::get('products', [ProductController::class, 'index_admin'])->name('products.index');
    // Lấy thông tin sản phẩm theo id
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
    // Lấy thông tin sản phẩm theo id
    Route::get('edit/{id}', [ProductController::class, 'edit'])->name('products.edit');
    // Tạo sản phẩm mới
    Route::post("create-product", [ProductController::class, 'store'])->name('product.store');
    // Cập nhật sp phuong thuc PUT
    Route::post('update/{id}', [ProductController::class, 'update'])->name('products.update');
    // Cập nhật sp phuong thuc PATCH
    Route::patch('products/{product}', [ProductController::class, 'update'])->name('products.update');
    // Xóa tạm SP
    Route::delete('products/{product}/soft-delete', [ProductController::class, 'destroy'])->name('products.destroy');
    // Khôi phục SP với ID
    Route::get('restore/{id}', [ProductController::class, 'restore'])->name('products.restore');
    // Lấy tất cả SP trong đã xóa tạm
    Route::get('trash', [ProductController::class, 'trash'])->name('products.trash');
    // Xóa vĩnh viễn SP
    Route::delete('/remove/{id}', [ProductController::class, 'remove'])->name('products.remove');
});

Route::prefix('category/v1')->group(function () {
    // Category
    Route::get("category", [CategoryController::class, 'index']);
    // Lấy thông tin sản phẩm theo id
    Route::get('category/{id}', [CategoryController::class, 'show'])->name('category.show');
    // Tạo sản phẩm mới
    Route::post("create-category", [CategoryController::class, 'store'])->name('category.store');
    // Xóa tạm SP
    Route::delete('soft-delete/{id}', [CategoryController::class, 'destroy'])->name('category.destroy');
    // Khôi phục SP với ID
    Route::get('restore/{id}', [CategoryController::class, 'restore'])->name('category.restore');
    // Lấy tất cả SP trong đã xóa tạm
    Route::get('trash', [CategoryController::class, 'trash'])->name('category.trash');
    // Xóa vĩnh viễn SP
    Route::delete('/remove/{id}', [CategoryController::class, 'remove'])->name('category.remove');
});
Route::prefix('brands/v1')->group(function () {
    // Brand
    Route::get("/brands", [BrandController::class, 'index']);
});
Route::prefix('countdown/v1')->group(function () {
    // Brand
    Route::get("/countdown", [CountDownController::class, 'index']);
});
Route::prefix('images/v1')->group(function () {
    // Brand
    Route::get("/images", [ProductImagesController::class, 'index']);
});
Route::post("/change-password", [ChangePassController::class, 'ChangePassWord']);
