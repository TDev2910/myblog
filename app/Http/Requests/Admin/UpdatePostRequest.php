<?php

namespace App\Http\Requests\Admin;

use App\Models\Post;
use App\Models\PostTranslation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var Post $post */
        $post = $this->route('post');

        return $this->user()->can('update', $post);
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

            'translations' => ['required', 'array', 'min:1'],
            'translations.*.locale' => ['required', Rule::in(['vi', 'en'])],
            'translations.*.title' => ['required', 'string', 'max:255'],
            'translations.*.slug' => ['required', 'string', 'max:255', 'alpha_dash'],
            'translations.*.excerpt' => ['nullable', 'string', 'max:500'],
            'translations.*.body_md' => ['required', 'string'],
            'translations.*.meta_title' => ['nullable', 'string', 'max:255'],
            'translations.*.meta_description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var Post $post */
            $post = $this->route('post');

            foreach ($this->input('translations', []) as $index => $translation) {
                $exists = PostTranslation::query()
                    ->where('locale', $translation['locale'] ?? null)
                    ->where('slug', $translation['slug'] ?? null)
                    ->where('post_id', '!=', $post->id)
                    ->exists();

                if ($exists) {
                    $validator->errors()->add("translations.{$index}.slug", 'This slug is already taken for this locale.');
                }
            }
        });
    }
}
