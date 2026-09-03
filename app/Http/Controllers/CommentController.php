<?php

namespace App\Http\Controllers;

use App\Actions\Comments\CreateComment;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request, CreateComment $createComment): RedirectResponse
    {
        $createComment->handle(
            $request->user(),
            $request->string('commentable_type')->value(),
            $request->integer('commentable_id'),
            $request->string('body')->value(),
            $request->integer('parent_id') ?: null,
        );

        return back();
    }

    public function destroy(Comment $comment): RedirectResponse
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return back();
    }
}
