<?php

namespace App\Http\Controllers;

use App\Actions\Bookmarks\ToggleBookmark;
use App\Http\Requests\ToggleBookmarkRequest;
use App\Models\Album;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookmarkController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        $posts = Post::query()
            ->published()
            ->whereHas('bookmarks', fn ($q) => $q->where('user_id', $userId))
            ->with(['author', 'translations', 'tags'])
            ->orderByDesc('published_at')
            ->get();

        $albums = Album::query()
            ->published()
            ->whereHas('bookmarks', fn ($q) => $q->where('user_id', $userId))
            ->with(['author', 'translations', 'coverPhoto'])
            ->orderByDesc('published_at')
            ->get();

        return Inertia::render('bookmarks/index', [
            'posts' => $posts,
            'albums' => $albums,
        ]);
    }

    public function toggle(ToggleBookmarkRequest $request, ToggleBookmark $toggleBookmark): RedirectResponse
    {
        $bookmarked = $toggleBookmark->handle(
            $request->user(),
            $request->string('bookmarkable_type')->value(),
            $request->integer('bookmarkable_id'),
        );

        return back()->with('bookmarked', $bookmarked);
    }
}
