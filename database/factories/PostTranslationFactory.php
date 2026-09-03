<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\PostTranslation>
 */
class PostTranslationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence();

        return [
            'post_id' => Post::factory(),
            'locale' => 'vi',
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::random(6),
            'excerpt' => fake()->text(150),
            'body_md' => implode("\n\n", fake()->paragraphs(5)),
            'body_html' => implode('', array_map(fn (string $p) => "<p>{$p}</p>", fake()->paragraphs(5))),
            'meta_title' => null,
            'meta_description' => null,
        ];
    }
}
