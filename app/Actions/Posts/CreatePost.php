<?php

namespace App\Actions\Posts;

use App\Actions\Content\RenderMarkdownToHtml;
use App\Models\Post;
use App\Models\User;
use App\Services\PostService;
use Illuminate\Support\Facades\Cache;

class CreatePost
{
    public function __construct(private readonly RenderMarkdownToHtml $renderMarkdown) {}

    public function handle(User $author, array $data): Post
    {
        $post = Post::create([
            'author_id' => $author->id,
            'cover_photo_id' => $data['cover_photo_id'] ?? null,
            'status' => $data['status'],
            'published_at' => $data['status'] === 'published' ? ($data['published_at'] ?? now()) : $data['published_at'] ?? null,
        ]);

        foreach ($data['translations'] as $translation) {
            $post->translations()->create([
                'locale' => $translation['locale'],
                'title' => $translation['title'],
                'slug' => $translation['slug'],
                'excerpt' => $translation['excerpt'] ?? null,
                'body_md' => $translation['body_md'],
                'body_html' => $this->renderMarkdown->handle($translation['body_md']),
                'meta_title' => $translation['meta_title'] ?? null,
                'meta_description' => $translation['meta_description'] ?? null,
            ]);
        }

        $post->tags()->sync($data['tags'] ?? []);

        Cache::tags([PostService::CACHE_TAG])->flush();

        return $post;
    }
}
