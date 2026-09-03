<?php

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;

test('an authenticated user can comment on a published post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->published()->create();

    $this->actingAs($user)
        ->post(route('comments.store'), [
            'commentable_type' => 'post',
            'commentable_id' => $post->id,
            'body' => 'Great article!',
        ])
        ->assertRedirect();

    expect(Comment::where('commentable_id', $post->id)->where('user_id', $user->id)->exists())->toBeTrue();
});

test('a guest cannot comment', function () {
    $post = Post::factory()->published()->create();

    $this->post(route('comments.store'), [
        'commentable_type' => 'post',
        'commentable_id' => $post->id,
        'body' => 'Great article!',
    ])->assertRedirect(route('login'));

    expect(Comment::count())->toBe(0);
});

test('a user cannot delete another user\'s comment', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $comment = Comment::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($intruder)
        ->delete(route('comments.destroy', $comment))
        ->assertForbidden();

    expect(Comment::find($comment->id))->not->toBeNull();
});

test('an admin can delete any comment', function () {
    \Spatie\Permission\Models\Role::findOrCreate('admin');

    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $comment = Comment::factory()->create();

    $this->actingAs($admin)
        ->delete(route('comments.destroy', $comment))
        ->assertRedirect();

    expect(Comment::find($comment->id))->toBeNull();
});
