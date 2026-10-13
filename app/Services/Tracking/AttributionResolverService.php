<?php

declare(strict_types=1);

namespace App\Services\Tracking;

final class AttributionResolverService
{
    /**
     * Resolves the traffic channel, campaign, device type, and normalized metadata.
     *
     * @param  array<string, mixed>  $payload
     * @return array{
     *     traffic_source: string,
     *     traffic_medium: ?string,
     *     campaign_name: ?string,
     *     referrer_url: ?string,
     *     landing_page: ?string,
     *     click_id: ?string,
     *     device_type: string,
     * }
     */
    public function resolve(array $payload, ?string $userAgent = null): array
    {
        $rawSource = strtolower(trim((string) ($payload['traffic_source'] ?? $payload['utm_source'] ?? '')));
        $medium = ! empty($payload['traffic_medium']) ? (string) $payload['traffic_medium'] : ($payload['utm_medium'] ?? null);
        $campaign = ! empty($payload['campaign_name']) ? (string) $payload['campaign_name'] : ($payload['utm_campaign'] ?? null);
        $referrer = ! empty($payload['referrer_url']) ? (string) $payload['referrer_url'] : (request()->header('referer') ?? null);
        $landingPage = ! empty($payload['landing_page']) ? (string) $payload['landing_page'] : null;
        $clickId = ! empty($payload['click_id']) ? (string) $payload['click_id'] : ($payload['fbclid'] ?? $payload['sc_click_id'] ?? $payload['ttclid'] ?? $payload['gclid'] ?? null);

        $resolvedSource = $this->determineSource($rawSource, $referrer, $clickId, $payload);
        $deviceType = $this->detectDeviceType($userAgent ?? request()->userAgent() ?? '');

        return [
            'traffic_source' => $resolvedSource,
            'traffic_medium' => $medium ? substr((string) $medium, 0, 100) : null,
            'campaign_name' => $campaign ? substr((string) $campaign, 0, 150) : null,
            'referrer_url' => $referrer ? substr((string) $referrer, 0, 500) : null,
            'landing_page' => $landingPage ? substr((string) $landingPage, 0, 255) : null,
            'click_id' => $clickId ? substr((string) $clickId, 0, 255) : null,
            'device_type' => $deviceType,
        ];
    }

    private function determineSource(string $rawSource, ?string $referrer, ?string $clickId, array $payload = []): string
    {
        // 1. Direct UTM match
        if (str_contains($rawSource, 'snap')) {
            return 'snapchat';
        }
        if (str_contains($rawSource, 'instagram') || $rawSource === 'ig') {
            return 'instagram';
        }
        if (str_contains($rawSource, 'facebook') || $rawSource === 'fb') {
            return 'facebook';
        }
        if (str_contains($rawSource, 'tiktok') || $rawSource === 'tt') {
            return 'tiktok';
        }
        if (str_contains($rawSource, 'google') || str_contains($rawSource, 'gads')) {
            return 'google';
        }

        // 2. Click ID check
        if (! empty($clickId)) {
            if (! empty($payload['sc_click_id']) || ! empty($payload['scclid']) || request()->has('sc_click_id') || request()->has('scclid')) {
                return 'snapchat';
            }
            if (! empty($payload['ttclid']) || request()->has('ttclid')) {
                return 'tiktok';
            }
            if (! empty($payload['gclid']) || request()->has('gclid')) {
                return 'google';
            }
            if (! empty($payload['fbclid']) || request()->has('fbclid')) {
                // If coming from IG referrer
                if ($referrer && str_contains(strtolower($referrer), 'instagram')) {
                    return 'instagram';
                }

                return 'facebook';
            }
        }

        // 3. Referrer URL check
        if (! empty($referrer)) {
            $refLower = strtolower($referrer);
            if (str_contains($refLower, 'instagram.com')) {
                return 'instagram';
            }
            if (str_contains($refLower, 'snapchat.com')) {
                return 'snapchat';
            }
            if (str_contains($refLower, 'facebook.com') || str_contains($refLower, 'fb.com')) {
                return 'facebook';
            }
            if (str_contains($refLower, 'tiktok.com')) {
                return 'tiktok';
            }
            if (str_contains($refLower, 'google.')) {
                return 'google';
            }
        }

        // 4. Default to rawSource if valid word, else direct
        if (! empty($rawSource) && in_array($rawSource, ['direct', 'website', 'organic', 'api'], true)) {
            return 'direct';
        }

        return ! empty($rawSource) ? $rawSource : 'direct';
    }

    private function detectDeviceType(string $userAgent): string
    {
        $ua = strtolower($userAgent);

        if (str_contains($ua, 'tablet') || str_contains($ua, 'ipad')) {
            return 'tablet';
        }

        if (str_contains($ua, 'mobile') || str_contains($ua, 'android') || str_contains($ua, 'iphone')) {
            return 'mobile';
        }

        return 'desktop';
    }
}
