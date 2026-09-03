<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Like extends Model
{
    /** @use HasFactory<\Database\Factories\LikeFactory> */
    use HasFactory;

    const UPDATED_AT = null;

    /**
     * Whitelist of client-facing aliases to actual likeable model classes.
     * Never resolve likeable_type from raw client input directly.
     */
    const TYPE_MAP = [
        'post' => Post::class,
        'album' => Album::class,
        'moment' => Moment::class,
    ];

    const REACTIONS = ['coffee', 'peaceful', 'empathy', 'love'];

    protected $fillable = [
        'user_id',
        'likeable_type',
        'likeable_id',
        'reaction',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function likeable(): MorphTo
    {
        return $this->morphTo();
    }
}
