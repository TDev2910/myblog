<?php

use App\Models\Bookmark;
use App\Models\Post;
use App\Models\User;

test('an authenticated user can bookmark and un-bookmark a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->published()->create();

    $this->actingAs($user)
        ->post(route('bookmarks.toggle'), ['bookmarkable_type' => 'post', 'bookmarkable_id' => $post->id])
        ->assertRedirect();

    expect(Bookmark::where('bookmarkable_id', $post->id)->where('user_id', $user->id)->exists())->toBeTrue();

    $this->actingAs($user)
        ->post(route('bookmarks.toggle'), ['bookmarkable_type' => 'post', 'bookmarkable_id' => $post->id])
        ->assertRedirect();

    expect(Bookmark::where('bookmarkable_id', $post->id)->where('user_id', $user->id)->exists())->toBeFalse();
});

test('a guest cannot bookmark a post', function () {
    $post = Post::factory()->published()->create();

    $this->post(route('bookmarks.toggle'), ['bookmarkable_type' => 'post', 'bookmarkable_id' => $post->id])
        ->assertRedirect(route('login'));

    expect(Bookmark::count())->toBe(0);
});

test('the bookmarks index only shows the current user\'s saved items', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $myPost = Post::factory()->published()->create();
    $otherPost = Post::factory()->published()->create();

    Bookmark::factory()->create(['user_id' => $user->id, 'bookmarkable_type' => Post::class, 'bookmarkable_id' => $myPost->id]);
    Bookmark::factory()->create(['user_id' => $otherUser->id, 'bookmarkable_type' => Post::class, 'bookmarkable_id' => $otherPost->id]);

    $this->actingAs($user)
        ->get(route('bookmarks.index'))
        ->assertInertia(fn ($page) => $page
            ->component('bookmarks/index')
            ->has('posts', 1)
            ->where('posts.0.id', $myPost->id)
        );
});
