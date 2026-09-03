<?php

namespace App\Http\Requests;

use App\Models\Like;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ToggleLikeRequest extends FormRequest
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
            'likeable_type' => ['required', Rule::in(array_keys(Like::TYPE_MAP))],
            'likeable_id' => ['required', 'integer'],
            'reaction' => ['required', Rule::in(Like::REACTIONS)],
        ];
    }
}
