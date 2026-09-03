<?php

namespace App\Http\Requests;

use App\Models\Comment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCommentRequest extends FormRequest
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
            'commentable_type' => ['required', Rule::in(array_keys(Comment::TYPE_MAP))],
            'commentable_id' => ['required', 'integer'],
            'parent_id' => ['nullable', 'integer', 'exists:comments,id'],
            'body' => ['required', 'string', 'max:5000'],
        ];
    }
}
