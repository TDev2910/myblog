<?php

namespace App\Services;

use App\Models\Post;
use App\Models\PostTranslation;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

class PostService
{
    public const CACHE_TAG = 'posts';

    /**
     * Guest requests (no personalized "liked" state) are cached; authenticated
     * requests always hit the database so `liked_by_user` stays accurate.
     */
    public function paginatePublished(?string $tag = null, ?string $query = null, int $perPage = 12): LengthAwarePaginator
    {
        if (auth()->check()) {
            return $this->queryPublished($tag, $query, $perPage);
        }

        $page = (int) request()->query('page', 1);
        $key = 'posts:index:'.md5(json_encode([$tag, $query, $page, $perPage]));

        return Cache::tags([self::CACHE_TAG])->remember(
            $key,
            now()->addMinutes(10),
            fn () => $this->queryPublished($tag, $query, $perPage),
        );
    }

    private function queryPublished(?string $tag, ?string $query, int $perPage): LengthAwarePaginator
    {
        return $this->withEngagement(Post::query()->published())
            ->when($tag, fn ($q) => $q->whereHas('tags', fn ($qq) => $qq->where('slug', $tag)))
            ->when($query, fn ($q) => $q->whereIn('id', $this->matchingPostIds($query)))
            ->with(['author', 'translations', 'tags'])
            ->orderByDesc('published_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Full-text-ish search across all locales' title/excerpt/body via Scout's
     * database engine, resolved back to the parent posts.
     */
    private function matchingPostIds(string $term): \Illuminate\Support\Collection
    {
        return PostTranslation::search($term)->keys()
            ->pipe(fn ($ids) => PostTranslation::whereIn('id', $ids)->pluck('post_id')->unique());
    }

    public function findPublishedBySlug(string $locale, string $slug): ?Post
    {
        $post = $this->withEngagement(Post::query()->published())
            ->whereHas('translations', fn ($q) => $q->where('locale', $locale)->where('slug', $slug))
            ->with(['author', 'translations', 'tags', 'coverPhoto', 'comments'])
            ->first();

        if ($post) {
            $this->attachReactionSummary($post);
        }

        return $post;
    }

    /**
     * Per-reaction-type counts and the current user's own reaction, for the
     * reaction picker on the post/album show page. Only run for a single
     * model (not list pages), so this stays a couple of cheap extra queries.
     */
    private function attachReactionSummary(Post $post): void
    {
        $post->reaction_counts = $post->likes()
            ->selectRaw('reaction, count(*) as count')
            ->groupBy('reaction')
            ->pluck('count', 'reaction')
            ->toArray();

        $post->my_reaction = auth()->check()
            ? $post->likes()->where('user_id', auth()->id())->value('reaction')
            : null;
    }

    private function withEngagement(Builder $query): Builder
    {
        return $query
            ->withCount(['comments', 'likes'])
            ->withExists(['likes as liked_by_user' => fn ($q) => $q->where('user_id', auth()->id())])
            ->withExists(['bookmarks as is_bookmarked' => fn ($q) => $q->where('user_id', auth()->id())]);
    }

    public function related(Post $post, int $limit = 4): \Illuminate\Support\Collection
    {
        $tagIds = $post->tags->pluck('id');

        if ($tagIds->isEmpty()) {
            return collect();
        }

        return Post::query()
            ->published()
            ->whereKeyNot($post->id)
            ->whereHas('tags', fn ($q) => $q->whereIn('tags.id', $tagIds))
            ->with(['author', 'translations'])
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get();
    }
}
