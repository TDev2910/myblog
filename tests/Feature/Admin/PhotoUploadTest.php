<?php

use App\Models\Photo;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::findOrCreate('author');
    Storage::fake('public');
    Storage::fake('local');
});

test('an author can upload a photo and it gets processed into 3 sizes', function () {
    $author = User::factory()->create();
    $author->assignRole('author');

    $file = UploadedFile::fake()->image('photo.jpg', 1600, 1200);

    $response = $this->actingAs($author)
        ->post(route('admin.photos.upload'), ['file' => $file])
        ->assertOk();

    $photo = Photo::findOrFail($response->json('photo.id'));

    expect($photo->disk)->toBe('public');
    expect($photo->thumb_path)->not->toBeNull();
    expect($photo->medium_path)->not->toBeNull();
    expect($photo->width)->toBe(1600);

    Storage::disk('public')->assertExists($photo->thumb_path);
    Storage::disk('public')->assertExists($photo->medium_path);
    Storage::disk('public')->assertExists($photo->path);

    // The frontend (markdown editor image insert, album cover picker) reads
    // these computed URLs straight from the JSON response — they must be
    // appended to the model's serialization, not just accessible in PHP.
    expect($response->json('photo.thumb_url'))->not->toBeNull();
    expect($response->json('photo.medium_url'))->not->toBeNull();
    expect($response->json('photo.full_url'))->not->toBeNull();
});

test('uploading a non-image file is rejected', function () {
    $author = User::factory()->create();
    $author->assignRole('author');

    $file = UploadedFile::fake()->create('malware.php', 10, 'application/x-php');

    $this->actingAs($author)
        ->post(route('admin.photos.upload'), ['file' => $file])
        ->assertSessionHasErrors('file');

    expect(Photo::count())->toBe(0);
});

test('a guest cannot upload a photo', function () {
    $file = UploadedFile::fake()->image('photo.jpg');

    $this->post(route('admin.photos.upload'), ['file' => $file])
        ->assertRedirect(route('login'));
});
