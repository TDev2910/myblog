<?php

use App\Models\Album;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::findOrCreate('author');
    Role::findOrCreate('admin');
});

test('an author can create an album', function () {
    $author = User::factory()->create();
    $author->assignRole('author');

    $this->actingAs($author)
        ->post(route('admin.albums.store'), [
            'status' => 'published',
            'published_at' => now()->toDateTimeString(),
            'tags' => [],
            'photo_ids' => [],
            'translations' => [
                ['locale' => 'vi', 'title' => 'Album đầu tiên', 'slug' => 'album-dau-tien', 'description' => 'Mô tả'],
            ],
        ])
        ->assertRedirect();

    $album = Album::first();
    expect($album->author_id)->toBe($author->id);
    expect($album->translations()->first()->slug)->toBe('album-dau-tien');
});

test('an author cannot delete another author\'s album', function () {
    $owner = User::factory()->create();
    $owner->assignRole('author');
    $intruder = User::factory()->create();
    $intruder->assignRole('author');

    $album = Album::factory()->create(['author_id' => $owner->id]);

    $this->actingAs($intruder)
        ->delete(route('admin.albums.destroy', $album))
        ->assertForbidden();

    expect(Album::find($album->id))->not->toBeNull();
});
