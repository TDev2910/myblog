<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Server Side Rendering
    |--------------------------------------------------------------------------
    |
    | These options configures if and how Inertia uses Server Side Rendering
    | to pre-render the initial visits made to your application's pages.
    |
    | You can specify a custom SSR bundle path, or omit it to let Inertia
    | try and automatically detect it for you.
    |
    | Do note that enabling these options will NOT automatically make SSR work,
    | as a separate rendering service needs to be available. To learn more,
    | please visit https://inertiajs.com/server-side-rendering
    |
    */

    'ssr' => [

        'enabled' => (bool) env('INERTIA_SSR_ENABLED', true),

        'url' => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),

        'ensure_bundle_exists' => (bool) env('INERTIA_SSR_ENSURE_BUNDLE_EXISTS', true),

        // 'bundle' => base_path('bootstrap/ssr/ssr.mjs'),

    ],

    /*
    |--------------------------------------------------------------------------
    | Pages
    |--------------------------------------------------------------------------
    |
    | Set `ensure_pages_exist` to true if you want to enforce that Inertia page
    | components exist on disk when rendering a page. This is useful for
    | catching missing or misnamed components.
    |
    | The `page_paths` and `page_extensions` options define where to look
    | for page components and which file extensions to consider.
    |
    */

    'ensure_pages_exist' => false,

    'page_paths' => [

        // Publish này chỉ để sửa 1 chỗ: mặc định của package trỏ vào
        // "js/Pages" (chữ P hoa) trong khi thư mục thật của dự án là
        // "resources/js/pages" (chữ thường). Trên Windows (NTFS không phân
        // biệt hoa/thường) việc lệch case này chạy trơn tru và không lộ ra,
        // nhưng CI chạy Ubuntu (ext4, phân biệt hoa/thường) thì không tìm
        // thấy file component nào — toàn bộ assertInertia()->component(...)
        // trong test sẽ fail với "Inertia page component file [...] does not
        // exist", dù trang chạy hoàn toàn bình thường lúc duyệt web bằng tay.
        resource_path('js/pages'),

    ],

    'page_extensions' => [

        'js',
        'jsx',
        'svelte',
        'ts',
        'tsx',
        'vue',

    ],

    'use_script_element_for_initial_page' => (bool) env('INERTIA_USE_SCRIPT_ELEMENT_FOR_INITIAL_PAGE', false),

    /*
    |--------------------------------------------------------------------------
    | Testing
    |--------------------------------------------------------------------------
    |
    | The values described here are used to locate Inertia components on the
    | filesystem. For instance, when using `assertInertia`, the assertion
    | attempts to locate the component as a file relative to any of the
    | paths AND with any of the extensions specified here.
    |
    | Note: In a future release, the `page_paths` and `page_extensions`
    | options below will be removed. The root-level options above
    | will be used for both application and testing purposes.
    |
    */

    'testing' => [

        'ensure_pages_exist' => true,

        'page_paths' => [

            // Cùng lý do như page_paths ở trên — đây là nơi thực sự gây lỗi
            // trên CI (mặc định 'ensure_pages_exist' => true cho testing).
            resource_path('js/pages'),

        ],

        'page_extensions' => [

            'js',
            'jsx',
            'svelte',
            'ts',
            'tsx',
            'vue',

        ],

    ],

    'history' => [

        'encrypt' => (bool) env('INERTIA_ENCRYPT_HISTORY', false),

    ],

];
