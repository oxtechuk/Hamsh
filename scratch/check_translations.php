<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\Car;
use Illuminate\Contracts\Console\Kernel;

$car = Car::find(3);
if ($car) {
    echo 'ID 3 Name (AR): '.$car->getTranslation('name', 'ar')."\n";
    echo 'ID 3 Name (EN): '.$car->getTranslation('name', 'en')."\n";
}
$car4 = Car::find(4);
if ($car4) {
    echo 'ID 4 Name (AR): '.$car4->getTranslation('name', 'ar')."\n";
    echo 'ID 4 Name (EN): '.$car4->getTranslation('name', 'en')."\n";
}
