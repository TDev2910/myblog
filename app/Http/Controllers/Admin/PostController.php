<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Posts\CreatePost;
use App\Actions\Posts\DeletePost;
use App\Actions\Posts\UpdatePost;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePostRequest;
use App\Http\Requests\Admin\UpdatePostRequest;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = Post::query()
            ->when(
                ! $request->user()->hasRole('admin'),
                fn ($q) => $q->where('author_id', $request->user()->id),
            )
            ->with(['author', 'translations'])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'tags' => Tag::query()->orderBy('name_vi')->get(),
        ]);
    }

    public function store(StorePostRequest $request, CreatePost $createPost): RedirectResponse
    {
        $createPost->handle($request->user(), $request->validated());

        return redirect()->route('admin.posts.index')->with('success', 'Post created.');
    }

    public function edit(Post $post): Response
    {
        $this->authorize('update', $post);

        return Inertia::render('admin/posts/edit', [
            'post' => $post->load(['translations', 'tags']),
            'tags' => Tag::query()->orderBy('name_vi')->get(),
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post, UpdatePost $updatePost): RedirectResponse
    {
        $updatePost->handle($post, $request->validated());

        return back()->with('success', 'Post updated.');
    }

    public function destroy(Post $post, DeletePost $deletePost): RedirectResponse
    {
        $this->authorize('delete', $post);

        $deletePost->handle($post);

        return redirect()->route('admin.posts.index')->with('success', 'Post deleted.');
    }
}
