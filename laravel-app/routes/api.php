<?php

use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChangePassController;
use App\Http\Controllers\Api\CountDownController;
use App\Http\Controllers\Api\NewsController;
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
    Route::get('products', [ProductController::class, 'index_admin'])->name('product.index');
    // Lấy thông tin sản phẩm theo id
    Route::get('product/{product}', [ProductController::class, 'show'])->name('product.show');
    // Lấy thông tin sản phẩm theo id
    Route::get('edit/{id}', [ProductController::class, 'edit'])->name('product.edit');
    // Tạo sản phẩm mới
    Route::post("create-product", [ProductController::class, 'store'])->name('product.store');
    // Cập nhật sp phuong thuc POST
    Route::post('update-product/{id}', [ProductController::class, 'update'])->name('product.update')->middleware('cors');
    // Lấy tất cả SP trong đã xóa tạm
    Route::get('trash', [ProductController::class, 'trash'])->name('products.trash');
    // Xóa tạm SP
    Route::delete('product/{product}/soft-delete', [ProductController::class, 'destroy'])->name('product.destroy');
    // Xóa tạm ALL SP
    Route::delete('products/soft-delete', [ProductController::class, 'destroyALL'])->name('products.destroyALL');
    // Khôi phục SP
    Route::post('restore/{id}', [ProductController::class, 'restore'])->name('product.restore');
    // Khôi phục SP ALL
    Route::post('restoreALL', [ProductController::class, 'restoreALL'])->name('products.restoreALL');
    // Xóa vĩnh viễn SP
    Route::delete('/remove/{id}', [ProductController::class, 'remove'])->name('products.remove');
    // Xóa vĩnh viễn  nhiều SP
    Route::delete('/removeALL', [ProductController::class, 'removeALL'])->name('products.removeALL');
});

Route::prefix('category/v1')->group(function () {
    // Category
    Route::get("category", [CategoryController::class, 'index']);
    // Lấy thông tin sản phẩm theo id
    Route::get('category/{id}', [CategoryController::class, 'show'])->name('category.show');
    // Lấy thông tin sản phẩm theo id
    Route::get('edit/{id}', [CategoryController::class, 'edit'])->name('category.edit');
    // Tạo sản phẩm mới
    Route::post("create-category", [CategoryController::class, 'store'])->name('category.store');
    // Cập nhật sp phuong thuc POST
    Route::post('update/{id}', [CategoryController::class, 'update'])->name('category.update')->middleware('cors');
    // Lấy tất cả SP trong đã xóa tạm
    Route::get('trash', [CategoryController::class, 'trash'])->name('category.trash');
    // Xóa tạm SP
    Route::delete('soft-delete/{id}', [CategoryController::class, 'destroy'])->name('category.destroy');
    // Xóa tạm ALL SP
    Route::delete('category_all/soft-delete', [CategoryController::class, 'destroyALL'])->name('category.destroyALL');
    // Khôi phục SP với ID
    Route::get('restore/{id}', [CategoryController::class, 'restore'])->name('category.restore');
    // Khôi phục SP ALL
    Route::post('restoreALL', [CategoryController::class, 'restoreALL'])->name('category.restoreALL');
    // Xóa vĩnh viễn SP
    Route::delete('remove/{id}', [CategoryController::class, 'remove'])->name('category.remove');
    // Xóa vĩnh viễn  nhiều SP
    Route::delete('removeALL', [CategoryController::class, 'removeALL'])->name('category.removeALL');
});

Route::prefix('brand/v1')->group(function () {
    // Brand
    Route::get("brand", [BrandController::class, 'index']);
    // Lấy thông tin sản phẩm theo id
    Route::get('brand/{id}', [BrandController::class, 'show'])->name('brand.show');
    // Lấy thông tin sản phẩm theo id
    Route::get('edit/{id}', [BrandController::class, 'edit'])->name('brand.edit');
    // Tạo sản phẩm mới
    Route::post("create-brand", [BrandController::class, 'store'])->name('brand.store');
    // Cập nhật sp phuong thuc POST
    Route::post('update/{id}', [BrandController::class, 'update'])->name('brand.update')->middleware('cors');
    // Lấy tất cả SP trong đã xóa tạm
    Route::get('trash', [BrandController::class, 'trash'])->name('brand.trash');
    // Xóa tạm SP
    Route::delete('soft-delete/{id}', [BrandController::class, 'destroy'])->name('brand.destroy');
    // Xóa tạm ALL SP
    Route::delete('brand_all/soft-delete', [BrandController::class, 'destroyALL'])->name('brand.destroyALL');
    // Khôi phục SP với ID
    Route::get('restore/{id}', [BrandController::class, 'restore'])->name('brand.restore');
    // Khôi phục SP ALL
    Route::post('restoreALL', [BrandController::class, 'restoreALL'])->name('brand.restoreALL');
    // Xóa vĩnh viễn SP
    Route::delete('/remove/{id}', [BrandController::class, 'remove'])->name('brand.remove');
    // Xóa vĩnh viễn  nhiều SP
    Route::delete('removeALL', [BrandController::class, 'removeALL'])->name('brand.removeALL');
});
Route::prefix('news/v1')->group(function () {
    // News
    Route::get("news", [NewsController::class, 'index']);
    // Lấy thông tin sản phẩm theo id
    Route::get('news/{id}', [NewsController::class, 'show'])->name('news.show');
    // Lấy thông tin sản phẩm theo id
    Route::get('edit/{id}', [NewsController::class, 'edit'])->name('news.edit');
    // Tạo sản phẩm mới
    Route::post("create-news", [NewsController::class, 'store'])->name('news.store');
    // Cập nhật sp phuong thuc POST
    Route::post('update/{id}', [NewsController::class, 'update'])->name('news.update')->middleware('cors');
    // Lấy tất cả SP trong đã xóa tạm
    Route::get('trash', [NewsController::class, 'trash'])->name('news.trash');
    // Xóa tạm SP
    Route::delete('soft-delete/{id}', [NewsController::class, 'destroy'])->name('news.destroy');
    // Xóa tạm ALL SP
    Route::delete('news_all/soft-delete', [NewsController::class, 'destroyALL'])->name('news.destroyALL');
    // Khôi phục SP với ID
    Route::get('restore/{id}', [NewsController::class, 'restore'])->name('news.restore');
    // Khôi phục SP ALL
    Route::post('restoreALL', [NewsController::class, 'restoreALL'])->name('news.restoreALL');
    // Xóa vĩnh viễn SP
    Route::delete('/remove/{id}', [NewsController::class, 'remove'])->name('news.remove');
    // Xóa vĩnh viễn  nhiều SP
    Route::delete('removeALL', [NewsController::class, 'removeALL'])->name('news.removeALL');
});
Route::prefix('countdown/v1')->group(function () {
    // Brand
    Route::get("countdown", [CountDownController::class, 'index']);
});
Route::prefix('images/v1')->group(function () {
    // images
    Route::get("images", [ProductImagesController::class, 'index']);
});
Route::post("change-password", [ChangePassController::class, 'ChangePassWord']);
