<?php

namespace App\Http\Controllers;

use App\Services\AlbumService;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    public function __construct(private readonly AlbumService $albums) {}

    public function index(): Response
    {
        return Inertia::render('albums/index', [
            'albums' => $this->albums->paginatePublished(),
        ]);
    }

    public function show(string $slug): Response
    {
        $album = $this->albums->findPublishedBySlug(app()->getLocale(), $slug);

        abort_if(! $album, 404);

        return Inertia::render('albums/show', [
            'album' => $album,
        ]);
    }
}
