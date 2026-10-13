<?php

declare(strict_types=1);

namespace App\Services\Tracking;

use App\Models\Booking;

final class FraudDetectionService
{
    /**
     * Inspects booking data and context to detect spam, bots, or fake requests.
     *
     * @param  array<string, mixed>  $payload
     * @return array{
     *     fraud_score: int,
     *     is_suspicious: bool,
     *     fraud_flags: array<string>,
     * }
     */
    public function inspect(array $payload, ?string $ip = null): array
    {
        $score = 0;
        $flags = [];

        // 1. Honeypot check (hidden field filled by bots)
        if (! empty($payload['hp_field']) || ! empty($payload['website_hp'])) {
            $score += 80;
            $flags[] = 'ملء حقل الفخ المخفي (Bot Detected)';
        }

        // 2. Client phone check
        $phone = preg_replace('/[^0-9]/', '', (string) ($payload['client_phone'] ?? ''));
        if (empty($phone)) {
            $score += 50;
            $flags[] = 'رقم الهاتف فارغ';
        } else {
            // Check Saudi format (should normalize to 05XXXXXXXX or 9665XXXXXXXX)
            $isSaudi = preg_match('/^(05|5|9665)[0-9]{8}$/', $phone);
            if (! $isSaudi && strlen($phone) < 9) {
                $score += 35;
                $flags[] = 'تنسيق رقم هاتف غير صالح أو رقم ناقص';
            }

            // Check repeated / dummy sequences
            if (preg_match('/(\d)\1{6,}/', $phone) || in_array($phone, ['0500000000', '0555555555', '0512345678', '0599999999'], true)) {
                $score += 45;
                $flags[] = 'رقم هاتف وهمي أو أرقام متكررة';
            }

            // Duplicate booking check within 24 hours
            $duplicateCount = Booking::where('client_phone', $payload['client_phone'])
                ->where('created_at', '>=', now()->subDay())
                ->count();

            if ($duplicateCount > 0) {
                $score += 30;
                $flags[] = "طلب مكرر لنفس رقم الهاتف خلال 24 ساعة ($duplicateCount طلب سابق)";
            }
        }

        // 3. Client name check
        $name = trim((string) ($payload['client_name'] ?? ''));
        if (mb_strlen($name) < 3) {
            $score += 25;
            $flags[] = 'اسم العميل قصير جداً أو غير مكتمل';
        }

        // 4. IP rate check
        if (! empty($ip)) {
            $ipCount = Booking::where('ip_address', $ip)
                ->where('created_at', '>=', now()->subDay())
                ->count();

            if ($ipCount >= 4) {
                $score += 35;
                $flags[] = "تكرار الطلب أكثر من 3 مرات من نفس الـ IP ($ipCount طلبات)";
            }
        }

        // 5. Fill duration check (if supplied by frontend in seconds)
        if (isset($payload['form_duration']) && is_numeric($payload['form_duration'])) {
            $duration = (float) $payload['form_duration'];
            if ($duration > 0 && $duration < 2.5) {
                $score += 40;
                $flags[] = 'إرسال سريع جداً للنموذج (أقل من 3 ثوانٍ - شبهة بوت)';
            }
        }

        $isSuspicious = $score >= 40;

        return [
            'fraud_score' => min(100, $score),
            'is_suspicious' => $isSuspicious,
            'fraud_flags' => $flags,
        ];
    }
}
