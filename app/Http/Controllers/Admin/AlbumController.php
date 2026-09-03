<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Albums\CreateAlbum;
use App\Actions\Albums\DeleteAlbum;
use App\Actions\Albums\UpdateAlbum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAlbumRequest;
use App\Http\Requests\Admin\UpdateAlbumRequest;
use App\Models\Album;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlbumController extends Controller
{
    public function index(Request $request): Response
    {
        $albums = Album::query()
            ->when(
                ! $request->user()->hasRole('admin'),
                fn ($q) => $q->where('author_id', $request->user()->id),
            )
            ->with(['author', 'translations'])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/albums/index', [
            'albums' => $albums,
            'tags' => Tag::query()->orderBy('name_vi')->get(),
        ]);
    }

    public function store(StoreAlbumRequest $request, CreateAlbum $createAlbum): RedirectResponse
    {
        $createAlbum->handle($request->user(), $request->validated());

        return redirect()->route('admin.albums.index')->with('success', 'Album created.');
    }

    public function edit(Album $album): Response
    {
        $this->authorize('update', $album);

        return Inertia::render('admin/albums/edit', [
            'album' => $album->load(['translations', 'tags', 'photos']),
            'tags' => Tag::query()->orderBy('name_vi')->get(),
        ]);
    }

    public function update(UpdateAlbumRequest $request, Album $album, UpdateAlbum $updateAlbum): RedirectResponse
    {
        $updateAlbum->handle($album, $request->validated());

        return back()->with('success', 'Album updated.');
    }

    public function destroy(Album $album, DeleteAlbum $deleteAlbum): RedirectResponse
    {
        $this->authorize('delete', $album);

        $deleteAlbum->handle($album);

        return redirect()->route('admin.albums.index')->with('success', 'Album deleted.');
    }
}
