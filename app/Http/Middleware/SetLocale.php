<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    private const SUPPORTED = ['vi', 'en'];

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->query('lang');

        if (! in_array($locale, self::SUPPORTED, true)) {
            $locale = $request->session()->get('locale');
        }

        if (! in_array($locale, self::SUPPORTED, true)) {
            $locale = config('app.locale');
        }

        App::setLocale($locale);
        $request->session()->put('locale', $locale);

        return $next($request);
    }
}
