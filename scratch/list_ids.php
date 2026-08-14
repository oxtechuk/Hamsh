<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\Car;
use Illuminate\Contracts\Console\Kernel;

echo 'All Car IDs: '.Car::pluck('id')->implode(', ')."\n";
