<?php

namespace App\Jobs;

use App\Models\Photo;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;

class ProcessPhoto implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(private readonly int $photoId, private readonly string $tempPath)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $photo = Photo::findOrFail($this->photoId);

        $bytes = Storage::disk('local')->get($this->tempPath);
        $exif = @exif_read_data('data://image/jpeg;base64,'.base64_encode($bytes)) ?: [];

        $manager = ImageManager::gd();
        $source = $manager->read($bytes);
        [$width, $height] = [$source->width(), $source->height()];

        $disk = $this->targetDisk();
        $directory = 'photos/'.$photo->id;

        $variants = [
            'thumb_path' => ['width' => 400, 'file' => 'thumb.webp'],
            'medium_path' => ['width' => 1200, 'file' => 'medium.webp'],
            'path' => ['width' => 2000, 'file' => 'full.webp'],
        ];

        $paths = [];

        foreach ($variants as $column => $spec) {
            $resized = clone $source;
            $resized->scaleDown(width: $spec['width']);

            $path = "{$directory}/{$spec['file']}";
            Storage::disk($disk)->put($path, (string) $resized->toWebp(quality: 82));
            $paths[$column] = $path;
        }

        $photo->update([
            'disk' => $disk,
            'path' => $paths['path'],
            'thumb_path' => $paths['thumb_path'],
            'medium_path' => $paths['medium_path'],
            'width' => $width,
            'height' => $height,
            'exif' => $this->sanitizeExif($exif),
        ]);

        Storage::disk('local')->delete($this->tempPath);
    }

    private function targetDisk(): string
    {
        return filled(config('filesystems.disks.spaces.key')) ? 'spaces' : 'public';
    }

    private function sanitizeExif(array $exif): array
    {
        return collect($exif)
            ->only(['Make', 'Model', 'DateTimeOriginal', 'ExposureTime', 'FNumber', 'ISOSpeedRatings', 'FocalLength'])
            ->map(fn ($value) => is_scalar($value) ? (string) $value : null)
            ->filter()
            ->toArray();
    }
}
