<?php

namespace App\Http\Controllers\Api;

use App\Models\Contact;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contact = Contact::where('status', 1)->get();

        return response()->json($contact);
    }


    public function store(Request $request)
    {
        $id = random_int(0, 9999999999);
        $contact_id = str_pad($id, 10, '0', STR_PAD_LEFT);
        if (strlen($contact_id) > 10) {
            $contact_id = substr($contact_id, 0, 10);
        }
        $contact = Contact::create([
            'contact_id' => $contact_id,
            'user_id' => $request->user()->id,
            'name_contact' => $request['name'],
            'email_contact' => $request['email'],
            'phone_contact' => $request['phone'],
            'comments_contact' => $request['comment'],
            'author' => $request->user()->name,
            'status' => '1'
        ]);
        return response()->json([
            'message' => 'Chúng tôi sẽ liên hệ với bạn ngay khi có thể!',
            'contact' => $contact
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $contact = Contact::find($id);
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        // Kiểm tra xem có tồn tại Category không
        if (!$contact) {
            return response()->json(['message' => 'Contact not found.'], 404);
        }
        $contact->deleted_at = $now;
        $contact->status = 0;
        $contact->save();

        return response()->json(['message' => 'Contact have been softly deleted.']);
    }

    public function destroyALL(Request $request)
    {
        $ids = $request['ids'];
        $now = Carbon::now('Asia/Ho_Chi_Minh');

        foreach ($ids as $id) {
            $contact = Contact::find($id);

            // Kiểm tra xem có tồn tại Category không
            if (!$contact) {
                $restoredUsers[] = ['id' => $id, 'message' => 'Contact not found.'];
                continue;
            }
            $contact->deleted_at = $now;
            $contact->status = 0;
            $contact->save();
        }

        return response()->json(['message' => 'Categories contact have been softly deleted.']);
    }

    public function trash()
    {
        $contact = Contact::onlyTrashed()->get();
        return $contact;
    }

    public function restore($id)
    {
        $contact = Contact::withTrashed()->find($id);

        // Kiểm tra xem có tồn tại Category không
        if (!$contact) {
            return response()->json(['message' => 'Contact not found.'], 404);
        }

        $contact->status = 1;
        $contact->restore();

        return response()->json(['message' => 'Contact have been softly restore.']);
    }

    public function restoreAll(Request $request)
    {
        $ids = $request['ids'];

        foreach ($ids as $id) {
            $contact = Contact::withTrashed()->find($id);

            // Kiểm tra xem có tồn tại Category không
            if (!$contact) {
                $restoredUsers[] = ['id' => $id, 'message' => 'Contact not found.'];
                continue;
            }
            $contact->status = 1;
            $contact->restore();
        }
        return response()->json(['message' => 'Contact have been softly restored.']);
    }

    public function remove($id)
    {
        $contact = Contact::withTrashed()->findOrFail($id);

        if (!$contact) {
            return response()->json(['message' => 'Contact not found.'], 404);
        }

        if (!$contact->trashed()) {
            return response()->json(['message' => 'Contact is not deleted.']);
        }

        $contact->forceDelete();
        return response()->json(['message' => 'Contact have been permanently deleted.']);
    }

    public function removeALL(Request $request)
    {
        $ids = $request['ids'];

        foreach ($ids as $id) {

            $contact = Contact::withTrashed()->findOrFail($id);

            if (!$contact) {
                $restoredUsers[] = ['id' => $id, 'message' => 'Category not found.'];
                continue;
            }

            if (!$contact->trashed()) {
                return response()->json(['message' => 'Contact is not deleted.']);
            }

            $contact->forceDelete();
        }

        return response()->json(['message' => 'Contact have been permanently deleted.']);
    }
}
