<?php

declare(strict_types=1);

namespace App\Services\Api\Store\Helpers;

final class InstallmentCalculator
{
    public function calculate(float $principal, int $totalMonths, float $annualRate, float $lastPayment = 0.0): float
    {
        if ($totalMonths <= 0) {
            return 0;
        }

        $monthlyRate = ($annualRate / 100) / 12;

        if ($monthlyRate <= 0) {
            return max(0, ($principal - $lastPayment) / $totalMonths);
        }

        $factor = pow(1 + $monthlyRate, $totalMonths);

        return max(0, (($principal * $factor - $lastPayment) * $monthlyRate) / ($factor - 1));
    }
}
