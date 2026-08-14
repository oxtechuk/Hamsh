<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\Car;
use Illuminate\Contracts\Console\Kernel;

echo "Featured Cars:\n";
foreach (Car::where('is_featured', true)->get() as $car) {
    echo "ID: {$car->id}, Name: {$car->name}, Updated: {$car->updated_at}\n";
}
