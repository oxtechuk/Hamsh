<?php

namespace App\Services\Cache;

use App\Models\Brand;
use App\Models\BrandType;
use App\Models\Car;
use App\Models\CarCategory;
use App\Models\CarType;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CarCacheService extends BaseCacheService
{
    public function rememberCarFilters(): array
    {
        $result = $this->remember('cars.filters', function () {
            $brands = Brand::whereHas('cars', fn ($q) => $q->where('is_active', true))
                ->withCount(['cars' => fn ($q) => $q->where('is_active', true)])
                ->orderBy('name')
                ->get();

            $years = Car::where('is_active', true)->distinct()->orderByDesc('year')->pluck('year');

            $types = CarType::where('is_active', true)->orderBy('sort_order')->orderBy('id')->get();

            $categories = CarCategory::where('is_active', true)->orderBy('sort_order')->orderBy('id')->get();

            $brandTypes = BrandType::where('is_active', true)->orderBy('sort_order')->orderBy('id')->get();

            $carPrices = Car::where('is_active', true)->pluck('cash_price');
            $priceBrackets = [
                ['min' => 0, 'max' => 150000],
                ['min' => 150001, 'max' => 250000],
                ['min' => 250001, 'max' => 350000],
                ['min' => 350001, 'max' => null],
            ];
            $prices = collect($priceBrackets)->map(function (array $bracket) use ($carPrices): array {
                $count = $carPrices->filter(
                    fn (int $price): bool => $price >= $bracket['min']
                        && ($bracket['max'] === null || $price <= $bracket['max'])
                )->count();

                return [
                    'min' => $bracket['min'],
                    'max' => $bracket['max'],
                    'count' => $count,
                ];
            })->values()->all();

            $activeCars = Car::where('is_active', true)->get(['id', 'specs']);

            $fuels = $activeCars->pluck('specs.fuel')
                ->filter()
                ->countBy()
                ->map(fn (int $count, string $fuel): array => ['value' => $fuel, 'count' => $count])
                ->values()
                ->all();

            $horsepowers = $activeCars->pluck('horsepower')->filter();
            $hpBrackets = [
                ['min' => 0, 'max' => 150],
                ['min' => 151, 'max' => 250],
                ['min' => 251, 'max' => 350],
                ['min' => 351, 'max' => null],
            ];
            $horsepowerBrackets = collect($hpBrackets)->map(function (array $bracket) use ($horsepowers): array {
                $count = $horsepowers->filter(
                    fn (int $hp): bool => $hp >= $bracket['min']
                        && ($bracket['max'] === null || $hp <= $bracket['max'])
                )->count();

                return [
                    'min' => $bracket['min'],
                    'max' => $bracket['max'],
                    'count' => $count,
                ];
            })->values()->all();

            $highlightCounts = Car::where('is_active', true)
                ->where('is_highlighted', '!=', 'none')
                ->pluck('is_highlighted')
                ->countBy()
                ->all();

            return compact('brands', 'years', 'types', 'categories', 'brandTypes', 'prices', 'fuels', 'horsepowerBrackets', 'highlightCounts');
        }, self::TTL_LONG);

        $locale = app()->getLocale();
        $result['highlights'] = collect(Car::HIGHLIGHT_OPTIONS)->map(fn (array $labels, string $value): array => [
            'value' => $value,
            'label' => $labels[$locale] ?? $labels['en'],
            'count' => $result['highlightCounts'][$value] ?? 0,
        ])->values()->all();

        return $result;
    }

    public function rememberSpecialOrderOptions(): array
    {
        return $this->remember('cars.special_order_options', function () {
            $rows = DB::table('cars')
                ->join('brands', 'brands.id', '=', 'cars.brand_id')
                ->where('cars.is_active', true)
                ->select('brands.id as brand_id', 'brands.name as brand_name', 'cars.model', 'cars.year', 'cars.color', 'cars.colors')
                ->get();

            $locale = app()->getLocale();

            $brands = [];
            $models = [];
            $years = [];
            $colors = [];

            foreach ($rows as $row) {
                if (! isset($brands[$row->brand_id])) {
                    $name = json_decode((string) $row->brand_name, true) ?: [];
                    $brands[$row->brand_id] = [
                        'id' => (int) $row->brand_id,
                        'name' => $name[$locale] ?? $name['ar'] ?? $name['en'] ?? '',
                    ];
                }

                if (filled($row->model)) {
                    $models[trim($row->model)] = true;
                }

                if (filled($row->year)) {
                    $years[(string) $row->year] = true;
                }

                if (filled($row->color)) {
                    $colors[trim($row->color)] = true;
                }

                $colorList = json_decode((string) $row->colors, true);
                if (is_array($colorList)) {
                    foreach ($colorList as $colorItem) {
                        $name = is_array($colorItem) ? ($colorItem['name'] ?? null) : $colorItem;
                        if (filled($name)) {
                            $colors[trim((string) $name)] = true;
                        }
                    }
                }
            }

            return [
                'brands' => collect($brands)->sortBy('name')->values()->all(),
                'models' => collect(array_keys($models))->sort()->values()->all(),
                'years' => collect(array_keys($years))->sortDesc()->values()->all(),
                'colors' => collect(array_keys($colors))->sort()->values()->all(),
            ];
        }, self::TTL_LONG);
    }

    public function forgetCars(): void
    {
        Cache::forget('cars.filters');
        Cache::forget('cars.special_order_options');
    }
}
