<?php

declare(strict_types=1);

namespace App\Services\Api\Store;

use App\Http\Resources\Store\CarMiniResource;
use App\Http\Resources\Store\HomeOfferResource;
use App\Models\Car;
use App\Models\Offer;
use App\Services\Cache\HomeCacheService;
use Illuminate\Support\Facades\Storage;

final class HomeApiService
{
    public function __construct(
        private readonly HomeCacheService $cache,
    ) {}

    public function home(): array
    {
        $data = $this->cache->rememberHomeData();

        $heroSlides = array_map(function (array $slide): array {
            $slide['image'] = $this->resolveImage($slide['image'] ?? $slide['image_desktop'] ?? null);
            $slide['image_desktop'] = $this->resolveImage($slide['image_desktop'] ?? $slide['image'] ?? null);
            $slide['image_mobile'] = $this->resolveImage($slide['image_mobile'] ?? null);

            return $slide;
        }, $data['heroSlides'] ?? []);

        $featuredSetting = $this->cache->rememberSetting('homepage_featured', []);
        $homepageStats = $this->cache->rememberSetting('homepage_stats', []);
        if (! is_array($homepageStats)) {
            $homepageStats = json_decode((string) $homepageStats, true) ?: [];
        }

        $rawSections = $this->cache->rememberSetting('homepage_sections', []);
        if (! is_array($rawSections)) {
            $rawSections = json_decode((string) $rawSections, true) ?: [];
        }

        $hero = $this->cache->rememberHeroSetting('store_home_hero');

        $homeFeatures = $this->cache->rememberSetting('store_home_features', []);
        if (! is_array($homeFeatures)) {
            $homeFeatures = json_decode((string) $homeFeatures, true) ?: [];
        }

        $locale = app()->getLocale();

        $hero['features'] = array_map(fn (array $feature) => [
            'icon' => $feature['icon'] ?? '',
            'title' => is_array($feature['title'] ?? null) ? ($feature['title'][$locale] ?? '') : ($feature['title'] ?? ''),
            'description' => is_array($feature['description'] ?? null) ? ($feature['description'][$locale] ?? '') : ($feature['description'] ?? ''),
        ], $homeFeatures);
        $carId = $featuredSetting['car_id'] ?? null;
        $offerId = $featuredSetting['offer_id'] ?? null;

        $featuredSection = [
            'title' => $featuredSetting['title'][$locale] ?? '',
            'description' => $featuredSetting['description'][$locale] ?? '',
            'car' => $carId ? CarMiniResource::make(Car::with('brand', 'images')->find($carId))->resolve() : null,
            'offer' => $offerId ? HomeOfferResource::make(Offer::query()->find($offerId))->resolve() : null,
        ];

        $showSearchFilter = ! in_array($this->cache->rememberSetting('show_home_search_filter', '1'), [0, '0', false, 'false'], true);
        $showHomeBrands = ! in_array($this->cache->rememberSetting('show_home_brands_section', '1'), [0, '0', false, 'false'], true);

        $pageSections = [
            'filter' => [
                'enabled' => $showSearchFilter,
                'title' => $rawSections['filter']['title'][$locale] ?? '',
            ],
            'featured_cars' => [
                'badge' => $rawSections['featured_cars']['badge'][$locale] ?? '',
                'title' => $rawSections['featured_cars']['title'][$locale] ?? '',
                'subtitle' => $rawSections['featured_cars']['subtitle'][$locale] ?? '',
                'button_text' => $rawSections['featured_cars']['button_text'][$locale] ?? '',
            ],
            'offers' => [
                'badge' => $rawSections['offers']['badge'][$locale] ?? '',
                'title' => $rawSections['offers']['title'][$locale] ?? '',
                'button_text' => $rawSections['offers']['button_text'][$locale] ?? '',
            ],
            'highlighted_cars' => [
                'badge' => $rawSections['highlighted_cars']['badge'][$locale] ?? '',
                'title' => $rawSections['highlighted_cars']['title'][$locale] ?? '',
                'subtitle' => $rawSections['highlighted_cars']['subtitle'][$locale] ?? '',
                'button_text' => $rawSections['highlighted_cars']['button_text'][$locale] ?? '',
            ],
            'finance' => [
                'title' => $rawSections['finance']['title'][$locale] ?? '',
                'subtitle' => $rawSections['finance']['subtitle'][$locale] ?? '',
                'features' => array_values(array_filter(array_map('trim', explode("\n", $rawSections['finance']['features'][$locale] ?? '')))),
                'button_text' => $rawSections['finance']['button_text'][$locale] ?? '',
            ],
            'brands' => [
                'enabled' => $showHomeBrands,
                'title' => $rawSections['brands']['title'][$locale] ?? '',
                'subtitle' => $rawSections['brands']['subtitle'][$locale] ?? '',
            ],
            'budget' => [
                'badge' => $rawSections['budget']['badge'][$locale] ?? '',
                'title' => $rawSections['budget']['title'][$locale] ?? '',
                'description' => $rawSections['budget']['description'][$locale] ?? '',
                'button_text' => $rawSections['budget']['button_text'][$locale] ?? '',
            ],
        ];

        $rawBanner = $this->cache->rememberSetting('home_promo_banner', []);
        if (! is_array($rawBanner)) {
            $rawBanner = json_decode((string) $rawBanner, true) ?: [];
        }

        $isBannerEnabled = ! in_array($rawBanner['enabled'] ?? '0', [0, '0', false, 'false'], true);
        $bannerType = $rawBanner['type'] ?? 'image';

        $promoBanner = [
            'enabled' => $isBannerEnabled,
            'type' => $bannerType,
            'image_desktop' => $this->resolveImage($rawBanner['image_desktop'] ?? null),
            'image_mobile' => $this->resolveImage($rawBanner['image_mobile'] ?? null),
            'video_url' => $this->resolveImage($rawBanner['video_file'] ?? null),
            'youtube_url' => $rawBanner['youtube_url'] ?? '',
            'title' => is_array($rawBanner['title'] ?? null) ? ($rawBanner['title'][$locale] ?? '') : ($rawBanner['title'] ?? ''),
            'subtitle' => is_array($rawBanner['subtitle'] ?? null) ? ($rawBanner['subtitle'][$locale] ?? '') : ($rawBanner['subtitle'] ?? ''),
            'button_text' => is_array($rawBanner['button_text'] ?? null) ? ($rawBanner['button_text'][$locale] ?? '') : ($rawBanner['button_text'] ?? ''),
            'button_url' => $rawBanner['button_url'] ?? '',
            'open_in_new_tab' => ! in_array($rawBanner['open_in_new_tab'] ?? '0', [0, '0', false, 'false'], true),
        ];

        return [
            'hero' => $hero,
            'hero_slides' => $heroSlides,
            'show_search_filter' => $showSearchFilter,
            'show_home_brands' => $showHomeBrands,
            'featured_cars' => ($data['featuredCars'] ?? collect())->values(),
            'active_offers' => ($data['activeOffers'] ?? collect())->values(),
            'brands' => ($data['brands'] ?? collect())->values(),
            'latest_posts' => ($data['latestPosts'] ?? collect())->values(),
            'stats' => $data['stats'] ?? [],
            'testimonials' => ($data['testimonials'] ?? collect())->values(),
            'partners' => ($data['partners'] ?? collect())->values(),
            'filter_brands' => ($data['filterBrands'] ?? collect())->values(),
            'filter_categories' => ($data['filterCategories'] ?? collect())->values(),
            'filter_types' => ($data['filterTypes'] ?? collect())->values(),
            'filter_years' => ($data['filterYears'] ?? collect())->values(),
            'filter_models' => ($data['filterModels'] ?? collect())->values(),
            'filter_prices' => ($data['filterPrices'] ?? collect())->values(),
            'filter_fuels' => ($data['filterFuels'] ?? collect())->values(),
            'filter_horsepowers' => ($data['filterHorsepowers'] ?? collect())->values(),
            'filter_highlights' => ($data['filterHighlights'] ?? collect())->values(),
            'filter_brand_types' => ($data['filterBrandTypes'] ?? collect())->values(),
            'bento_cars' => ($data['bentoCars'] ?? collect())->values(),
            'highlighted_cars' => ($data['highlightedCars'] ?? collect())->values(),
            'featured_section' => $featuredSection,
            'homepage_stats' => $homepageStats,
            'page_sections' => $pageSections,
            'promo_banner' => $promoBanner,
        ];
    }

    private function resolveImage(?string $path): ?string
    {
        if ($path === null) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
