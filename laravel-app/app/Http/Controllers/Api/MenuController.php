<?php

namespace App\Http\Controllers\Api;

use App\Models\Menu;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sqlMenu = Menu::where('status', 1)->orderBy('position')->get();
        return response()->json($sqlMenu);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $menu = Menu::where('name', $request['nameMenu'])->first();
        if ($menu) {
            return response()->json([
                'error' => 'Menu with this name already exists, please choose another name.',
                'menu' => $menu
            ], 404);
        } else {
            $last_menu = Menu::max('position');
            // dd($last_menu);
            $menu = Menu::create([
                'name' => $request['nameMenu'],
                'link' => $request['linkMenu'],
                'position' => $last_menu ? $last_menu + 1 : 1, // tăng giá trị position
                'author' => $request->user()->name,
                'status' => $request['status']
            ]);

            // lấy menu vừa tạo là vị trí cần đổi
            $menuCreated = $menu;

            if ($request["position"]) {
                // lấy vị trí bị thay đổi
                $positionMenu = Menu::where('id', '=', $request['position'])->first();

                // thay thế position
                $menuCreated->position = $positionMenu->position;
                $menuCreated->save();

                $menusToUpdate = Menu::where('position', '>', $positionMenu->position)->get();
                foreach ($menusToUpdate as $menuToUpdate) {
                    $menuToUpdate->position += 1;
                    $menuToUpdate->save();
                }
                $positionMenu->position += 1;
                $positionMenu->save();
            }

            // $sqlMenu = Menu::orderBy('position')->get();
            // dd($sqlMenu);

            return response()->json([
                'status' => 'Created Successfully!',
                'menu' => $menu
            ], 200);
        }
        // Trả về thông tin sản phẩm đã tạo và thông báo thành công
        return response()->json([
            'status' => 'Created Not Successfully!',
            'menu' => $menu
        ], 500);
    }


    /**
     * Display the specified resource.
     */

    public function show(Menu $menu)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $menu = Menu::find($id);
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        // Kiểm tra xem có tồn tại Menu không
        if (!$menu) {
            return response()->json(['message' => 'Menu not found.'], 404);
        }

        $menu->deleted_at = $now;
        $menu->status = 0;
        $menu->save();

        return response()->json(['message' => 'Menu have been softly deleted.']);
    }

    public function destroyALL(Request $request)
    {
        $ids = $request['ids'];
        $now = Carbon::now('Asia/Ho_Chi_Minh');
        foreach ($ids as $id) {
            $menu = Menu::find($id);
            // Kiểm tra xem có tồn tại Category không
            if (!$menu) {
                $restoredUsers[] = ['id' => $id, 'message' => 'Category not found.'];
                continue;
            }
            $menu->deleted_at = $now;
            $menu->status = 0;
            $menu->save();
        }
        return response()->json(['message' => 'Menu have been softly deleted.']);
    }

    public function trash()
    {
        $menu = Menu::onlyTrashed()->get();
        return $menu;
    }

    public function restore($id)
    {
        $menu = Menu::withTrashed()->find($id);

        // Kiểm tra xem có tồn tại menu không
        if (!$menu) {
            return response()->json(['message' => 'Menu not found.'], 404);
        }
        $menu->status = 1;
        $menu->restore();

        return response()->json(['message' => 'Menu have been softly restore.']);
    }

    public function restoreAll(Request $request)
    {
        $ids = $request['ids'];
        foreach ($ids as $id) {
            $menu = Menu::withTrashed()->find($id);

            // Kiểm tra xem có tồn tại Category không
            if (!$menu) {
                $restoredUsers[] = ['id' => $id, 'message' => 'Menu not found.'];
                continue;
            }
            $menu->status = 1;
            $menu->restore();
        }
        return response()->json(['message' => 'Menu have been softly restored.']);
    }

    public function remove($id)
    {
        $menu = Menu::withTrashed()->findOrFail($id);
        if (!$menu) {
            return response()->json(['message' => 'Menu not found.'], 404);
        }

        if (!$menu->trashed()) {
            return response()->json(['message' => 'Category is not deleted.']);
        }
        $menu->forceDelete();
        return response()->json(['message' => 'Menu have been permanently deleted.']);
    }

    public function removeALL(Request $request)
    {
        $ids = $request['ids'];

        foreach ($ids as $id) {
            $menu = Menu::withTrashed()->findOrFail($id);

            if (!$menu) {
                $restoredUsers[] = ['id' => $id, 'message' => 'Menu not found.'];
                continue;
            }

            if (!$menu->trashed()) {
                $restoredUsers[] = ['id' => $id, 'message' => 'Menu not found.'];
                continue;
                // return response()->json(['message' => 'Menu is not deleted.']);
            }
            $menu->forceDelete();
        }
        return response()->json(['message' => 'Menu have been permanently deleted.']);
    }
}
