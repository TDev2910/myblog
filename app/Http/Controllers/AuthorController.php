<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AuthorController extends Controller
{
    public function index(): Response
    {
        $authors = User::query()
            ->whereHas('posts', fn ($q) => $q->published())
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->orderByDesc('posts_count')
            ->paginate(20);

        return Inertia::render('authors/index', [
            'authors' => $authors,
        ]);
    }

    public function show(string $username): Response
    {
        $author = User::query()->where('username', $username)->firstOrFail();

        $posts = Post::query()
            ->published()
            ->where('author_id', $author->id)
            ->with(['translations', 'tags'])
            ->orderByDesc('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('authors/show', [
            'author' => $author,
            'posts' => $posts,
        ]);
    }
}
