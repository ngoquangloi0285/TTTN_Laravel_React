<?php

namespace App\Http\Controllers\Api;

use App\Models\News;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CountDown;
use App\Models\NewsImages;
use App\Models\Options;
use App\Models\ProductImages;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;
use Illuminate\Support\Facades\Storage;;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = News::query();

        $news = $query->get();

        return response()->json($news);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $news = News::where([
            ['title_news', $request['titleNews']],
            ['slug', Str::slug($request['titleNews'], '-')]
        ])->first();

        if ($news) {
            return response()->json([
                'error' => 'News with this name already exists, please choose another name.',
                'news' => $news
            ], 500);
        } else {
            /** Generate id */
            $id = random_int(0, 9999999999);
            $news_id = str_pad($id, 10, '0', STR_PAD_LEFT);
            if (strlen($news_id) > 10) {
                $news_id = substr($news_id, 0, 10);
            }
            $news = News::create([
                'news_id' => $news_id,
                'title_news' => $request['titleNews'],
                'slug' => Str::slug($request['titleNews'], '-'),
                'category_id' => $request['category'],
                'content_news' => $request['contentNews'],
                'author' => $request->user()->name,
                'status' => $request['status']
            ]);

            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $paths = [];
                $count = count($files);

                foreach ($files as $key => $file) {
                    $path = $news->title_news . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                    $image = Image::make($file);
                    $image->resize(800, null, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    });
                    Storage::disk('public')->put('news/' . $path, (string) $image->encode());
                    $paths[] = $path;

                    // Lưu ảnh đầu tiên vào trường images của bảng products
                    if ($key == 0) {
                        $news->image = $path;
                        $news->save();
                    } else {
                        // Lưu các ảnh còn lại vào bảng product_images
                        $newsImages = new NewsImages();
                        $newsImages->news_id = $news->id;
                        $newsImages->image = $path;
                        $newsImages->author = $request->user()->name;
                        $newsImages->status = $request['status'];
                        $newsImages->save();
                    }
                }
            }

            // Trả về thông tin sản phẩm đã tạo và thông báo thành công
            return response()->json([
                'status' => 'Created Successfully!, hihi',
                'news' => $news
            ], 200);
        }
    }


    public function show(News $news)
    {
        return $news;
    }

    /**
     * Display the specified resource.
     */
    public function edit($id)
    {
        $data = News::find($id);

        if ($data) {
            return response()->json([
                'status' => 200,
                'news' => $data,
            ]);
        } else {
            return response()->json([
                'status' => 404,
                'message' => 'No News Found',
            ]);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json([
                'status' => 404,
                'error' => 'News not exists',
            ]);
        } else {
            $news->title_news = $request['titleNews'];
            $news->slug = Str::slug($request['titleNews'], '-');
            $news->category_id = $request['category'];
            $news->content_news = $request['contentNews'];
            $news->author = $request->user()->name;
            $news->status = $request['status'];
        }
        if ($request->hasFile('images')) {
            $files = $request->file('images');
            $paths = [];
            if ($news->image && Storage::disk('public')->exists('news/' . $news->image)) {
                Storage::disk('public')->delete('news/' . $news->image);
            }
            foreach ($files as $key => $file) {
                $path = $request['titleNews'] . '_' . time() . '_' . $key . '.' . $file->getClientOriginalExtension();
                $image = Image::make($file);
                $image->resize(800, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
                Storage::disk('public')->put('news/' . $path, (string) $image->encode());
                $paths[] = $path;

                // Lưu ảnh đầu tiên vào trường images của bảng products
                if ($key == 0) {
                    $news->image = $path;
                    $news->save();
                } else {
                    $newsImages = NewsImages::where('news_id', '=', $news->id)->first();

                    if ($newsImages) {
                        // Nếu có bản ghi ảnh cho sản phẩm này trong bảng product_images
                        if ($newsImages->image && Storage::disk('public')->exists('news/' . $newsImages->image)) {
                            // Nếu có ảnh trong bảng và tồn tại file ảnh trên disk, thực hiện xóa ảnh cũ
                            Storage::disk('public')->delete('news/' . $newsImages->image);
                        }
                        // Cập nhật thông tin ảnh mới vào bảng
                        $newsImages->image = $path;
                        $newsImages->author = $request->user()->name;
                        $newsImages->status = $request['status'];
                        $newsImages->save();
                    } else {
                        // Nếu không có bản ghi ảnh cho sản phẩm này trong bảng product_images, thêm bản ghi mới
                        $newsImages = new NewsImages();
                        $newsImages->news_id = $news->id;
                        $newsImages->image = $path;
                        $newsImages->author = $request->user()->name;
                        $newsImages->status = $request['status'];
                        $newsImages->save();
                    }
                }
            }
            return response()->json([
                'status' => 'Update successfully',
                'news' => $news
            ], 200);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $news = News::find($id);
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        // Kiểm tra xem có tồn tại News không
        if (!$news) {
            return response()->json(['message' => 'News not found.'], 404);
        }
        $newsImages = NewsImages::where('news_id', $id)->get();
        if (!$newsImages->isEmpty()) {
            NewsImages::where('news_id', $id)->update(['status' => 0]);
        }
        $news->deleted_at = $now;
        $news->status = 0;
        $news->save();

        return response()->json(['message' => 'News have been softly deleted.']);
    }

    public function destroyALL(Request $request)
    {
        $ids = $request['ids'];
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        foreach ($ids as $id) {
            $news = News::find($id);

            // Kiểm tra xem có tồn tại Category không
            if (!$news) {
                $restoredUsers[] = ['id' => $id, 'message' => 'News not found.'];
                continue;
            }

            $newsImages = NewsImages::where('news_id', $id)->get();
            if (!$newsImages->isEmpty()) {
                NewsImages::where('news_id', $id)->update(['status' => 0]);
            }

            $news->deleted_at = $now;
            $news->status = 0;
            $news->save();
        }

        return response()->json(['message' => 'Categories and their products have been softly deleted.']);
    }

    public function trash()
    {
        $news = News::onlyTrashed()->get();
        return $news;
    }

    public function restore($id)
    {
        $news = News::withTrashed()->find($id);
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        // Kiểm tra xem có tồn tại News không
        if (!$news) {
            return response()->json(['message' => 'News not found.'], 404);
        }

        $newsImages = NewsImages::where('news_id', $id)->get();
        if (!$newsImages->isEmpty()) {
            NewsImages::where('news_id', $id)->update(['status' => 1]);
        }

        $news->status = 1;
        $news->restore();

        return response()->json(['message' => 'News and its products have been softly restore.']);
    }

    public function restoreAll(Request $request)
    {
        $ids = $request['ids'];

        foreach ($ids as $id) {
            $news = News::withTrashed()->find($id);

            // Kiểm tra xem có tồn tại news không
            if (!$news) {
                $restoredUsers[] = ['id' => $id, 'message' => 'News not found.'];
                continue;
            }

            $newsImages = NewsImages::where('news_id', $id)->get();
            if (!$newsImages->isEmpty()) {
                NewsImages::where('news_id', $id)->update(['status' => 1]);
            }

            $news->status = 1;
            $news->restore();
        }

        return response()->json(['message' => 'News have been softly restored.']);
    }

    public function remove($id)
    {
        $news = News::withTrashed()->findOrFail($id);

        if (!$news) {
            return response()->json(['message' => 'News not found.'], 404);
        }

        if (!$news->trashed()) {
            return response()->json(['message' => 'News is not deleted.']);
        }

        // Xóa ảnh đại diện của news nếu có
        if ($news->image && Storage::disk('public')->exists('news/' . $news->image)) {
            Storage::disk('public')->delete('news/' . $news->image);
        }

        $news_image = NewsImages::where('news_id', $id)->get();

        if ($news_image->isNotEmpty()) {
            foreach ($news_image as $image) {
                if ($image->image && Storage::disk('public')->exists('news/' . $image->image)) {
                    Storage::disk('public')->delete('news/' . $image->image);
                    $image->delete();
                }
            }
        }

        $news->forceDelete();
        return response()->json(['message' => 'News have been permanently deleted.']);
    }

    public function removeALL(Request $request)
    {
        $ids = $request['ids'];

        foreach ($ids as $id) {

            $news = News::withTrashed()->findOrFail($id);

            if (!$news) {
                $restoredUsers[] = ['id' => $id, 'message' => 'News not found.'];
                continue;
            }

            if (!$news->trashed()) {
                return response()->json(['message' => 'News is not deleted.']);
            }

            // Xóa ảnh đại diện của category nếu có
            if ($news->image && Storage::disk('public')->exists('news/' . $news->image)) {
                Storage::disk('public')->delete('news/' . $news->image);
            }

            $news_image = NewsImages::where('news_id', $id)->get();

            if ($news_image->isNotEmpty()) {
                foreach ($news_image as $image) {
                    if ($image->image && Storage::disk('public')->exists('news/' . $image->image)) {
                        Storage::disk('public')->delete('news/' . $image->image);
                        $image->delete();
                    }
                }
            }

            $news->forceDelete();
        }

        return response()->json(['message' => 'News have been permanently deleted.']);
    }
}
