<?php

use App\Providers\ApiResponseServiceProvider;
use App\Providers\AppServiceProvider;
use Intervention\Image\Laravel\ServiceProvider;

return [
    AppServiceProvider::class,
    ApiResponseServiceProvider::class,
    ServiceProvider::class,
];
