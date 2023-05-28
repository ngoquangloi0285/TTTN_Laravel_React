<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('id')) {
            // Lấy thông tin của một danh mục với id được truyền vào
            $id = $request['id'];
            $user = User::find($id);
            return $user;
        } else {
            // Lấy danh sách tất cả các danh mục
            $users = User::all();
            return $users;
        }
    }

    public function user(Request $request)
    {
        return $request->user();
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = User::where([
            ['email', $request['email']],
        ])->first();

        if ($user) {
            return response()->json([
                'error' => 'User this email already exists, please choose another email.',
                'user' => $user
            ], 422);
        } else {
            /** Generate id */
            $id = random_int(0, 9999999999);
            $user_id = str_pad($id, 10, '0', STR_PAD_LEFT);
            if (strlen($user_id) > 10) {
                $user_id = substr($user_id, 0, 10);
            }
            $user = User::create([
                'user_id' => $user_id,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'gender' => $request->gender,
                'roles' => $request->role,
                'password' => Hash::make($request->password),
                'author' => $request->user()->name,
                'status' => $request['status'],
            ]);

            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $paths = [];
                $count = count($files);

                foreach ($files as $key => $file) {
                    $path = $user->name . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                    $image = Image::make($file);
                    $image->resize(800, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    Storage::disk('public')->put('user/' . $path, (string) $image->encode());
                    $paths[] = $path;

                    // Lưu ảnh đầu tiên vào trường images của bảng users
                    if ($key == 0) {
                        $user->avatar = $path;
                        $user->save();
                    }
                }
            }

            // Trả về thông tin sản phẩm đã tạo và thông báo thành công
            return response()->json([
                'status' => 'Created Successfully!, hihi',
                'user' => "1234567890QWERTYUIOPASDFGHJKLZXCVBNM"
            ], 200);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    public function edit($id)
    {
        $data = User::find($id);

        if ($data) {
            return response()->json([
                'status' => 200,
                'user' => $data,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No User Found',
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        // Kiểm tra xem email đã tồn tại hay chưa
        if (User::where('email', $request->email)->where('id', '<>', $user->id)->count() > 0) {
            return response()->json([
                'status' => 400,
                'message' => 'Email already exists',
            ], 400);
        }

        if (Hash::check($request->currentPassword, $user->password)) {
            // Mật khẩu hiện tại trùng với mật khẩu đã được mã hóa trong cơ sở dữ liệu
            $user->update([
                'name' => $request['name'],
                'email' => $request['email'],
                'phone' => $request['phone'],
                'address' => $request['address'],
                'gender' => $request['gender'],
                'roles' => $request['role'],
                'author' => $request->user()->name,
                'status' => $request['status']
            ]);

            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $paths = [];
                if ($user->avatar && Storage::disk('public')->exists('user/' . $user->avatar)) {
                    Storage::disk('public')->delete('user/' . $user->avatar);
                }
                foreach ($files as $key => $file) {
                    $path = $request['name'] . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                    $image = Image::make($file);
                    $image->resize(800, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    Storage::disk('public')->put('user/' . $path, (string) $image->encode());
                    $paths[] = $path;

                    // Lưu ảnh đầu tiên vào trường images của bảng users
                    if ($key == 0) {
                        $user->avatar = $path;
                        $user->save();
                    }
                }
            }

            $user->update(['password' => Hash::make($request->password),]);

            return response()->json([
                'status' => 200,
                'message' => 'Updated successfully',
            ]);
        } else {
            // Mật khẩu hiện tại không trùng với mật khẩu đã được mã hóa trong cơ sở dữ liệu
            return response()->json([
                'status' => 'error',
                'message' => 'Current password does not match',
            ], 400);
        }
    }

    public function Profile(Request $request, $id)
    {
        $data = $request->all();
        $user = User::find($id);

        if ($request->has('phone')) {
            $phone = $request->input('phone');

            $user = User::findOrFail($id);
            $user->phone = $phone;
            $user->save();

            return response()->json([
                'message' => 'Phone edit successful. Please log in again to update or load page. Thank you!'
            ], 200);
        }

        if ($request->has('address')) {
            $address = $request->input('address');

            $user = User::findOrFail($id);
            $user->address = $address;
            $user->save();

            return response()->json([
                'message' => 'Address edit successful. Please log in again to update or load page. Thank you!'
            ], 200);
        }

        if ($request->hasFile('images')) {
            $files = $request->file('images');
            $paths = [];
            if ($user->avatar && Storage::disk('public')->exists('user/' . $user->avatar)) {
                Storage::disk('public')->delete('user/' . $user->avatar);
            }
            foreach ($files as $key => $file) {
                $path = $user->name . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                $image = Image::make($file);
                $image->resize(800, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
                Storage::disk('public')->put('user/' . $path, (string) $image->encode());
                $paths[] = $path;

                // Lưu ảnh đầu tiên vào trường images của bảng users
                if ($key == 0) {
                    $user->avatar = $path;
                    $user->save();
                }
            }
            return response()->json([
                'message' => 'Avatar edit successful. Please log in again to update or load page. Thank you!'
            ], 200);
        }

        return response()->json(['message' => 'Update unsuccessful.'], 500);
    }
    /**
     * Remove the specified resource from storage.
     */

    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $now = Carbon::now('Asia/Ho_Chi_Minh');
        $user->deleted_at = $now;
        $user->status = 0;

        if ($user->save()) {
            return response()->json(['message' => 'User has been softly deleted.']);
        } else {
            return response()->json(['message' => 'Failed to delete user.'], 500);
        }
    }


    public function destroyALL(Request $request)
    {
        $data = $request['ids'];
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        foreach ($data as $id) {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => "User with id $id does not exist."]);
            }
            $user->deleted_at = $now;
            $user->status = 0;
            $user->save();
        }
        return response()->json(['message' => 'Users have been softly deleted.']);
    }

    public function trash()
    {
        $trashedUsers = User::onlyTrashed()->get();
        return $trashedUsers;
    }

    public function restore($id)
    {
        $user = User::withTrashed()->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->trashed()) {
            $user->status = 1;
            if ($user->save()) {
                $user->restore();
                return response()->json(['message' => 'User has been restored.', 'user' => $user->fresh()]);
            } else {
                return response()->json(['message' => 'Failed to restore user.'], 500);
            }
        } else {
            return response()->json(['message' => 'User is not deleted.'], 400);
        }
    }

    public function restoreALL(Request $request)
    {
        $data = $request['ids'];
        $restoredUsers = [];

        foreach ($data as $id) {
            $user = User::withTrashed()->find($id);

            if (!$user) {
                $restoredUsers[] = ['id' => $id, 'message' => 'User not found.'];
                continue;
            }

            if ($user->trashed()) {
                $user->status = 1;
                if ($user->save()) {
                    $user->restore();
                    $restoredUsers[] = ['id' => $id, 'message' => 'User has been restored.', 'user' => $user->fresh()];
                } else {
                    $restoredUsers[] = ['id' => $id, 'message' => 'Failed to restore user.'];
                }
            } else {
                $restoredUsers[] = ['id' => $id, 'message' => 'User is not deleted.'];
            }
        }

        return response()->json(['message' => 'Users have been restored.', 'restoredUsers' => $restoredUsers]);
    }

    public function remove($id)
    {
        $user = User::withTrashed()->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->avatar && Storage::disk('public')->exists('user/' . $user->avatar)) {
            Storage::disk('public')->delete('user/' . $user->avatar);
        }

        if ($user->trashed()) {
            $user->forceDelete();
            return response()->json(['message' => 'User permanently deleted successfully']);
        }

        return response()->json(['message' => 'User is not deleted.'], 400);
    }

    public function removeALL(Request $request)
    {
        $data = $request['ids'];

        foreach ($data as $id) {
            $user = User::withTrashed()->find($id);

            if (!$user) {
                $restoredUsers[] = ['id' => $id, 'message' => 'user not found.'];
                continue;
            }

            // Xóa ảnh đại diện của category nếu có
            if ($user->avatar && Storage::disk('public')->exists('user/' . $user->avatar)) {
                Storage::disk('public')->delete('user/' . $user->avatar);
            }

            // tìm id có trong danh sách xóa tạm không
            if ($user->trashed()) {
                $user->forceDelete();
            }
        }
        return response()->json(['message' => 'Permanently deleted successfully']);
    }
}
