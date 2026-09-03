<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Relations\MorphMany;

trait Commentable
{
    public function comments(): MorphMany
    {
        return $this->morphMany(\App\Models\Comment::class, 'commentable')
            ->whereNull('parent_id')
            ->where('status', 'visible')
            ->with('user', 'replies');
    }
}
