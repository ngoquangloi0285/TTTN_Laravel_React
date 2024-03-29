<?php

use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChangePassController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CountDownController;
use App\Http\Controllers\Api\ImageSlideController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\NewsImagesController;
use App\Http\Controllers\Api\OptionController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImagesController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;


Route::prefix('product/v1')->group(function () {
    // Lấy danh sách sản phẩm
    Route::get('products', [ProductController::class, 'index'])->name('product.index');
    // API lấy dữ liệu sản phẩm:
    Route::get('get_data', [ProductController::class, 'getProductData'])->name('product.getData');
    Route::get("show_slide", [ProductController::class, 'show_slide']);
    // Lấy thông tin sản phẩm theo id
    Route::get('product/{product}', [ProductController::class, 'show'])->name('product.show');

    Route::get('product_detail/{slug}', [ProductController::class, 'product_detail'])->name('product.product_detail');
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
    Route::post('restore/{id}', [CategoryController::class, 'restore'])->name('category.restore');
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
    Route::post('restore/{id}', [BrandController::class, 'restore'])->name('brand.restore');
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
    Route::get('news_detail', [NewsController::class, 'news_detail'])->name('news.news_detail');
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
    Route::post('restore/{id}', [NewsController::class, 'restore'])->name('news.restore');
    // Khôi phục SP ALL
    Route::post('restoreALL', [NewsController::class, 'restoreALL'])->name('news.restoreALL');
    // Xóa vĩnh viễn SP
    Route::delete('/remove/{id}', [NewsController::class, 'remove'])->name('news.remove');
    // Xóa vĩnh viễn  nhiều SP
    Route::delete('removeALL', [NewsController::class, 'removeALL'])->name('news.removeALL');
});

Route::middleware(['auth:sanctum'])->prefix('users')->group(function () {
    // Route trong group này sẽ có prefix 'user' và middleware 'auth:sanctum'
    Route::prefix('v1')->group(function () {
        Route::get("user", [UserController::class, 'user']);
    });
});

Route::prefix('user/v1')->group(function () {
    // News
    Route::get("users", [UserController::class, 'index']);
    // Lấy thông tin sản phẩm theo id
    Route::get('{id}', [UserController::class, 'show'])->name('user.show');
    // Lấy thông tin sản phẩm theo id
    Route::get('edit/{id}', [UserController::class, 'edit'])->name('user.edit');
    // Tạo sản phẩm mới
    Route::post("create-user", [UserController::class, 'store'])->name('user.store');
    // Cập nhật sp phuong thuc POST
    Route::post('update-user/{id}', [UserController::class, 'update'])->name('user.update')->middleware('cors');
    // Cập nhật profile
    Route::post('profile-user/{id}', [UserController::class, 'profile'])->name('user.profile')->middleware('cors');
    // Lấy tất cả SP trong đã xóa tạm
    Route::get('user/trash', [UserController::class, 'trash'])->name('user.trash');
    // Xóa tạm SP
    Route::delete('soft-delete/{id}', [UserController::class, 'destroy'])->name('user.destroy');
    // Xóa tạm ALL SP
    Route::delete('user_all/soft-delete', [UserController::class, 'destroyALL'])->name('user.destroyALL');
    // Khôi phục SP với ID
    Route::post('restore/{id}', [UserController::class, 'restore'])->name('user.restore');
    // Khôi phục SP ALL
    Route::post('restoreALL', [UserController::class, 'restoreALL'])->name('user.restoreALL');
    // Xóa vĩnh viễn SP
    Route::delete('/remove/{id}', [UserController::class, 'remove'])->name('user.remove');
    // Xóa vĩnh viễn  nhiều SP
    Route::delete('removeALL', [UserController::class, 'removeALL'])->name('user.removeALL');

    Route::get('count_user', [UserController::class, 'countUser'])->name('user.countUser');
});

Route::prefix('contact/v1')->group(function () {
    // News
    Route::get("contacts", [ContactController::class, 'index']);
    // Lấy thông tin sản phẩm theo id
    Route::get('{id}', [ContactController::class, 'show'])->name('contact.show');
    // Lấy thông tin sản phẩm theo id
    Route::get('edit/{id}', [ContactController::class, 'edit'])->name('contact.edit');
    // Tạo sản phẩm mới
    Route::post("create-contact", [ContactController::class, 'store'])->name('contact.store');
    // Cập nhật sp phuong thuc POST
    Route::post('update-contact/{id}', [ContactController::class, 'update'])->name('contact.update')->middleware('cors');
    // Lấy tất cả SP trong đã xóa tạm
    Route::get('contact/trash', [ContactController::class, 'trash'])->name('contact.trash');
    // Xóa tạm SP
    Route::delete('soft-delete/{id}', [ContactController::class, 'destroy'])->name('contact.destroy');
    // Xóa tạm ALL SP
    Route::delete('contact_all/soft-delete', [ContactController::class, 'destroyALL'])->name('contact.destroyALL');
    // Khôi phục SP với ID
    Route::post('restore/{id}', [ContactController::class, 'restore'])->name('contact.restore');
    // Khôi phục SP ALL
    Route::post('restoreALL', [ContactController::class, 'restoreALL'])->name('contact.restoreALL');
    // Xóa vĩnh viễn SP
    Route::delete('/remove/{id}', [ContactController::class, 'remove'])->name('contact.remove');
    // Xóa vĩnh viễn  nhiều SP
    Route::delete('removeALL', [ContactController::class, 'removeALL'])->name('contact.removeALL');
});

