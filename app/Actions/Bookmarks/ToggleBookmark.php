<?php

namespace App\Actions\Bookmarks;

use App\Models\Bookmark;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ToggleBookmark
{
    public function handle(User $user, string $bookmarkableAlias, int $bookmarkableId): bool
    {
        $bookmarkableClass = Bookmark::TYPE_MAP[$bookmarkableAlias];

        /** @var Model $bookmarkable */
        $bookmarkable = $bookmarkableClass::query()->published()->findOrFail($bookmarkableId);

        $existing = $bookmarkable->bookmarks()->where('user_id', $user->id)->first();

        if ($existing) {
            $existing->delete();

            return false;
        }

        $bookmarkable->bookmarks()->create(['user_id' => $user->id]);

        return true;
    }
}
