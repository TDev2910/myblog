<?php

namespace App\Http\Controllers;

use App\Actions\Likes\ToggleLike;
use App\Http\Requests\ToggleLikeRequest;

class LikeController extends Controller
{
    public function toggle(ToggleLikeRequest $request, ToggleLike $toggleLike)
    {
        $reaction = $toggleLike->handle(
            $request->user(),
            $request->string('likeable_type')->value(),
            $request->integer('likeable_id'),
            $request->string('reaction')->value(),
        );

        return back()->with('reaction', $reaction);
    }
}
