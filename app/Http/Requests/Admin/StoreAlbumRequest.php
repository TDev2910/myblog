<?php

namespace App\Http\Requests\Admin;

use App\Models\Album;
use App\Models\AlbumTranslation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreAlbumRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Album::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'published_at' => ['nullable', 'date'],
            'cover_photo_id' => ['nullable', 'integer', 'exists:photos,id'],
            'tags' => ['array'],
            'tags.*' => ['integer', 'exists:tags,id'],
            'photo_ids' => ['array'],
            'photo_ids.*' => ['integer', 'exists:photos,id'],

            'translations' => ['required', 'array', 'min:1'],
            'translations.*.locale' => ['required', Rule::in(['vi', 'en'])],
            'translations.*.title' => ['required', 'string', 'max:255'],
            'translations.*.slug' => ['required', 'string', 'max:255', 'alpha_dash'],
            'translations.*.description' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            foreach ($this->input('translations', []) as $index => $translation) {
                $exists = AlbumTranslation::query()
                    ->where('locale', $translation['locale'] ?? null)
                    ->where('slug', $translation['slug'] ?? null)
                    ->exists();

                if ($exists) {
                    $validator->errors()->add("translations.{$index}.slug", 'This slug is already taken for this locale.');
                }
            }
        });
    }
}
