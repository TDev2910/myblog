<?php

namespace App\Models;

use App\Models\Concerns\Bookmarkable;
use App\Models\Concerns\Commentable;
use App\Models\Concerns\Likeable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Moment extends Model
{
    /** @use HasFactory<\Database\Factories\MomentFactory> */
    use HasFactory;

    use Bookmarkable;
    use Commentable;
    use Likeable;
    use SoftDeletes;

    /**
     * Quick moments are deliberately single-locale (no *_translations table)
     * — they're meant to be posted in seconds, unlike Post/Album.
     */
    const MOODS = ['calm', 'rainy', 'inspired', 'nostalgic', 'late_night'];

    protected $fillable = [
        'author_id',
        'caption',
        'mood',
        'location',
        'song',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class)->orderBy('sort_order');
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published')->where('published_at', '<=', now());
    }
}
