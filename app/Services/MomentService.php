<?php

namespace App\Services;

use App\Models\Moment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class MomentService
{
    public const CACHE_TAG = 'moments';

    public function paginatePublished(int $perPage = 12): LengthAwarePaginator
    {
        if (auth()->check()) {
            return $this->queryPublished($perPage);
        }

        $page = (int) request()->query('page', 1);
        $key = 'moments:index:'.md5(json_encode([$page, $perPage]));

        return Cache::tags([self::CACHE_TAG])->remember(
            $key,
            now()->addMinutes(10),
            fn () => $this->queryPublished($perPage),
        );
    }

    private function queryPublished(int $perPage): LengthAwarePaginator
    {
        return Moment::query()
            ->published()
            ->with(['author', 'photos'])
            ->withCount(['comments', 'likes'])
            ->withExists(['likes as liked_by_user' => fn ($q) => $q->where('user_id', auth()->id())])
            ->withExists(['bookmarks as is_bookmarked' => fn ($q) => $q->where('user_id', auth()->id())])
            ->orderByDesc('published_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function find(int $id): ?Moment
    {
        $moment = Moment::query()
            ->published()
            ->with(['author', 'photos', 'comments'])
            ->withCount(['comments', 'likes'])
            ->withExists(['bookmarks as is_bookmarked' => fn ($q) => $q->where('user_id', auth()->id())])
            ->find($id);

        if ($moment) {
            $moment->reaction_counts = $moment->likes()
                ->selectRaw('reaction, count(*) as count')
                ->groupBy('reaction')
                ->pluck('count', 'reaction')
                ->toArray();

            $moment->my_reaction = auth()->check()
                ? $moment->likes()->where('user_id', auth()->id())->value('reaction')
                : null;
        }

        return $moment;
    }
}
