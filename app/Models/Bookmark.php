<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Bookmark extends Model
{
    /** @use HasFactory<\Database\Factories\BookmarkFactory> */
    use HasFactory;

    const UPDATED_AT = null;

    /**
     * Whitelist of client-facing aliases to actual bookmarkable model classes.
     * Never resolve bookmarkable_type from raw client input directly.
     */
    const TYPE_MAP = [
        'post' => Post::class,
        'album' => Album::class,
        'moment' => Moment::class,
    ];

    protected $fillable = [
        'user_id',
        'bookmarkable_type',
        'bookmarkable_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bookmarkable(): MorphTo
    {
        return $this->morphTo();
    }
}
