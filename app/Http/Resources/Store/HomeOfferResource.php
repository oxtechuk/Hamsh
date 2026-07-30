<?php

namespace App\Http\Resources\Store;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeOfferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image' => $this->image,
            'offer_category' => $this->offer_category,
            'user_rated_count' => $this->user_rated_count,
            'installment_starts_from' => $this->special_installment ?? $this->cars?->min('min_installment'),
            'ends_at' => $this->ends_at?->locale('ar')->isoFormat('D MMMM YYYY'),
            'highlight' => $this->when(
                $this->relationLoaded('car') && $this->car?->is_highlighted && $this->car->is_highlighted !== 'none',
                fn () => $this->car->is_highlighted,
            ),
            'cars_count' => $this->whenCounted('cars'),
            'countdown' => $this->when($this->ends_at !== null, function () {
                $now = now();
                $end = $this->ends_at;

                if ($end->isPast()) {
                    return ['days' => 0, 'hours' => 0, 'minutes' => 0, 'seconds' => 0, 'is_expired' => true];
                }

                $diff = $now->diff($end);

                return [
                    'days' => $diff->days,
                    'hours' => $diff->h,
                    'minutes' => $diff->i,
                    'seconds' => $diff->s,
                    'is_expired' => false,
                ];
            }),
        ];
    }
}
