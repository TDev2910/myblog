<?php

use App\Models\Like;
use App\Models\Post;
use App\Models\User;

test('an authenticated user can react and un-react to a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->published()->create();

    $this->actingAs($user)
        ->post(route('likes.toggle'), ['likeable_type' => 'post', 'likeable_id' => $post->id, 'reaction' => 'love'])
        ->assertRedirect();

    expect(Like::where('likeable_id', $post->id)->where('user_id', $user->id)->value('reaction'))->toBe('love');

    // Clicking the same reaction again removes it.
    $this->actingAs($user)
        ->post(route('likes.toggle'), ['likeable_type' => 'post', 'likeable_id' => $post->id, 'reaction' => 'love'])
        ->assertRedirect();

    expect(Like::where('likeable_id', $post->id)->where('user_id', $user->id)->exists())->toBeFalse();
});

test('picking a different reaction switches the type instead of stacking rows', function () {
    $user = User::factory()->create();
    $post = Post::factory()->published()->create();

    $this->actingAs($user)->post(route('likes.toggle'), [
        'likeable_type' => 'post', 'likeable_id' => $post->id, 'reaction' => 'coffee',
    ]);
    $this->actingAs($user)->post(route('likes.toggle'), [
        'likeable_type' => 'post', 'likeable_id' => $post->id, 'reaction' => 'peaceful',
    ]);

    expect(Like::where('likeable_id', $post->id)->where('user_id', $user->id)->count())->toBe(1);
    expect(Like::where('likeable_id', $post->id)->where('user_id', $user->id)->value('reaction'))->toBe('peaceful');
});

test('a guest cannot react to a post', function () {
    $post = Post::factory()->published()->create();

    $this->post(route('likes.toggle'), ['likeable_type' => 'post', 'likeable_id' => $post->id, 'reaction' => 'love'])
        ->assertRedirect(route('login'));

    expect(Like::count())->toBe(0);
});

test('an invalid reaction type is rejected', function () {
    $user = User::factory()->create();
    $post = Post::factory()->published()->create();

    $this->actingAs($user)
        ->post(route('likes.toggle'), ['likeable_type' => 'post', 'likeable_id' => $post->id, 'reaction' => 'angry'])
        ->assertSessionHasErrors('reaction');
});
