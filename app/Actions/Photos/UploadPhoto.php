<?php

namespace App\Actions\Photos;

use App\Jobs\ProcessPhoto;
use App\Models\Photo;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadPhoto
{
    public function handle(User $uploader, UploadedFile $file, ?int $albumId, ?string $caption): Photo
    {
        $tempPath = $file->storeAs('photos/incoming', Str::uuid().'.'.$file->extension(), 'local');

        $photo = Photo::create([
            'album_id' => $albumId,
            'uploader_id' => $uploader->id,
            'disk' => 'local',
            'path' => $tempPath,
            'size_bytes' => $file->getSize(),
            'mime' => $file->getMimeType(),
            'caption' => $caption,
        ]);

        // Dispatched synchronously: a personal blog's upload volume doesn't
        // warrant a queue worker, and the caller needs the resulting URLs
        // immediately (e.g. to insert the image into the post editor).
        ProcessPhoto::dispatchSync($photo->id, $tempPath);

        return $photo->fresh();
    }
}
