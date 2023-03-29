<?php

use App\Http\Controllers\Api\ChangePassController;
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
    Route::post("/create-product", [ProductController::class,'store'])->name('product.create');
    Route::get("/products", [ProductController::class,'index']);
    Route::post("/change-password", [ChangePassController::class,'ChangePassWord']);
});

