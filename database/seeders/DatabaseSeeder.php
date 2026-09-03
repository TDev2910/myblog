<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        // User::factory(10)->create();

        $admin = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        $admin->assignRole('admin');

        $this->call(PostSeeder::class);
        $this->call(AlbumSeeder::class);
        $this->call(MomentSeeder::class);
    }
}
