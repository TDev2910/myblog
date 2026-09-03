<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    /** @use HasFactory<\Database\Factories\CommentFactory> */
    use HasFactory;

    use SoftDeletes;

    /**
     * Whitelist of client-facing aliases to actual commentable model classes.
     * Never resolve commentable_type from raw client input directly.
     */
    const TYPE_MAP = [
        'post' => Post::class,
        'album' => Album::class,
        'moment' => Moment::class,
    ];

    protected $fillable = [
        'user_id',
        'parent_id',
        'commentable_type',
        'commentable_id',
        'body',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id')
            ->where('status', 'visible')
            ->with('user', 'replies');
    }

    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }
}
