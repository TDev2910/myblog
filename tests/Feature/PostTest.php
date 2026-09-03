<?php

use App\Models\Post;
use App\Models\PostTranslation;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\QueryException;

test('a post can be created with translations and tags', function () {
    $author = User::factory()->create();
    $tag = Tag::factory()->create();

    $post = Post::factory()->published()->for($author, 'author')->create();
    $translation = PostTranslation::factory()->for($post)->create(['locale' => 'vi']);
    $post->tags()->attach($tag);

    expect($post->fresh(['author', 'translations', 'tags']))
        ->author->id->toBe($author->id)
        ->translations->toHaveCount(1)
        ->tags->toHaveCount(1);

    expect($translation->post->id)->toBe($post->id);
    expect($post->status)->toBe('published');
    expect($post->published_at)->not->toBeNull();
});

test('a post cannot have two translations for the same locale', function () {
    $post = Post::factory()->create();
    PostTranslation::factory()->for($post)->create(['locale' => 'vi']);

    PostTranslation::factory()->for($post)->create(['locale' => 'vi']);
})->throws(QueryException::class);

test('two post translations cannot share the same locale and slug', function () {
    PostTranslation::factory()->create(['locale' => 'vi', 'slug' => 'bai-viet-dau-tien']);

    PostTranslation::factory()->create(['locale' => 'vi', 'slug' => 'bai-viet-dau-tien']);
})->throws(QueryException::class);
