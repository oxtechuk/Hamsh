<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\Car;
use Illuminate\Contracts\Console\Kernel;

echo "All Active Cars:\n";
foreach (Car::where('is_active', true)->get() as $car) {
    echo "ID: {$car->id}, Name: {$car->name}, Featured: ".($car->is_featured ? 'YES' : 'NO').", Highlighted: {$car->is_highlighted}\n";
}
