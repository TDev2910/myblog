<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->only(['id', 'name', 'username', 'email', 'email_verified_at', 'avatar_path']),
                    'is_admin' => $request->user()->hasRole('admin'),
                    'is_author' => $request->user()->hasAnyRole(['author', 'admin']),
                ] : null,
            ],
            'locale' => App::getLocale(),
            'translations' => app('translation.loader')->load(App::getLocale(), '*', '*'),
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
