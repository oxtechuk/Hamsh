<?php

namespace App\Observers;

use App\Models\BrandType;
use App\Services\Cache\HomeCacheService;

class BrandTypeObserver
{
    public function __construct(
        private HomeCacheService $homeCache,
    ) {}

    public function saved(BrandType $brandType): void
    {
        $this->homeCache->forgetHome();
    }

    public function deleted(BrandType $brandType): void
    {
        $this->homeCache->forgetHome();
    }
}
