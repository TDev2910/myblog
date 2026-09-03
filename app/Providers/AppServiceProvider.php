<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::before(fn (User $user) => $user->hasRole('admin') ? true : null);

        RateLimiter::for('comments', fn (Request $request) => Limit::perMinute(10)->by($request->user()?->id));
        RateLimiter::for('likes', fn (Request $request) => Limit::perMinute(30)->by($request->user()?->id));
        RateLimiter::for('uploads', fn (Request $request) => Limit::perHour(20)->by($request->user()?->id));
    }
}
