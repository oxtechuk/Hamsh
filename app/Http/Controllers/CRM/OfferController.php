<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index()
    {
        $offers = Offer::with('car.brand')->latest()->paginate(20);
        $cars = Car::where('is_active', true)->with('brand')->get();

        return view('crm.offers.index', compact('offers', 'cars'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'car_ids' => 'required|array|min:1',
            'car_ids.*' => 'exists:cars,id',
            'title' => 'required|array',
            'title.ar' => 'required|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'description' => 'nullable|array',
            'description.ar' => 'nullable|string',
            'description.en' => 'nullable|string',
            'offer_category' => 'nullable|string|max:255',
            'user_rated_count' => 'nullable|integer|min:0',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'special_price' => 'nullable|numeric|min:0',
            'special_installment' => 'nullable|numeric|min:0',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
            'image' => 'nullable|image|max:4096',
        ]);

        if (empty($data['title']['en'])) {
            $data['title']['en'] = $data['title']['ar'];
        }

        $data['car_id'] = $request->car_ids[0] ?? null;

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('offers', 'public');
        }

        $data['user_rated_count'] = isset($data['user_rated_count']) && $data['user_rated_count'] !== null ? (int) $data['user_rated_count'] : 0;

        $offer = Offer::create($data);
        $offer->cars()->sync($request->car_ids);

        return back()->with('success', 'تمت إضافة العرض بنجاح');
    }

    public function update(Request $request, Offer $offer)
    {
        $data = $request->validate([
            'car_ids' => 'required|array|min:1',
            'car_ids.*' => 'exists:cars,id',
            'title' => 'required|array',
            'title.ar' => 'required|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'description' => 'nullable|array',
            'description.ar' => 'nullable|string',
            'description.en' => 'nullable|string',
            'offer_category' => 'nullable|string|max:255',
            'user_rated_count' => 'nullable|integer|min:0',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'special_price' => 'nullable|numeric|min:0',
            'special_installment' => 'nullable|numeric|min:0',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
            'image' => 'nullable|image|max:4096',
        ]);
        $data['is_active'] = $request->boolean('is_active');

        if (empty($data['title']['en'])) {
            $data['title']['en'] = $data['title']['ar'];
        }

        $data['car_id'] = $request->car_ids[0] ?? null;

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($offer->image && \Storage::disk('public')->exists($offer->image)) {
                \Storage::disk('public')->delete($offer->image);
            }
            $data['image'] = $request->file('image')->store('offers', 'public');
        }

        if (array_key_exists('user_rated_count', $data)) {
            $data['user_rated_count'] = isset($data['user_rated_count']) && $data['user_rated_count'] !== null ? (int) $data['user_rated_count'] : 0;
        }

        $offer->update($data);
        $offer->cars()->sync($request->car_ids);

        return back()->with('success', 'تم تحديث العرض بنجاح');
    }

    public function destroy(Offer $offer)
    {
        $offer->delete();

        return back()->with('success', 'تم حذف العرض');
    }
}
