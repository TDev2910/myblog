<?php

use App\Models\Moment;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::findOrCreate('author');
    Role::findOrCreate('admin');
});

test('an author can create a moment with just a caption', function () {
    $author = User::factory()->create();
    $author->assignRole('author');

    $this->actingAs($author)
        ->post(route('admin.moments.store'), [
            'caption' => 'Chiều nay trời đẹp quá',
            'mood' => 'calm',
            'status' => 'published',
        ])
        ->assertRedirect();

    $moment = Moment::first();
    expect($moment->author_id)->toBe($author->id);
    expect($moment->caption)->toBe('Chiều nay trời đẹp quá');
    expect($moment->mood)->toBe('calm');
});

test('a moment requires either a caption or a photo', function () {
    $author = User::factory()->create();
    $author->assignRole('author');

    $this->actingAs($author)
        ->post(route('admin.moments.store'), ['status' => 'draft'])
        ->assertSessionHasErrors('caption');

    expect(Moment::count())->toBe(0);
});

test('a reader without author role cannot create a moment', function () {
    $reader = User::factory()->create();

    $this->actingAs($reader)
        ->post(route('admin.moments.store'), ['caption' => 'x', 'status' => 'draft'])
        ->assertForbidden();
});

test('an author cannot edit another author\'s moment', function () {
    $owner = User::factory()->create();
    $owner->assignRole('author');
    $intruder = User::factory()->create();
    $intruder->assignRole('author');

    $moment = Moment::factory()->create(['author_id' => $owner->id]);

    $this->actingAs($intruder)
        ->delete(route('admin.moments.destroy', $moment))
        ->assertForbidden();

    expect(Moment::find($moment->id))->not->toBeNull();
});
