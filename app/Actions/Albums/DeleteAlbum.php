<?php

namespace App\Actions\Albums;

use App\Models\Album;
use App\Services\AlbumService;
use Illuminate\Support\Facades\Cache;

class DeleteAlbum
{
    public function handle(Album $album): void
    {
        $album->delete();

        Cache::tags([AlbumService::CACHE_TAG])->flush();
    }
}
