<?php

namespace Database\Factories;

use App\Models\Album;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\AlbumTranslation>
 */
class AlbumTranslationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'album_id' => Album::factory(),
            'locale' => 'vi',
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::random(6),
            'description' => fake()->text(200),
        ];
    }
}
