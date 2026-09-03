<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostTranslation;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $tags = Tag::factory(8)->create();

        Post::factory(20)
            ->published()
            ->create()
            ->each(function (Post $post) use ($tags) {
                $post->author->assignRole('author');

                PostTranslation::factory()->for($post)->create(['locale' => 'vi']);
                PostTranslation::factory()->for($post)->create(['locale' => 'en']);

                $post->tags()->attach($tags->random(rand(1, 3))->pluck('id'));
            });
    }
}
