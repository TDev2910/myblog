<?php

namespace App\Http\Requests\Admin;

use App\Models\Moment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreMomentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Moment::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'caption' => ['nullable', 'string', 'max:500'],
            'mood' => ['nullable', Rule::in(Moment::MOODS)],
            'location' => ['nullable', 'string', 'max:255'],
            'song' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'photo_ids' => ['array', 'max:4'],
            'photo_ids.*' => ['integer', 'exists:photos,id'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (blank($this->input('caption')) && empty($this->input('photo_ids'))) {
                $validator->errors()->add('caption', 'A moment needs at least a caption or a photo.');
            }
        });
    }
}
