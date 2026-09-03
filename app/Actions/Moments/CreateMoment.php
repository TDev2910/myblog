<?php

namespace App\Actions\Moments;

use App\Models\Moment;
use App\Models\Photo;
use App\Models\User;
use App\Services\MomentService;
use Illuminate\Support\Facades\Cache;

class CreateMoment
{
    public function handle(User $author, array $data): Moment
    {
        $moment = Moment::create([
            'author_id' => $author->id,
            'caption' => $data['caption'] ?? null,
            'mood' => $data['mood'] ?? null,
            'location' => $data['location'] ?? null,
            'song' => $data['song'] ?? null,
            'status' => $data['status'],
            'published_at' => $data['status'] === 'published' ? now() : null,
        ]);

        if (! empty($data['photo_ids'])) {
            Photo::whereIn('id', $data['photo_ids'])->update(['moment_id' => $moment->id]);
        }

        Cache::tags([MomentService::CACHE_TAG])->flush();

        return $moment;
    }
}
