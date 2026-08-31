<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    /**
     * Public endpoint — anyone may submit the contact form.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:30', 'regex:/^[0-9()+\-.\s]*$/'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            // Honeypot: real users never see or fill this field.
            'website' => ['prohibited'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'contact_number.regex' => 'Please enter a valid contact number.',
            'message.min' => 'Please provide a little more detail so we can help you properly.',
            'website.prohibited' => 'Your submission could not be processed.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'contact_number' => 'contact number',
        ];
    }
}
