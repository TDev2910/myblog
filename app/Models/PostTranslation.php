<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class PostTranslation extends Model
{
    /** @use HasFactory<\Database\Factories\PostTranslationFactory> */
    use HasFactory;

    use Searchable;

    protected $fillable = [
        'post_id',
        'locale',
        'title',
        'slug',
        'excerpt',
        'body_md',
        'body_html',
        'meta_title',
        'meta_description',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'body_md' => $this->body_md,
        ];
    }
}
