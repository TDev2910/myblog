<?php

namespace App\Policies;

use App\Models\Moment;
use App\Models\User;

class MomentPolicy
{
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['author', 'admin']);
    }

    public function update(User $user, Moment $moment): bool
    {
        return $user->id === $moment->author_id;
    }

    public function delete(User $user, Moment $moment): bool
    {
        return $user->id === $moment->author_id;
    }
}
