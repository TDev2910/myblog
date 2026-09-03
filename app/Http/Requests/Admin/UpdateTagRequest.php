<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTagRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole(['author', 'admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique('tags', 'slug')->ignore($this->route('tag'))],
            'name_vi' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
        ];
    }
}
