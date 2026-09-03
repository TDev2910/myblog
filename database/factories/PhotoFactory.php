<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Photo>
 */
class PhotoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'album_id' => null,
            'uploader_id' => User::factory(),
            'disk' => 'public',
            'path' => 'photos/'.fake()->uuid().'.webp',
            'thumb_path' => 'photos/thumb/'.fake()->uuid().'.webp',
            'medium_path' => 'photos/medium/'.fake()->uuid().'.webp',
            'width' => 2000,
            'height' => 1333,
            'size_bytes' => fake()->numberBetween(50_000, 3_000_000),
            'mime' => 'image/webp',
            'taken_at' => fake()->dateTimeBetween('-2 years'),
            'caption' => fake()->boolean(50) ? fake()->sentence() : null,
            'sort_order' => 0,
        ];
    }
}
