<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTagRequest;
use App\Http\Requests\Admin\UpdateTagRequest;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/tags/index', [
            'tags' => Tag::query()->orderBy('name_vi')->paginate(30),
        ]);
    }

    public function store(StoreTagRequest $request): RedirectResponse
    {
        Tag::create($request->validated());

        return redirect()->route('admin.tags.index')->with('success', 'Tag created.');
    }

    public function update(UpdateTagRequest $request, Tag $tag): RedirectResponse
    {
        $tag->update($request->validated());

        return redirect()->route('admin.tags.index')->with('success', 'Tag updated.');
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        return redirect()->route('admin.tags.index')->with('success', 'Tag deleted.');
    }
}
