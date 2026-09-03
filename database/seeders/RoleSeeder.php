<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach (['admin', 'author', 'reader'] as $role) {
            Role::findOrCreate($role);
        }
    }
}
