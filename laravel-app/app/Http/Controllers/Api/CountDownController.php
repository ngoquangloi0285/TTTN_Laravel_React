<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CountDown;
use Illuminate\Http\Request;

class CountDownController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->has('id')) {
            $id = $request('id');
            $countdown= CountDown::findOrFail($id);
            return $countdown;
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CountDown $brand)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CountDown $brand)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CountDown $brand)
    {
        //
    }
}
