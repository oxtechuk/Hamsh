<?php

declare(strict_types=1);

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Employee;
use Illuminate\Http\Request;

final class TrackingController extends Controller
{
    public function index(Request $request)
    {
        $tab = $request->input('tab', 'sources'); // 'sources' or 'kanban'

        // 1. Data for Traffic Sources & Fraud Tracking Tab
        $dateFilter = $request->input('date_range', 'this_month');
        $baseQuery = Booking::query();

        if ($dateFilter === 'today') {
            $baseQuery->whereDate('created_at', today());
        } elseif ($dateFilter === 'yesterday') {
            $baseQuery->whereDate('created_at', today()->subDay());
        } elseif ($dateFilter === 'this_week') {
            $baseQuery->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        } elseif ($dateFilter === 'this_month') {
            $baseQuery->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()]);
        }

        // Summary KPIs
        $totalOrders = (clone $baseQuery)->count();
        $suspiciousOrders = (clone $baseQuery)->where('is_suspicious', true)->count();
        $verifiedOrders = $totalOrders - $suspiciousOrders;
        $soldOrders = (clone $baseQuery)->where('status', 'sold')->count();

        // Platform breakdown
        $platforms = ['snapchat', 'instagram', 'facebook', 'tiktok', 'google', 'direct', 'other'];
        $platformStats = [];

        foreach ($platforms as $platform) {
            $pQuery = (clone $baseQuery)->where(function ($q) use ($platform) {
                if ($platform === 'other') {
                    $q->whereNotIn('traffic_source', ['snapchat', 'instagram', 'facebook', 'tiktok', 'google', 'direct'])
                        ->orWhereNull('traffic_source');
                } else {
                    $q->where('traffic_source', $platform);
                }
            });

            $pTotal = (clone $pQuery)->count();
            $pSold = (clone $pQuery)->where('status', 'sold')->count();
            $pSuspicious = (clone $pQuery)->where('is_suspicious', true)->count();
            $meta = Booking::TRAFFIC_SOURCES_META[$platform] ?? Booking::TRAFFIC_SOURCES_META['other'];

            $platformStats[$platform] = [
                'key' => $platform,
                'label' => $meta['label'],
                'short_label' => $meta['short_label'],
                'color' => $meta['color'],
                'bg_class' => $meta['bg_class'],
                'icon' => $meta['icon'],
                'total' => $pTotal,
                'sold' => $pSold,
                'suspicious' => $pSuspicious,
                'share_percent' => $totalOrders > 0 ? round(($pTotal / $totalOrders) * 100, 1) : 0,
                'conversion_rate' => $pTotal > 0 ? round(($pSold / $pTotal) * 100, 1) : 0,
            ];
        }

        // Determine top performing channel
        $sortedPlatforms = collect($platformStats)->sortByDesc('total');
        $topPlatform = $sortedPlatforms->first()['label'] ?? 'مباشر (Direct)';

        // Detailed Orders Query
        $ordersQuery = (clone $baseQuery)->with(['car.brand', 'employee'])->latest();

        if ($request->filled('source') && $request->source !== 'all') {
            if ($request->source === 'other') {
                $ordersQuery->whereNotIn('traffic_source', ['snapchat', 'instagram', 'facebook', 'tiktok', 'google', 'direct'])
                    ->orWhereNull('traffic_source');
            } else {
                $ordersQuery->where('traffic_source', $request->source);
            }
        }

        if ($request->filled('fraud') && $request->fraud !== 'all') {
            if ($request->fraud === 'suspicious') {
                $ordersQuery->where('is_suspicious', true);
            } elseif ($request->fraud === 'clean') {
                $ordersQuery->where('is_suspicious', false);
            }
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $ordersQuery->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = trim((string) $request->search);
            $ordersQuery->where(function ($q) use ($s) {
                $q->where('client_name', 'like', "%{$s}%")
                    ->orWhere('client_phone', 'like', "%{$s}%")
                    ->orWhere('campaign_name', 'like', "%{$s}%")
                    ->orWhere('city', 'like', "%{$s}%");
            });
        }

        $orders = $ordersQuery->paginate(20)->withQueryString();

        // 2. Data for Kanban Board
        $columns = [
            'new' => ['label' => 'جديد',        'color' => '#1877F2', 'count' => 0],
            'contacted' => ['label' => 'تم التواصل',    'color' => '#0DCAF0', 'count' => 0],
            'interested' => ['label' => 'مهتم',         'color' => '#FF9800', 'count' => 0],
            'rejected' => ['label' => 'مرفوض',        'color' => '#dc3545', 'count' => 0],
            'sold' => ['label' => 'تم البيع ✓',   'color' => '#198754', 'count' => 0],
        ];

        $kanbanBookings = Booking::with(['car.brand', 'assignedTo'])->withCount('notes_list')
            ->latest()
            ->get()
            ->groupBy(function ($b) {
                return array_key_exists($b->status, Booking::STATUSES) ? $b->status : 'new';
            });

        foreach ($columns as $key => &$col) {
            $col['items'] = $kanbanBookings[$key] ?? collect();
            $col['count'] = $col['items']->count();
        }

        $statuses = Booking::STATUSES;
        $employees = Employee::where('is_active', true)->get();

        return view('crm.tracking.index', compact(
            'tab',
            'dateFilter',
            'totalOrders',
            'verifiedOrders',
            'suspiciousOrders',
            'soldOrders',
            'topPlatform',
            'platformStats',
            'orders',
            'columns',
            'statuses',
            'employees'
        ));
    }

    /**
     * Toggles whether an order is flagged as suspicious/fake.
     */
    public function toggleSuspicious(Booking $booking)
    {
        $newStatus = ! $booking->is_suspicious;
        $flags = $booking->fraud_flags ?? [];

        if ($newStatus) {
            $flags[] = 'تم وضع علامة مشكوك فيه يدوياً بواسطة الإدارة';
            $booking->update([
                'is_suspicious' => true,
                'fraud_score' => max(60, $booking->fraud_score),
                'fraud_flags' => array_values(array_unique($flags)),
            ]);
            $message = 'تم وسم الطلب كطلب مشكوك فيه / وهمي';
        } else {
            $booking->update([
                'is_suspicious' => false,
                'fraud_score' => 0,
            ]);
            $message = 'تم تأكيد موثوقية الطلب بنجاح';
        }

        if (request()->expectsJson()) {
            return response()->json([
                'success' => true,
                'is_suspicious' => $booking->is_suspicious,
                'message' => $message,
            ]);
        }

        return back()->with('success', $message);
    }
}
