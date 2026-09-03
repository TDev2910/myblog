<?php

namespace Database\Seeders;

use App\Models\Album;
use App\Models\AlbumTranslation;
use App\Models\Photo;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class AlbumSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $tags = Tag::all();

        Album::factory(6)
            ->published()
            ->create()
            ->each(function (Album $album) use ($tags) {
                $album->author->assignRole('author');

                AlbumTranslation::factory()->for($album)->create(['locale' => 'vi']);
                AlbumTranslation::factory()->for($album)->create(['locale' => 'en']);

                $photos = Photo::factory(8)->create(['album_id' => $album->id, 'uploader_id' => $album->author_id]);
                $album->update(['cover_photo_id' => $photos->first()->id]);

                if ($tags->isNotEmpty()) {
                    $album->tags()->attach($tags->random(min(2, $tags->count()))->pluck('id'));
                }
            });
    }
}
