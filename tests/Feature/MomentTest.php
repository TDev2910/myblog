<?php

use App\Models\Moment;

test('the moments feed only shows published moments', function () {
    $published = Moment::factory()->published()->create(['caption' => 'Published one']);
    Moment::factory()->create(['caption' => 'Still a draft', 'status' => 'draft']);

    $this->get(route('moments.index'))
        ->assertInertia(fn ($page) => $page
            ->component('moments/index')
            ->has('moments.data', 1)
            ->where('moments.data.0.id', $published->id)
        );
});

test('a guest can react to and comment on a moment', function () {
    $moment = Moment::factory()->published()->create();
    $user = \App\Models\User::factory()->create();

    $this->actingAs($user)
        ->post(route('likes.toggle'), ['likeable_type' => 'moment', 'likeable_id' => $moment->id, 'reaction' => 'love'])
        ->assertRedirect();

    expect(\App\Models\Like::where('likeable_id', $moment->id)->where('likeable_type', Moment::class)->exists())->toBeTrue();

    $this->actingAs($user)
        ->post(route('comments.store'), ['commentable_type' => 'moment', 'commentable_id' => $moment->id, 'body' => 'Đáng yêu quá'])
        ->assertRedirect();

    expect(\App\Models\Comment::where('commentable_id', $moment->id)->where('commentable_type', Moment::class)->exists())->toBeTrue();
});
