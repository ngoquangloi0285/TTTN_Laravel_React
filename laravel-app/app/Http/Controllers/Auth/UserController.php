<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
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
            ], 500);
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

                    // Lưu ảnh đầu tiên vào trường images của bảng products
                    if ($key == 0) {
                        $user->avatar = $path;
                        $user->save();
                    }
                }
            }

            // Trả về thông tin sản phẩm đã tạo và thông báo thành công
            return response()->json([
                'status' => 'Created Successfully!, hihi',
                'user' => $user
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
