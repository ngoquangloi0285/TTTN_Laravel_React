<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class ChangePassController extends Controller
{
    public function ChangePassWord(Request $request)
    {
        $user = Auth::user(); // Lấy thông tin người dùng đã đăng nhập
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'password' => 'required|confirmed|min:8'
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (Hash::check($request->current_password, $user->password)) { // Xác thực mật khẩu hiện tại
            $user->password = Hash::make($request->password); // Lưu mật khẩu mới
            $user->save();
            return response()->json(['status' => 'Password changed successfully'], 200);
        } else {
            return response()->json(['status' => "Current password is incorrect"], 422);
        }
    }
}
