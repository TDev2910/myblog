<?php

namespace App\Actions\Content;

use League\CommonMark\CommonMarkConverter;
use Mews\Purifier\Facades\Purifier;

class RenderMarkdownToHtml
{
    public function handle(string $markdown): string
    {
        $html = (new CommonMarkConverter([
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]))->convert($markdown)->getContent();

        return Purifier::clean($html, 'post_body');
    }
}
