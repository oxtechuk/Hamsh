<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class TrackingService
{
    /**
     * Dispatch Lead event to Meta, TikTok, and Snapchat Conversions APIs.
     *
     * @param array{
     *     name?: string|null,
     *     phone?: string|null,
     *     email?: string|null,
     *     value?: float|int|null,
     *     currency?: string|null,
     *     event_source_url?: string|null,
     *     event_id?: string|null,
     * } $data
     */
    public static function sendLead(array $data): void
    {
        try {
            $settings = Setting::whereIn('key', [
                'meta_pixel_id',
                'meta_capi_token',
                'tiktok_pixel_id',
                'tiktok_access_token',
                'snap_pixel_id',
                'snap_capi_token',
            ])->pluck('value', 'key');

            $metaPixelId = !empty($settings['meta_pixel_id']) ? $settings['meta_pixel_id'] : '1412701917496338';
            $metaToken = !empty($settings['meta_capi_token']) ? $settings['meta_capi_token'] : 'EAAP6hWDA4mUBSq6CKWIfJAI2i12xR6p7WBzZCRxUsWo3ZAnwqStvWsg8mpcWq8GocyD8nRxZAQ15bHwpwOZCWrlbeprj3cBl9qat8zr2jZBqZAZCGMR1HZBWxAYsPgmoHzDeNPDCz4R3BXsa33dSc43DaLRc4cUQ1aRsCtXwBM353hQoQi7In6I29hPMfqftZBwZDZD';

            $tiktokPixelId = !empty($settings['tiktok_pixel_id']) ? $settings['tiktok_pixel_id'] : 'DB0V6ORC77U2LIICSES0';
            $tiktokToken = !empty($settings['tiktok_access_token']) ? $settings['tiktok_access_token'] : '2460e78c60008e3f5c6a221d5192af7ae0f5b3e6';

            $snapPixelId = !empty($settings['snap_pixel_id']) ? $settings['snap_pixel_id'] : '5954db06-5cce-4123-aa78-fa8be6e6db01';
            $snapToken = !empty($settings['snap_capi_token']) ? $settings['snap_capi_token'] : 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzY5NTkyNDQwLCJzdWIiOiI0NTE4NTIzNi0xZTVhLTQyM2UtOTQ3Yy1jNWRhMTI5NjAyM2V-UFJPRFVDVElPTn43MWY4MTE1My0xZDc1LTQ0ZDQtOGM5Ny05NzRkMjFhMjhlYTQifQ.Uuj7oapEO2zUudgHpKzVFYox8UB9MRTVTGqt_SPQOcg';

            $ip = request()->ip() ?? '127.0.0.1';
            $userAgent = request()->userAgent() ?? 'Mozilla/5.0';
            $normalizedPhone = self::normalizePhone($data['phone'] ?? null);
            $hashedPhone = $normalizedPhone ? hash('sha256', $normalizedPhone) : null;
            $normalizedEmail = self::normalizeEmail($data['email'] ?? null);
            $hashedEmail = $normalizedEmail ? hash('sha256', $normalizedEmail) : null;

            // 1. Meta CAPI
            if (!empty($metaPixelId) && !empty($metaToken)) {
                self::sendMetaLead($metaPixelId, $metaToken, [
                    'ip' => $ip,
                    'user_agent' => $userAgent,
                    'hashed_phone' => $hashedPhone,
                    'hashed_email' => $hashedEmail,
                    'value' => $data['value'] ?? 0,
                    'currency' => $data['currency'] ?? 'SAR',
                    'event_source_url' => $data['event_source_url'] ?? request()->fullUrl(),
                ]);
            }

            // 2. TikTok Events API
            if (!empty($tiktokPixelId) && !empty($tiktokToken)) {
                self::sendTikTokLead($tiktokPixelId, $tiktokToken, [
                    'ip' => $ip,
                    'user_agent' => $userAgent,
                    'hashed_phone' => $hashedPhone,
                    'hashed_email' => $hashedEmail,
                    'value' => $data['value'] ?? 0,
                    'currency' => $data['currency'] ?? 'SAR',
                ]);
            }

            // 3. Snapchat CAPI
            if (!empty($snapPixelId) && !empty($snapToken)) {
                self::sendSnapLead($snapPixelId, $snapToken, [
                    'ip' => $ip,
                    'user_agent' => $userAgent,
                    'hashed_phone' => $hashedPhone,
                    'hashed_email' => $hashedEmail,
                    'value' => $data['value'] ?? 0,
                    'currency' => $data['currency'] ?? 'SAR',
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('TrackingService::sendLead failed: ' . $e->getMessage());
        }
    }

    private static function sendMetaLead(string $pixelId, string $token, array $context): void
    {
        try {
            $userData = [
                'client_ip_address' => $context['ip'],
                'client_user_agent' => $context['user_agent'],
            ];
            if (!empty($context['hashed_phone'])) {
                $userData['ph'] = [$context['hashed_phone']];
            }
            if (!empty($context['hashed_email'])) {
                $userData['em'] = [$context['hashed_email']];
            }

            Http::timeout(3)->post("https://graph.facebook.com/v19.0/{$pixelId}/events", [
                'data' => [
                    [
                        'event_name' => 'Lead',
                        'event_time' => time(),
                        'action_source' => 'website',
                        'event_source_url' => $context['event_source_url'],
                        'user_data' => $userData,
                        'custom_data' => [
                            'currency' => $context['currency'],
                            'value' => (float) $context['value'],
                        ],
                    ],
                ],
                'access_token' => $token,
            ]);
        } catch (\Throwable $e) {
            Log::debug('Meta CAPI error: ' . $e->getMessage());
        }
    }

    private static function sendTikTokLead(string $pixelId, string $token, array $context): void
    {
        try {
            $user = [];
            if (!empty($context['hashed_phone'])) {
                $user['phone_number'] = $context['hashed_phone'];
            }
            if (!empty($context['hashed_email'])) {
                $user['email'] = $context['hashed_email'];
            }

            Http::timeout(3)
                ->withHeaders([
                    'Access-Token' => $token,
                    'Content-Type' => 'application/json',
                ])
                ->post('https://business-api.tiktok.com/open_api/v1.3/event/track/', [
                    'pixel_code' => $pixelId,
                    'event' => 'SubmitForm',
                    'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
                    'context' => [
                        'user' => $user,
                        'ip' => $context['ip'],
                        'user_agent' => $context['user_agent'],
                    ],
                    'properties' => [
                        'currency' => $context['currency'],
                        'value' => (float) $context['value'],
                    ],
                ]);
        } catch (\Throwable $e) {
            Log::debug('TikTok Events API error: ' . $e->getMessage());
        }
    }

    private static function sendSnapLead(string $pixelId, string $token, array $context): void
    {
        try {
            $payload = [
                'pixel_id' => $pixelId,
                'event_type' => 'SIGN_UP',
                'event_conversion_type' => 'WEB',
                'timestamp' => time(),
                'user_agent' => $context['user_agent'],
                'ip_address' => $context['ip'],
            ];
            if (!empty($context['hashed_phone'])) {
                $payload['hashed_phone_number'] = $context['hashed_phone'];
            }
            if (!empty($context['hashed_email'])) {
                $payload['hashed_email'] = $context['hashed_email'];
            }
            if (!empty($context['value'])) {
                $payload['price'] = (float) $context['value'];
                $payload['currency'] = $context['currency'];
            }

            Http::timeout(3)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $token,
                    'Content-Type' => 'application/json',
                ])
                ->post('https://tr.snapchat.com/v2/conversion', $payload);
        } catch (\Throwable $e) {
            Log::debug('Snap CAPI error: ' . $e->getMessage());
        }
    }

    private static function normalizePhone(?string $phone): ?string
    {
        if (empty($phone)) {
            return null;
        }

        $cleaned = preg_replace('/[^\d]/', '', $phone);
        if (empty($cleaned)) {
            return null;
        }

        // Standardize Saudi phone numbers
        if (str_starts_with($cleaned, '05') && strlen($cleaned) === 10) {
            $cleaned = '966' . substr($cleaned, 1);
        } elseif (str_starts_with($cleaned, '5') && strlen($cleaned) === 9) {
            $cleaned = '966' . $cleaned;
        }

        return $cleaned;
    }

    private static function normalizeEmail(?string $email): ?string
    {
        if (empty($email)) {
            return null;
        }

        return strtolower(trim($email));
    }
}
