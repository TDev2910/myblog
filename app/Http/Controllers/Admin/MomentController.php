<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Moments\CreateMoment;
use App\Actions\Moments\DeleteMoment;
use App\Actions\Moments\UpdateMoment;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMomentRequest;
use App\Http\Requests\Admin\UpdateMomentRequest;
use App\Models\Moment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MomentController extends Controller
{
    public function index(Request $request): Response
    {
        $moments = Moment::query()
            ->when(
                ! $request->user()->hasRole('admin'),
                fn ($q) => $q->where('author_id', $request->user()->id),
            )
            ->with(['author', 'photos'])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/moments/index', ['moments' => $moments]);
    }

    public function store(StoreMomentRequest $request, CreateMoment $createMoment): RedirectResponse
    {
        $createMoment->handle($request->user(), $request->validated());

        return redirect()->route('admin.moments.index')->with('success', 'Moment created.');
    }

    public function edit(Moment $moment): Response
    {
        $this->authorize('update', $moment);

        return Inertia::render('admin/moments/edit', [
            'moment' => $moment->load('photos'),
        ]);
    }

    public function update(UpdateMomentRequest $request, Moment $moment, UpdateMoment $updateMoment): RedirectResponse
    {
        $updateMoment->handle($moment, $request->validated());

        return back()->with('success', 'Moment updated.');
    }

    public function destroy(Moment $moment, DeleteMoment $deleteMoment): RedirectResponse
    {
        $this->authorize('delete', $moment);

        $deleteMoment->handle($moment);

        return redirect()->route('admin.moments.index')->with('success', 'Moment deleted.');
    }
}
