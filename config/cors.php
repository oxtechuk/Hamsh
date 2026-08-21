<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'store-api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://hamshnajd.com',
        'https://www.hamshnajd.com',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost',
        'http://127.0.0.1:8000',
        'http://127.0.0.1:5173',
        '*',
    ],

    'allowed_origins_patterns' => [
        '#^https?://.*\.hamshnajd\.com$#',
        '#^https?://.*\.oxtech\.uk$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['*'],

    'max_age' => 86400,

    'supports_credentials' => true,

];
