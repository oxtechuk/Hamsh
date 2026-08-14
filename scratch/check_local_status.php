<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\Car;
use Illuminate\Contracts\Console\Kernel;

foreach ([2, 3, 4] as $id) {
    $car = Car::find($id);
    if ($car) {
        echo "ID {$id} - Name: {$car->name}, Featured: ".($car->is_featured ? 'YES' : 'NO')."\n";
    }
}
