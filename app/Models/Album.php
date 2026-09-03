<?php

namespace App\Models;

use App\Models\Concerns\Bookmarkable;
use App\Models\Concerns\Commentable;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\Likeable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Album extends Model
{
    /** @use HasFactory<\Database\Factories\AlbumFactory> */
    use HasFactory;

    use Bookmarkable;
    use Commentable;
    use HasTranslations;
    use Likeable;
    use SoftDeletes;

    protected $fillable = [
        'author_id',
        'cover_photo_id',
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

    public function translations(): HasMany
    {
        return $this->hasMany(AlbumTranslation::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class);
    }

    public function coverPhoto(): BelongsTo
    {
        return $this->belongsTo(Photo::class, 'cover_photo_id');
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published')->where('published_at', '<=', now());
    }
}
