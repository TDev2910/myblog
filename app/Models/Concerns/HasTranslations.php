<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;

trait HasTranslations
{
    /**
     * Resolve the translation for the given locale, falling back to any
     * other available translation when the exact locale is missing.
     */
    public function translationFor(string $locale): ?Model
    {
        return $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->first();
    }
}
