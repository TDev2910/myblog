<?php

namespace Database\Factories;

use App\Models\Moment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Moment>
 */
class MomentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'author_id' => User::factory(),
            'caption' => fake()->sentence(fake()->numberBetween(6, 16)),
            'mood' => fake()->randomElement([...Moment::MOODS, null]),
            'location' => fake()->boolean(60) ? fake()->city() : null,
            'song' => fake()->boolean(40) ? fake()->sentence(3) : null,
            'status' => 'draft',
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }
}
