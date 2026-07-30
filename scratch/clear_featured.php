<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\Car;
use Illuminate\Contracts\Console\Kernel;

Car::where('is_featured', true)->update(['is_featured' => false]);
echo "Updated all cars to is_featured = false\n";
echo 'New Count: '.Car::where('is_featured', true)->count()."\n";
