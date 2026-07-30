<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Store;

use App\Http\Api\Response\Builder\ApiResponseBuilder;
use App\Http\Controllers\Api\ApiBaseController;
use App\Models\City;

final class CityController extends ApiBaseController
{
    public function __construct()
    {
        parent::__construct(app(ApiResponseBuilder::class));
    }

    public function index()
    {
        $cities = City::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name']);

        return $this->respondSuccess($cities, 'Cities retrieved successfully');
    }
}
