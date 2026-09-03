<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlbumTranslation extends Model
{
    /** @use HasFactory<\Database\Factories\AlbumTranslationFactory> */
    use HasFactory;

    protected $fillable = [
        'album_id',
        'locale',
        'title',
        'slug',
        'description',
    ];

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }
}
