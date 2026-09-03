<?php

namespace App\Http\Controllers;

use App\Services\PostService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function __construct(private readonly PostService $posts) {}

    public function index(Request $request): Response
    {
        $tag = $request->string('tag')->value() ?: null;
        $query = $request->string('q')->value() ?: null;

        return Inertia::render('posts/index', [
            'posts' => $this->posts->paginatePublished($tag, $query),
            'activeTag' => $tag,
            'query' => $query,
        ]);
    }

    public function show(Request $request, string $slug): Response
    {
        $post = $this->posts->findPublishedBySlug(app()->getLocale(), $slug);

        abort_if(! $post, 404);

        $post->increment('view_count');

        return Inertia::render('posts/show', [
            'post' => $post,
            'related' => $this->posts->related($post),
        ]);
    }
}
