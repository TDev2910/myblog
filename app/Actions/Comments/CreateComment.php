<?php

namespace App\Actions\Comments;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CreateComment
{
    public function handle(User $user, string $commentableAlias, int $commentableId, string $body, ?int $parentId): Comment
    {
        $commentableClass = Comment::TYPE_MAP[$commentableAlias];

        /** @var Model $commentable */
        $commentable = $commentableClass::query()->published()->findOrFail($commentableId);

        if ($parentId !== null) {
            $parentBelongsToSameTarget = Comment::query()
                ->whereKey($parentId)
                ->where('commentable_type', $commentableClass)
                ->where('commentable_id', $commentableId)
                ->exists();

            abort_unless($parentBelongsToSameTarget, 422, 'Invalid parent comment.');
        }

        return $commentable->comments()->create([
            'user_id' => $user->id,
            'parent_id' => $parentId,
            'body' => strip_tags($body),
            'status' => 'visible',
        ]);
    }
}
