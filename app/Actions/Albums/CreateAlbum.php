<?php

namespace App\Actions\Albums;

use App\Models\Album;
use App\Models\Photo;
use App\Models\User;
use App\Services\AlbumService;
use Illuminate\Support\Facades\Cache;

class CreateAlbum
{
    public function handle(User $author, array $data): Album
    {
        $album = Album::create([
            'author_id' => $author->id,
            'status' => $data['status'],
            'published_at' => $data['status'] === 'published' ? ($data['published_at'] ?? now()) : $data['published_at'] ?? null,
        ]);

        foreach ($data['translations'] as $translation) {
            $album->translations()->create([
                'locale' => $translation['locale'],
                'title' => $translation['title'],
                'slug' => $translation['slug'],
                'description' => $translation['description'] ?? null,
            ]);
        }

        $album->tags()->sync($data['tags'] ?? []);

        if (! empty($data['photo_ids'])) {
            Photo::whereIn('id', $data['photo_ids'])->update(['album_id' => $album->id]);
        }

        if (! empty($data['cover_photo_id'])) {
            $album->update(['cover_photo_id' => $data['cover_photo_id']]);
        }

        Cache::tags([AlbumService::CACHE_TAG])->flush();

        return $album;
    }
}
