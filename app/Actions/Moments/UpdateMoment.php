<?php

namespace App\Actions\Moments;

use App\Models\Moment;
use App\Models\Photo;
use App\Services\MomentService;
use Illuminate\Support\Facades\Cache;

class UpdateMoment
{
    public function handle(Moment $moment, array $data): Moment
    {
        $moment->update([
            'caption' => $data['caption'] ?? null,
            'mood' => $data['mood'] ?? null,
            'location' => $data['location'] ?? null,
            'song' => $data['song'] ?? null,
            'status' => $data['status'],
            'published_at' => $data['status'] === 'published' ? ($moment->published_at ?? now()) : null,
        ]);

        if (! empty($data['photo_ids'])) {
            Photo::whereIn('id', $data['photo_ids'])->update(['moment_id' => $moment->id]);
        }

        Cache::tags([MomentService::CACHE_TAG])->flush();

        return $moment->refresh();
    }
}
