<?php

declare(strict_types=1);

namespace App\Services\Api\Store\Helpers;

final class InstallmentCalculator
{
    public function calculate(float $principal, int $totalMonths, float $annualRate, float $lastPayment = 0.0): float
    {
        if ($totalMonths <= 0) {
            return 0.0;
        }

        $durationYears = $totalMonths / 12;
        $totalInterest = $principal * ($annualRate / 100) * $durationYears;
        $totalToRepay = $principal + $totalInterest;
        $repayableInInstallments = max(0, $totalToRepay - $lastPayment);

        return round($repayableInInstallments / $totalMonths);
    }
}
