<?php

namespace App\Actions\Albums;

use App\Models\Album;
use App\Models\Photo;
use App\Services\AlbumService;
use Illuminate\Support\Facades\Cache;

class UpdateAlbum
{
    public function handle(Album $album, array $data): Album
    {
        $album->update([
            'status' => $data['status'],
            'published_at' => $data['status'] === 'published' ? ($data['published_at'] ?? $album->published_at ?? now()) : $data['published_at'] ?? null,
            'cover_photo_id' => $data['cover_photo_id'] ?? $album->cover_photo_id,
        ]);

        foreach ($data['translations'] as $translation) {
            $album->translations()->updateOrCreate(
                ['locale' => $translation['locale']],
                [
                    'title' => $translation['title'],
                    'slug' => $translation['slug'],
                    'description' => $translation['description'] ?? null,
                ],
            );
        }

        $submittedLocales = collect($data['translations'])->pluck('locale');
        $album->translations()->whereNotIn('locale', $submittedLocales)->delete();

        $album->tags()->sync($data['tags'] ?? []);

        if (! empty($data['photo_ids'])) {
            Photo::whereIn('id', $data['photo_ids'])->update(['album_id' => $album->id]);
        }

        Cache::tags([AlbumService::CACHE_TAG])->flush();

        return $album->refresh();
    }
}
