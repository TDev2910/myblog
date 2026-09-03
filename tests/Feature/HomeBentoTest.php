<?php

use App\Models\Album;
use App\Models\Moment;
use App\Models\Post;

test('the homepage bento mixes posts, albums and moments sorted by recency', function () {
    Post::factory()->published()->create(['published_at' => now()->subDays(3)]);
    Album::factory()->published()->create(['published_at' => now()->subDays(2)]);
    $newest = Moment::factory()->published()->create(['published_at' => now()->subMinute()]);

    $this->get(route('home'))
        ->assertInertia(fn ($page) => $page
            ->component('home')
            ->has('bento', 3)
            ->where('bento.0.type', 'moment')
            ->where('bento.0.item.id', $newest->id)
        );
});
