<?php

namespace App\Http\Controllers\Api;

use App\Models\News;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CountDown;
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
                        $news->images = $path;
                        $news->save();
                    } else {
                        // Lưu các ảnh còn lại vào bảng product_images
                        $productImage = new ProductImages();
                        $productImage->product_id = $news->id;
                        $productImage->image = $path;
                        $productImage->author = $request->user()->name;
                        $productImage->status = $request['status'];
                        $productImage->save();
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
    public function update(Request $request, News $news)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(News $news)
    {
        //
    }
}
