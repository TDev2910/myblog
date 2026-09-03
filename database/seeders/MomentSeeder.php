<?php

namespace Database\Seeders;

use App\Models\Moment;
use App\Models\Photo;
use Illuminate\Database\Seeder;

class MomentSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Moment::factory(15)
            ->published()
            ->create()
            ->each(function (Moment $moment) {
                $moment->author->assignRole('author');

                if (fake()->boolean(70)) {
                    Photo::factory(fake()->numberBetween(1, 4))->create([
                        'moment_id' => $moment->id,
                        'uploader_id' => $moment->author_id,
                        'album_id' => null,
                    ]);
                }
            });
    }
}
