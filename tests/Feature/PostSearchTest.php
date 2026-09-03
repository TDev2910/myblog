<?php

use App\Models\Post;
use App\Models\PostTranslation;

test('searching finds posts by title', function () {
    $post = Post::factory()->published()->create();
    PostTranslation::factory()->for($post)->create(['locale' => 'vi', 'title' => 'Hướng dẫn Laravel 12']);

    $other = Post::factory()->published()->create();
    PostTranslation::factory()->for($other)->create(['locale' => 'vi', 'title' => 'Công thức nấu ăn']);

    $this->get(route('posts.index', ['q' => 'Laravel']))
        ->assertInertia(fn ($page) => $page
            ->component('posts/index')
            ->has('posts.data', 1)
            ->where('posts.data.0.id', $post->id)
        );
});

test('search with no matches returns an empty list, not an error', function () {
    $this->get(route('posts.index', ['q' => 'nonexistent-term-xyz']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('posts.data', 0));
});
