<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Photo extends Model
{
    /** @use HasFactory<\Database\Factories\PhotoFactory> */
    use HasFactory;

    protected $fillable = [
        'album_id',
        'moment_id',
        'uploader_id',
        'disk',
        'path',
        'thumb_path',
        'medium_path',
        'width',
        'height',
        'size_bytes',
        'mime',
        'taken_at',
        'exif',
        'caption',
        'sort_order',
    ];

    protected $appends = ['thumb_url', 'medium_url', 'full_url'];

    protected function casts(): array
    {
        return [
            'taken_at' => 'datetime',
            'exif' => 'array',
        ];
    }

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    public function moment(): BelongsTo
    {
        return $this->belongsTo(Moment::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    protected function thumbUrl(): Attribute
    {
        return Attribute::get(fn () => $this->thumb_path ? Storage::disk($this->disk)->url($this->thumb_path) : null);
    }

    protected function mediumUrl(): Attribute
    {
        return Attribute::get(fn () => $this->medium_path ? Storage::disk($this->disk)->url($this->medium_path) : null);
    }

    protected function fullUrl(): Attribute
    {
        return Attribute::get(fn () => Storage::disk($this->disk)->url($this->path));
    }
}
