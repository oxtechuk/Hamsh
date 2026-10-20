<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Jobs\SendWhatsAppCampaignMessage;
use App\Models\Car;
use App\Models\ContactSource;
use App\Models\Employee;
use App\Models\Lead;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::with(['contactSource', 'car.brand', 'car.category', 'employee', 'orders.employee'])
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

    public function export(Request $request)
    {
        $query = Lead::with(['contactSource', 'car.brand', 'employee', 'orders.employee'])
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

        $leads = $query->get();

        $csv = "\xEF\xBB\xBF"; // UTF-8 BOM for Arabic Excel
        $headers = [
            'رقم العميل',
            'اسم العميل',
            'رقم الجوال',
            'البريد الإلكتروني',
            'المصدر',
            'السيارة المطلوبة',
            'الراتب الشهري (ر.س)',
            'الالتزامات الشهرية (ر.س)',
            'صافي الراتب التقديري (ر.س)',
            'المسؤول',
            'الحالة',
            'تاريخ بدء المتابعة',
            'الملاحظات / تفاصيل الحالة',
        ];

        $csv .= implode(',', array_map(fn ($h) => '"'.str_replace('"', '""', $h).'"', $headers))."\r\n";

        foreach ($leads as $lead) {
            $carName = $lead->car ? (($lead->car->brand?->name ?? '').' '.$lead->car->name) : '—';
            $salaryVal = $lead->salary !== null ? number_format((float) $lead->salary, 2, '.', '') : '';
            $obligationsVal = $lead->obligations !== null ? number_format((float) $lead->obligations, 2, '.', '') : '';
            $netSalary = ($lead->salary !== null) ? number_format((float) max(0, (float) $lead->salary - (float) ($lead->obligations ?? 0)), 2, '.', '') : '';
            $employeeName = ($lead->effective_employee ?? $lead->employee)?->name ?: 'غير محدد';

            $row = [
                $lead->id,
                $lead->client_name,
                $lead->client_phone ?: '',
                $lead->client_email ?: '',
                $lead->contactSource?->name ?: '',
                $carName,
                $salaryVal,
                $obligationsVal,
                $netSalary,
                $employeeName,
                $lead->status_label,
                $lead->started_at?->format('Y-m-d') ?: '',
                str_replace(["\r", "\n", '"'], [' ', ' ', '""'], (string) ($lead->status_details ?? '')),
            ];

            $escaped = array_map(fn ($val) => '"'.str_replace('"', '""', (string) $val).'"', $row);
            $csv .= implode(',', $escaped)."\r\n";
        }

        $filename = 'leads_export_'.now()->format('Y-m-d_His').'.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    public function downloadSampleExcel()
    {
        $csv = "\xEF\xBB\xBF";
        $headers = [
            'اسم العميل',
            'رقم الجوال',
            'البريد الإلكتروني',
            'المصدر',
            'السيارة المطلوبة',
            'الراتب الشهري',
            'الالتزامات الشهرية',
            'مسؤول المتابعة',
            'الحالة',
            'تاريخ بدء المتابعة',
            'الملاحظات',
        ];

        $csv .= implode(',', array_map(fn ($h) => '"'.str_replace('"', '""', $h).'"', $headers))."\r\n";

        $sample1 = [
            'محمد أحمد علي',
            '0501234567',
            'mohamed@example.com',
            'إعلان فيسبوك',
            'تويوتا كامري',
            '12000',
            '2500',
            'أحمد خالد',
            'جديد',
            now()->format('Y-m-d'),
            'مهتم بشراء سيارة بنظام التمويل وطلب معرفة نسبة القبول',
        ];
        $sample2 = [
            'سارة عبد الله الشمري',
            '0559876543',
            'sara@example.com',
            'المتجر الإلكتروني',
            'هيونداي توسان',
            '15500',
            '0',
            '',
            'تم التواصل',
            now()->format('Y-m-d'),
            'تم التواصل معها وترغب في عرض أسعار كاش',
        ];

        foreach ([$sample1, $sample2] as $row) {
            $escaped = array_map(fn ($val) => '"'.str_replace('"', '""', (string) $val).'"', $row);
            $csv .= implode(',', $escaped)."\r\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="sample_leads_template.csv"',
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension());

        if (in_array($extension, ['xlsx', 'xls'])) {
            $rows = $this->parseXlsxFile($file->getRealPath());
        } else {
            $rows = $this->parseCsvFile($file->getRealPath());
        }

        if (empty($rows)) {
            return back()->with('error', __('الملف المرفوع فارغ أو بتنسيق غير مدعوم'));
        }

        $header = array_shift($rows);
        $headerMap = $this->mapImportHeaders($header);

        $defaultSource = ContactSource::firstOrCreate(
            ['name' => 'استيراد إكسيل'],
            ['is_active' => true]
        );

        $importedCount = 0;

        foreach ($rows as $row) {
            if (empty(array_filter($row, fn ($v) => ! empty(trim((string) $v))))) {
                continue;
            }

            $name = isset($headerMap['name']) && isset($row[$headerMap['name']]) ? trim((string) $row[$headerMap['name']]) : '';
            $phone = isset($headerMap['phone']) && isset($row[$headerMap['phone']]) ? trim((string) $row[$headerMap['phone']]) : null;

            if (empty($name) && empty($phone)) {
                continue;
            }

            if (empty($name)) {
                $name = 'عميل '.$phone;
            }

            $email = isset($headerMap['email']) && isset($row[$headerMap['email']]) ? trim((string) $row[$headerMap['email']]) : null;
            $sourceText = isset($headerMap['source']) && isset($row[$headerMap['source']]) ? trim((string) $row[$headerMap['source']]) : null;
            $carText = isset($headerMap['car']) && isset($row[$headerMap['car']]) ? trim((string) $row[$headerMap['car']]) : null;
            $empText = isset($headerMap['employee']) && isset($row[$headerMap['employee']]) ? trim((string) $row[$headerMap['employee']]) : null;
            $statusText = isset($headerMap['status']) && isset($row[$headerMap['status']]) ? trim((string) $row[$headerMap['status']]) : 'new';
            $dateText = isset($headerMap['date']) && isset($row[$headerMap['date']]) ? trim((string) $row[$headerMap['date']]) : null;
            $notes = isset($headerMap['notes']) && isset($row[$headerMap['notes']]) ? trim((string) $row[$headerMap['notes']]) : null;

            $salary = null;
            if (isset($headerMap['salary']) && isset($row[$headerMap['salary']])) {
                $rawSalary = preg_replace('/[^\d.]/', '', (string) $row[$headerMap['salary']]);
                if (is_numeric($rawSalary) && (float) $rawSalary >= 0) {
                    $salary = (float) $rawSalary;
                }
            }

            $obligations = null;
            if (isset($headerMap['obligations']) && isset($row[$headerMap['obligations']])) {
                $rawObligations = preg_replace('/[^\d.]/', '', (string) $row[$headerMap['obligations']]);
                if (is_numeric($rawObligations) && (float) $rawObligations >= 0) {
                    $obligations = (float) $rawObligations;
                }
            }

            // Resolve contact source
            $sourceId = $defaultSource->id;
            if (! empty($sourceText)) {
                $foundSource = ContactSource::where('name', 'like', "%{$sourceText}%")->first();
                if ($foundSource) {
                    $sourceId = $foundSource->id;
                } else {
                    $createdSource = ContactSource::firstOrCreate(
                        ['name' => $sourceText],
                        ['is_active' => true]
                    );
                    $sourceId = $createdSource->id;
                }
            }

            // Match car
            $carId = null;
            if (! empty($carText)) {
                $matchedCar = Car::where('name', 'like', "%{$carText}%")->first();
                if ($matchedCar) {
                    $carId = $matchedCar->id;
                }
            }

            // Match employee
            $assignedTo = auth('employee')->id() ?? auth()->id();
            if (! empty($empText)) {
                $matchedEmp = Employee::where('name', 'like', "%{$empText}%")->first();
                if ($matchedEmp) {
                    $assignedTo = $matchedEmp->id;
                }
            }

            // Normalize status
            $status = $this->normalizeStatus($statusText);

            // Parse started_at
            $startedAt = now()->toDateString();
            if (! empty($dateText)) {
                try {
                    $startedAt = Carbon::parse($dateText)->toDateString();
                } catch (\Throwable $e) {
                    $startedAt = now()->toDateString();
                }
            }

            Lead::create([
                'client_name' => $name,
                'client_phone' => $phone ?: null,
                'client_email' => $email ?: null,
                'contact_source_id' => $sourceId,
                'status' => $status,
                'started_at' => $startedAt,
                'status_details' => $notes,
                'car_id' => $carId,
                'assigned_to' => $assignedTo,
                'salary' => $salary,
                'obligations' => $obligations,
            ]);

            $importedCount++;
        }

        return back()->with('success', "تم استيراد {$importedCount} عميل بنجاح من ملف الإكسيل");
    }

    private function parseXlsxFile(string $filePath): array
    {
        $zip = new \ZipArchive;
        if ($zip->open($filePath) !== true) {
            return [];
        }

        $sharedStrings = [];
        $sharedStringsXml = $zip->getFromName('xl/sharedStrings.xml');
        if ($sharedStringsXml) {
            $xml = simplexml_load_string($sharedStringsXml);
            if ($xml && isset($xml->si)) {
                foreach ($xml->si as $si) {
                    if (isset($si->t)) {
                        $sharedStrings[] = (string) $si->t;
                    } elseif (isset($si->r)) {
                        $text = '';
                        foreach ($si->r as $r) {
                            $text .= (string) $r->t;
                        }
                        $sharedStrings[] = $text;
                    } else {
                        $sharedStrings[] = '';
                    }
                }
            }
        }

        $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
        $zip->close();

        if (! $sheetXml) {
            return [];
        }

        $xml = simplexml_load_string($sheetXml);
        if (! $xml || ! isset($xml->sheetData->row)) {
            return [];
        }

        $rows = [];
        foreach ($xml->sheetData->row as $row) {
            $rowData = [];
            $currentCol = 0;
            foreach ($row->c as $cell) {
                $cellRef = (string) $cell['r'];
                preg_match('/([A-Z]+)(\d+)/', $cellRef, $matches);
                $colLetters = $matches[1] ?? '';
                $colIndex = 0;
                for ($i = 0; $i < strlen($colLetters); $i++) {
                    $colIndex = $colIndex * 26 + (ord($colLetters[$i]) - ord('A') + 1);
                }
                $colIndex = max(0, $colIndex - 1);

                while ($currentCol < $colIndex) {
                    $rowData[] = '';
                    $currentCol++;
                }

                $type = (string) $cell['t'];
                $val = (string) $cell->v;
                if ($type === 's' && isset($sharedStrings[(int) $val])) {
                    $val = $sharedStrings[(int) $val];
                } elseif ($type === 'inlineStr' && isset($cell->is->t)) {
                    $val = (string) $cell->is->t;
                }
                $rowData[] = $val;
                $currentCol++;
            }
            $rows[] = $rowData;
        }

        return $rows;
    }

    private function parseCsvFile(string $filePath): array
    {
        $content = file_get_contents($filePath);
        if (str_starts_with($content, "\xEF\xBB\xBF")) {
            $content = substr($content, 3);
        }

        $lines = preg_split('/\r\n|\r|\n/', trim($content));
        if (empty($lines)) {
            return [];
        }

        $firstLine = $lines[0];
        $delimiter = str_contains($firstLine, ';') ? ';' : (str_contains($firstLine, "\t") ? "\t" : ',');

        $rows = [];
        $stream = fopen('php://memory', 'r+');
        fwrite($stream, $content);
        rewind($stream);

        while (($data = fgetcsv($stream, 0, $delimiter)) !== false) {
            $rows[] = $data;
        }
        fclose($stream);

        return $rows;
    }

    private function mapImportHeaders(array $headers): array
    {
        $map = [
            'name' => 0,
            'phone' => 1,
            'email' => null,
            'source' => null,
            'car' => null,
            'salary' => null,
            'obligations' => null,
            'employee' => null,
            'status' => null,
            'date' => null,
            'notes' => null,
        ];

        foreach ($headers as $idx => $h) {
            $hClean = mb_strtolower(trim((string) $h));

            if (preg_match('/^(اسم|الاسم|اسم العميل|العميل|name|client_name)$/u', $hClean)) {
                $map['name'] = $idx;
            } elseif (preg_match('/^(جوال|هاتف|رقم الجوال|رقم الهاتف|الموبايل|phone|mobile|client_phone)$/u', $hClean)) {
                $map['phone'] = $idx;
            } elseif (preg_match('/^(بريد|البريد|البريد الالكتروني|البريد الإلكتروني|email|client_email)$/u', $hClean)) {
                $map['email'] = $idx;
            } elseif (preg_match('/^(مصدر|المصدر|مصدر التواصل|source|contact_source)$/u', $hClean)) {
                $map['source'] = $idx;
            } elseif (preg_match('/^(سيارة|السيارة|السيارة المطلوبة|car|car_name)$/u', $hClean)) {
                $map['car'] = $idx;
            } elseif (preg_match('/^(راتب|الراتب|الراتب الشهري|الدخل|الدخل الشهري|salary|monthly_salary)$/u', $hClean)) {
                $map['salary'] = $idx;
            } elseif (preg_match('/^(التزام|التزامات|الالتزامات|الالتزامات الشهرية|ديون|obligations|monthly_obligations|commitments)$/u', $hClean)) {
                $map['obligations'] = $idx;
            } elseif (preg_match('/^(مسؤول|المسؤول|مسؤول المتابعة|موظف|الموظف|employee|assigned_to)$/u', $hClean)) {
                $map['employee'] = $idx;
            } elseif (preg_match('/^(حالة|الحالة|حالة الطلب|status)$/u', $hClean)) {
                $map['status'] = $idx;
            } elseif (preg_match('/^(تاريخ|التاريخ|تاريخ البدء|تاريخ بدء المتابعة|date|started_at)$/u', $hClean)) {
                $map['date'] = $idx;
            } elseif (preg_match('/^(ملاحظات|الملاحظات|تفاصيل|تفاصيل الحالة|notes|details|status_details)$/u', $hClean)) {
                $map['notes'] = $idx;
            }
        }

        return $map;
    }

    private function normalizeStatus(string $status): string
    {
        $status = mb_strtolower(trim($status));

        return match (true) {
            str_contains($status, 'تواصل') || str_contains($status, 'contact') => 'contacted',
            str_contains($status, 'مهتم') || str_contains($status, 'interest') => 'interested',
            str_contains($status, 'تفاوض') || str_contains($status, 'negotiat') => 'negotiation',
            str_contains($status, 'تحويل') || str_contains($status, 'بيع') || str_contains($status, 'convert') || str_contains($status, 'sold') => 'converted',
            str_contains($status, 'مغلق') || str_contains($status, 'خاسر') || str_contains($status, 'رفض') || str_contains($status, 'lost') => 'lost',
            default => 'new',
        };
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
            'salary' => 'nullable|numeric|min:0',
            'obligations' => 'nullable|numeric|min:0',
        ]);

        return $data;
    }
}
