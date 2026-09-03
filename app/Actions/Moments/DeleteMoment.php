<?php

namespace App\Actions\Moments;

use App\Models\Moment;
use App\Services\MomentService;
use Illuminate\Support\Facades\Cache;

class DeleteMoment
{
    public function handle(Moment $moment): void
    {
        $moment->delete();

        Cache::tags([MomentService::CACHE_TAG])->flush();
    }
}
