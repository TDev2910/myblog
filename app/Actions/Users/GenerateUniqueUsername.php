<?php

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Str;

class GenerateUniqueUsername
{
    public function handle(string $name): string
    {
        $base = Str::slug($name) ?: 'user';
        $username = $base;
        $suffix = 1;

        while (User::where('username', $username)->exists()) {
            $username = "{$base}-{$suffix}";
            $suffix++;
        }

        return $username;
    }
}
