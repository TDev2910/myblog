<?php

namespace App\Actions\Posts;

use App\Models\Post;
use App\Services\PostService;
use Illuminate\Support\Facades\Cache;

class DeletePost
{
    public function handle(Post $post): void
    {
        $post->delete();

        Cache::tags([PostService::CACHE_TAG])->flush();
    }
}
