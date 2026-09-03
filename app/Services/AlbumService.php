<?php

namespace App\Services;

use App\Models\Album;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class AlbumService
{
    public const CACHE_TAG = 'albums';

    public function paginatePublished(int $perPage = 12): LengthAwarePaginator
    {
        if (auth()->check()) {
            return $this->queryPublished($perPage);
        }

        $page = (int) request()->query('page', 1);
        $key = 'albums:index:'.md5(json_encode([$page, $perPage]));

        return Cache::tags([self::CACHE_TAG])->remember(
            $key,
            now()->addMinutes(10),
            fn () => $this->queryPublished($perPage),
        );
    }

    private function queryPublished(int $perPage): LengthAwarePaginator
    {
        return Album::query()
            ->published()
            ->with(['author', 'translations', 'coverPhoto'])
            ->orderByDesc('published_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findPublishedBySlug(string $locale, string $slug): ?Album
    {
        $album = Album::query()
            ->published()
            ->whereHas('translations', fn ($q) => $q->where('locale', $locale)->where('slug', $slug))
            ->with(['author', 'translations', 'tags', 'comments', 'photos' => fn ($q) => $q->orderBy('sort_order')])
            ->withCount(['comments', 'likes'])
            ->withExists(['likes as liked_by_user' => fn ($q) => $q->where('user_id', auth()->id())])
            ->withExists(['bookmarks as is_bookmarked' => fn ($q) => $q->where('user_id', auth()->id())])
            ->first();

        if ($album) {
            $album->reaction_counts = $album->likes()
                ->selectRaw('reaction, count(*) as count')
                ->groupBy('reaction')
                ->pluck('count', 'reaction')
                ->toArray();

            $album->my_reaction = auth()->check()
                ? $album->likes()->where('user_id', auth()->id())->value('reaction')
                : null;
        }

        return $album;
    }
}