Route::prefix('menu/v1')->group(function () {
    // News
    Route::get("menus", [MenuController::class, 'index']);
    // Lấy thông tin sản phẩm theo id
    Route::get('{id}', [MenuController::class, 'show'])->name('menu.show');
    // Lấy thông tin sản phẩm theo id
    Route::get('edit/{id}', [MenuController::class, 'edit'])->name('menu.edit');
    // Tạo sản phẩm mới
    Route::post("create-menu", [MenuController::class, 'store'])->name('menu.store');
    // Cập nhật sp phuong thuc POST
    Route::post('update-menu/{id}', [MenuController::class, 'update'])->name('menu.update')->middleware('cors');
    // Lấy tất cả SP trong đã xóa tạm
    Route::get('menu/trash', [MenuController::class, 'trash'])->name('menu.trash');
    // Xóa tạm SP
    Route::delete('soft-delete/{id}', [MenuController::class, 'destroy'])->name('menu.destroy');
    // Xóa tạm ALL SP
    Route::delete('menu_all/soft-delete', [MenuController::class, 'destroyALL'])->name('menu.destroyALL');
    // Khôi phục SP với ID
    Route::post('restore/{id}', [MenuController::class, 'restore'])->name('menu.restore');
    // Khôi phục SP ALL
    Route::post('restoreALL', [MenuController::class, 'restoreALL'])->name('menu.restoreALL');
    // Xóa vĩnh viễn SP
    Route::delete('remove/{id}', [MenuController::class, 'remove'])->name('menu.remove');
    // Xóa vĩnh viễn  nhiều SP
    Route::delete('removeALL', [MenuController::class, 'removeALL'])->name('menu.removeALL');
});

Route::prefix('order/v1')->group(function () {
    // Order
    Route::get("orders", [OrderController::class, 'index'])->name('order.orders');
    Route::get("edit/{id}", [OrderController::class, 'edit'])->name('order.edit');
    Route::post("create_order", [OrderController::class, 'store'])->name('order.create_order');
    Route::get("your_order/{id}", [OrderController::class, 'your_order'])->name('order.your_order');
    Route::post('update-order/{id}', [OrderController::class, 'update'])->name('order.update')->middleware('cors');
    Route::delete('destroy/{id}', [OrderController::class, 'destroy'])->name('order.destroy');
    Route::get('history/{id}', [OrderController::class, 'history'])->name('order.history');
    Route::get('history_trash/{id}', [OrderController::class, 'historyTrash'])->name('order.historyTrash');
    Route::get('trash', [OrderController::class, 'trash'])->name('order.trash');
    Route::get('revenue', [OrderController::class, 'revenue'])->name('order.revenue');
    Route::get('completed_orders', [OrderController::class, 'completedOrders'])->name('order.completedOrders');
    Route::get('canceled_orders', [OrderController::class, 'canceledOrders'])->name('order.canceledOrders');
    Route::get('count_user', [OrderController::class, 'countUser'])->name('user.countUser');
});

Route::prefix('review/v1')->group(function () {
    // rating
    Route::get("reviews", [RatingController::class, 'index']);
    Route::post("review_create", [RatingController::class, 'create_review']);
    Route::get('ratings', [RatingController::class, 'getRatings']);

});

Route::prefix('countdown/v1')->group(function () {
    // Brand
    Route::get("countdown", [CountDownController::class, 'index']);
});

Route::prefix('images/v1')->group(function () {
    // images
    Route::get("images", [ProductImagesController::class, 'index']);
});

Route::prefix('news_images/v1')->group(function () {
    // images
    Route::get("news_images", [NewsImagesController::class, 'index']);
});
Route::prefix('slide/v1')->group(function () {
    // images
    Route::get("slide", [ImageSlideController::class, 'index']);
    // Route::get("show_slide", [ImageSlideController::class, 'show_slide']);
    Route::post("create_slide", [ImageSlideController::class, 'store']);
    // Xóa vĩnh viễn SP
    Route::delete('/remove/{id}', [ImageSlideController::class, 'remove'])->name('slide.remove');
});
Route::post("change-password", [ChangePassController::class, 'ChangePassWord']);
