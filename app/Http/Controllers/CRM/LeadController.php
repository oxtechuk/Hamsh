<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Jobs\SendWhatsAppCampaignMessage;
use App\Models\Car;
use App\Models\ContactSource;
use App\Models\Employee;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::with(['contactSource', 'car.brand', 'car.category', 'employee'])
            ->withCount('orders')
            ->latest();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('client_name', 'like', "%{$s}%")
                    ->orWhere('client_phone', 'like', "%{$s}%")
                    ->orWhere('client_email', 'like', "%{$s}%");
            });
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('contact_source_id')) {
            $query->where('contact_source_id', $request->contact_source_id);
        }
        if ($request->filled('employee_id')) {
            $query->where('assigned_to', $request->employee_id);
        }
        if ($request->filled('date')) {
            $query->whereDate('started_at', $request->date);
        }

        $leads = $query->paginate(20)->withQueryString();
        $statuses = Lead::STATUSES;
        $sources = ContactSource::activeOrdered()->get();
        $employees = Employee::where('is_active', true)->orderBy('name')->get();

        // Calculate dynamic real-time stats
        $totalLeads = Lead::count();
        $newLeads = Lead::where('status', 'new')->count();
        $activeLeads = Lead::whereIn('status', ['new', 'contacted', 'interested', 'negotiation'])->count();
        $convertedLeads = Lead::where('status', 'converted')->count();

        // Monthly comparison
        $thisMonthCount = Lead::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count();
        $lastMonthCount = Lead::whereMonth('created_at', now()->subMonth()->month)->whereYear('created_at', now()->subMonth()->year)->count();

        $monthlyGrowth = $lastMonthCount > 0
            ? round((($thisMonthCount - $lastMonthCount) / $lastMonthCount) * 100, 1)
            : ($thisMonthCount > 0 ? 100 : 0);

        $activePercentage = $totalLeads > 0 ? round(($activeLeads / $totalLeads) * 100, 1) : 0;
        $conversionRate = $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 1) : 0;
        $newThisMonth = Lead::where('status', 'new')->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count();

        $stats = [
            'total' => $totalLeads,
            'new' => $newLeads,
            'active' => $activeLeads,
            'active_percentage' => $activePercentage,
            'converted' => $convertedLeads,
            'conversion_rate' => $conversionRate,
            'this_month' => $thisMonthCount,
            'new_this_month' => $newThisMonth,
            'monthly_growth' => $monthlyGrowth,
        ];

        return view('crm.leads.index', compact('leads', 'statuses', 'sources', 'employees', 'stats'));
    }

    public function create()
    {
        $statuses = Lead::STATUSES;
        $sources = ContactSource::activeOrdered()->get();
        $cars = Car::with('brand')->where('is_active', true)->orderByDesc('id')->get();
        $employees = Employee::where('is_active', true)->orderBy('name')->get();

        return view('crm.leads.create', compact('statuses', 'sources', 'cars', 'employees'));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        Lead::create($data);

        return redirect()->route('crm.leads.index')->with('success', __('تم إضافة العميل بنجاح'));
    }

    public function show(Lead $lead)
    {
        $lead->load(['contactSource', 'car.brand', 'employee', 'orders.car.brand']);

        return view('crm.leads.show', compact('lead'));
    }

    public function edit(Lead $lead)
    {
        $statuses = Lead::STATUSES;
        $sources = ContactSource::activeOrdered()->get();
        $cars = Car::with('brand')->where('is_active', true)->orderByDesc('id')->get();
        $employees = Employee::where('is_active', true)->orderBy('name')->get();

        return view('crm.leads.edit', compact('lead', 'statuses', 'sources', 'cars', 'employees'));
    }

    public function update(Request $request, Lead $lead)
    {
        $data = $this->validated($request);
        $lead->update($data);

        return redirect()->route('crm.leads.show', $lead)->with('success', __('تم تحديث بيانات العميل'));
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();

        return redirect()->route('crm.leads.index')->with('success', __('تم حذف السجل'));
    }

    public function whatsappCampaign(Request $request)
    {
        $request->validate([
            'lead_ids' => 'required|array|min:1',
            'lead_ids.*' => 'integer|exists:leads,id',
            'message' => 'required|string|max:2000',
        ]);

        $leads = Lead::whereIn('id', $request->lead_ids)
            ->whereNotNull('client_phone')
            ->where('client_phone', '!=', '')
            ->get();

        if ($leads->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => __('لا يوجد عملاء بأرقام هواتف صالحة'),
            ], 422);
        }

        $delay = 0;
        foreach ($leads as $lead) {
            SendWhatsAppCampaignMessage::dispatch($lead->id, $request->message)
                ->delay(now()->addSeconds($delay));
            $delay += 1;
        }

        return response()->json([
            'success' => true,
            'total' => $leads->count(),
            'message' => __('تم جدولة إرسال :count رسالة واتساب', ['count' => $leads->count()]),
        ]);
    }

    private function validated(Request $request): array
    {
        $statuses = array_keys(Lead::STATUSES);

        $data = $request->validate([
            'client_name' => 'required|string|max:200',
            'client_phone' => 'nullable|string|max:40',
            'client_email' => 'nullable|email|max:200',
            'contact_source_id' => 'required|exists:contact_sources,id',
            'status' => ['required', Rule::in($statuses)],
            'started_at' => 'required|date',
            'status_details' => 'nullable|string|max:5000',
            'car_id' => 'nullable|exists:cars,id',
            'assigned_to' => 'nullable|exists:employees,id',
        ]);

        return $data;
    }
}
