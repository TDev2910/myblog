<?php

use App\Models\Post;

test('the guest post list is cached and busted when a new post is published', function () {
    Post::factory()->published()->create();

    $this->get(route('posts.index'))->assertInertia(fn ($page) => $page->has('posts.data', 1));

    // Insert directly, bypassing the cache-busting action, to prove the
    // second request is served from cache rather than hitting the database.
    Post::factory()->published()->create();

    $this->get(route('posts.index'))->assertInertia(fn ($page) => $page->has('posts.data', 1));

    // Now go through the real action, which must flush the cache tag.
    $author = \App\Models\User::factory()->create();
    \Spatie\Permission\Models\Role::findOrCreate('author');
    $author->assignRole('author');

    app(\App\Actions\Posts\CreatePost::class)->handle($author, [
        'status' => 'published',
        'published_at' => now(),
        'translations' => [
            ['locale' => 'vi', 'title' => 'Bai moi', 'slug' => 'bai-moi', 'body_md' => 'noi dung'],
        ],
    ]);

    $this->get(route('posts.index'))->assertInertia(fn ($page) => $page->has('posts.data', 3));
});
