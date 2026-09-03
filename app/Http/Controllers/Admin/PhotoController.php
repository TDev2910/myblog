<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Photos\UploadPhoto;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadPhotoRequest;
use Illuminate\Http\JsonResponse;

class PhotoController extends Controller
{
    public function upload(UploadPhotoRequest $request, UploadPhoto $uploadPhoto): JsonResponse
    {
        $photo = $uploadPhoto->handle(
            $request->user(),
            $request->file('file'),
            $request->integer('album_id') ?: null,
            $request->string('caption')->value() ?: null,
        );

        return response()->json(['photo' => $photo]);
    }
}
