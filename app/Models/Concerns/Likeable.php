<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Likeable
{
    public function likes(): MorphMany
    {
        return $this->morphMany(\App\Models\Like::class, 'likeable');
    }

    public function isLikedBy(?\App\Models\User $user): bool
    {
        if (! $user) {
            return false;
        }

        return $this->likes->contains('user_id', $user->id);
    }
}
