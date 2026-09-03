<?php

namespace App\Http\Requests;

use App\Models\Bookmark;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ToggleBookmarkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'bookmarkable_type' => ['required', Rule::in(array_keys(Bookmark::TYPE_MAP))],
            'bookmarkable_id' => ['required', 'integer'],
        ];
    }
}
