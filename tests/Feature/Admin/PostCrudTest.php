<?php

use App\Models\Post;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::findOrCreate('author');
    Role::findOrCreate('admin');
});

test('an author can create a post with translations', function () {
    $author = User::factory()->create();
    $author->assignRole('author');

    $this->actingAs($author)
        ->post(route('admin.posts.store'), [
            'status' => 'published',
            'published_at' => now()->toDateTimeString(),
            'tags' => [],
            'translations' => [
                [
                    'locale' => 'vi',
                    'title' => 'Bài viết đầu tiên',
                    'slug' => 'bai-viet-dau-tien',
                    'excerpt' => 'Tóm tắt',
                    'body_md' => '# Xin chào',
                ],
            ],
        ])
        ->assertRedirect();

    $post = Post::first();
    expect($post->author_id)->toBe($author->id);
    expect($post->translations()->first()->body_html)->toContain('<h1>');
});

test('a reader without author role cannot create a post', function () {
    $reader = User::factory()->create();

    $this->actingAs($reader)
        ->post(route('admin.posts.store'), [
            'status' => 'draft',
            'tags' => [],
            'translations' => [
                ['locale' => 'vi', 'title' => 'X', 'slug' => 'x', 'body_md' => 'x'],
            ],
        ])
        ->assertForbidden();

    expect(Post::count())->toBe(0);
});

test('an author cannot edit another author\'s post', function () {
    $owner = User::factory()->create();
    $owner->assignRole('author');
    $intruder = User::factory()->create();
    $intruder->assignRole('author');

    $post = Post::factory()->create(['author_id' => $owner->id]);

    $this->actingAs($intruder)
        ->get(route('admin.posts.edit', $post))
        ->assertForbidden();
});

test('an admin can edit any author\'s post', function () {
    $owner = User::factory()->create();
    $owner->assignRole('author');
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $post = Post::factory()->create(['author_id' => $owner->id]);

    // The admin UI fetches edit data via XHR (X-Inertia header) rather than
    // navigating to a full page — see resources/js/lib/inertia-fetch.ts.
    $version = app(\App\Http\Middleware\HandleInertiaRequests::class)->version(request());

    $this->actingAs($admin)
        ->withHeaders(['X-Inertia' => 'true', 'X-Inertia-Version' => $version])
        ->get(route('admin.posts.edit', $post))
        ->assertOk()
        ->assertJsonPath('props.post.id', $post->id);
});
