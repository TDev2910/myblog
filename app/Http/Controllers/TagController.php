<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(Request $request): Response
    {
        $tags = Tag::query()
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->orderByDesc('posts_count')
            ->get();

        $active = $request->string('tag')->value() ?: null;

        $posts = $active
            ? Post::query()
                ->published()
                ->whereHas('tags', fn ($q) => $q->where('slug', $active))
                ->with(['author', 'translations', 'tags'])
                ->orderByDesc('published_at')
                ->paginate(12)
                ->withQueryString()
            : null;

        return Inertia::render('subjects/index', [
            'tags' => $tags,
            'activeTag' => $active,
            'posts' => $posts,
        ]);
    }
}
