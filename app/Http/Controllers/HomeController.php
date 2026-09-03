<?php

namespace App\Http\Controllers;

use App\Models\Album;
use App\Models\Moment;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $posts = Post::query()
            ->published()
            ->with(['author', 'translations', 'tags', 'coverPhoto'])
            ->orderByDesc('published_at')
            ->limit(6)
            ->get();

        $albums = Album::query()
            ->published()
            ->with(['author', 'translations', 'coverPhoto'])
            ->orderByDesc('published_at')
            ->limit(6)
            ->get();

        $moments = Moment::query()
            ->published()
            ->with(['author', 'photos'])
            ->orderByDesc('published_at')
            ->limit(6)
            ->get();

        $bento = $posts->take(3)->map(fn ($post) => ['type' => 'post', 'item' => $post, 'published_at' => $post->published_at])
            ->concat($albums->take(3)->map(fn ($album) => ['type' => 'album', 'item' => $album, 'published_at' => $album->published_at]))
            ->concat($moments->take(4)->map(fn ($moment) => ['type' => 'moment', 'item' => $moment, 'published_at' => $moment->published_at]))
            ->sortByDesc('published_at')
            ->take(8)
            ->values();

        return Inertia::render('home', [
            'bento' => $bento,
            'posts' => $posts,
            'albums' => $albums,
        ]);
    }
}
