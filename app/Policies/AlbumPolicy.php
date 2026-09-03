<?php

namespace App\Policies;

use App\Models\Album;
use App\Models\User;

class AlbumPolicy
{
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['author', 'admin']);
    }

    public function update(User $user, Album $album): bool
    {
        return $user->id === $album->author_id;
    }

    public function delete(User $user, Album $album): bool
    {
        return $user->id === $album->author_id;
    }
}
