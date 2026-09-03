<?php

namespace App\Actions\Likes;

use App\Models\Like;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ToggleLike
{
    /**
     * Toggle a reaction: no existing reaction -> create with $reaction;
     * existing reaction of the same type -> remove it (toggle off);
     * existing reaction of a different type -> switch to $reaction.
     *
     * @return string|null the resulting reaction type, or null if removed
     */
    public function handle(User $user, string $likeableAlias, int $likeableId, string $reaction): ?string
    {
        $likeableClass = Like::TYPE_MAP[$likeableAlias];

        /** @var Model $likeable */
        $likeable = $likeableClass::query()->published()->findOrFail($likeableId);

        $existing = $likeable->likes()->where('user_id', $user->id)->first();

        if ($existing && $existing->reaction === $reaction) {
            $existing->delete();

            return null;
        }

        if ($existing) {
            $existing->update(['reaction' => $reaction]);

            return $reaction;
        }

        $likeable->likes()->create(['user_id' => $user->id, 'reaction' => $reaction]);

        return $reaction;
    }
}
