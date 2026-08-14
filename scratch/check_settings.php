<?php

define('LARAVEL_START', microtime(true));
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\Setting;
use Illuminate\Contracts\Console\Kernel;

$settings = Setting::all()->pluck('value', 'key');
foreach ($settings as $key => $value) {
    echo "Key: $key | Type: ".gettype($value)."\n";
    if (is_array($value)) {
        echo 'Value: '.json_encode($value)."\n";
    } else {
        echo 'Value: '.(is_string($value) ? substr($value, 0, 50) : $value)."...\n";
    }
}
