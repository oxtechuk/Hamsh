<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingDocument;
use App\Models\BookingNote;
use App\Models\Car;
use App\Models\Employee;
use App\Models\Setting;
use App\Notifications\NewBookingNotification;
use App\Services\TwilioWhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with(['car.brand', 'employee', 'latestNote.employee'])->latest();

        // فلترة بالحالة
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // فلترة بنوع الطلب
        if ($request->filled('booking_type')) {
            $query->where('booking_type', $request->booking_type);
        }

        // فلترة بالتاريخ
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        // فلترة بالموظف
        if ($request->filled('employee_id')) {
            $query->where('assigned_to', $request->employee_id);
        }

        if (! auth()->user()->hasRole('admin')) {
            $query->where(function ($q) {
                $q->where('assigned_to', \auth()->id())
                    ->orWhereNull('assigned_to');
            });
        }

        // بحث
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('client_name', 'like', "%$s%")
                    ->orWhere('client_phone', 'like', "%$s%");
            });
        }

        $bookings = $query->paginate(20)->withQueryString();
        $employees = Employee::where('is_active', true)->get();
        $statuses = Booking::STATUSES;
        $bookingTypes = Booking::BOOKING_TYPES_LABELS;
        $cars = Car::with('brand')->where('is_active', true)->get();
        $defaultBank = Booking::getDefaultBank();

        $stats = [
            'new' => Booking::where('status', 'new')->count(),
            'today' => Booking::whereDate('created_at', today())->count(),
            'total' => Booking::count(),
        ];

        return view('crm.bookings.index', compact('bookings', 'employees', 'statuses', 'bookingTypes', 'cars', 'stats', 'defaultBank'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_name' => 'required|string|max:191',
            'client_phone' => 'required|string|max:191',
            'client_email' => 'nullable|email|max:191',
            'car_id' => 'nullable|exists:cars,id',
            'total_price' => 'nullable|numeric|min:0',
            'down_payment' => 'nullable|numeric|min:0',
            'last_payment' => 'nullable|numeric|min:0',
            'duration_years' => 'nullable|integer|min:1|max:10',
            'interest_rate' => 'nullable|numeric|min:0|max:100',
            'monthly_installment' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'type' => 'nullable|string',
            'booking_type' => 'nullable|string|in:test_drive,purchase,finance,inquiry',
            'location' => 'nullable|string|max:500',
        ]);

        $defaultRate = Booking::getDefaultInterestRate();
        $interestRate = $request->filled('interest_rate') && (float) $request->interest_rate > 0
            ? (float) $request->interest_rate
            : $defaultRate;

        $car = $request->car_id ? Car::find($request->car_id) : null;
        $cashPrice = (float) ($request->total_price ?: ($car?->cash_price ?? 0));
        $downPayment = (float) ($request->down_payment ?? 0);
        $durationYears = (int) ($request->duration_years ?? 5);
        $totalMonths = max(1, $durationYears * 12);
        $principal = max(0, $cashPrice - $downPayment);

        $lastPayment = $request->filled('last_payment') ? (float) $request->last_payment : null;
        if ($lastPayment === null && $request->booking_type === 'finance' && $principal > 0) {
            $defaultLastPaymentPct = (float) (Setting::where('key', 'finance_default_last_payment_pct')->value('value') ?? 45);
            $lastPayment = round($principal * ($defaultLastPaymentPct / 100));
        }

        $monthlyInstallment = (float) ($request->monthly_installment ?? 0);
        if ($monthlyInstallment <= 0 && $request->booking_type === 'finance' && $cashPrice > 0) {
            $durationYearsFloat = $totalMonths / 12;
            $totalInterest = $principal * ($interestRate / 100) * $durationYearsFloat;
            $repayable = max(0, ($principal + $totalInterest) - (float) ($lastPayment ?? 0));
            $monthlyInstallment = round($repayable / $totalMonths);
        }

        $totalPrice = (float) ($request->total_price ?? 0);
        if ($totalPrice <= 0) {
            $totalPrice = $request->booking_type === 'finance'
                ? ($monthlyInstallment * $totalMonths) + $downPayment + (float) ($lastPayment ?? 0)
                : $cashPrice;
        }

        $booking = Booking::create([
            'client_name' => $request->client_name,
            'client_phone' => $request->client_phone,
            'client_email' => $request->client_email,
            'car_id' => $request->car_id,
            'total_price' => $totalPrice,
            'down_payment' => $downPayment,
            'last_payment' => $lastPayment,
            'duration_years' => $durationYears,
            'interest_rate' => $interestRate,
            'monthly_installment' => $monthlyInstallment,
            'notes' => $request->notes,
            'booking_type' => $request->booking_type ?? 'finance',
            'location' => $request->location,
            'source' => 'CRM (يدوي)',
            'status' => 'new',
            'assigned_to' => auth('employee')->id(),
        ]);

        return back()->with('success', 'تم إنشاء الطلب بنجاح');
    }

    public function show(Booking $booking)
    {
        $booking->load(['car.brand', 'employee', 'notes_list.employee', 'documents.employee']);
        $employees = Employee::where('is_active', true)->get();
        $statuses = Booking::STATUSES;
        $cars = Car::with('brand')->where('is_active', true)->get();
        $defaultBank = Booking::getDefaultBank();

        return view('crm.bookings.show', compact('booking', 'employees', 'statuses', 'cars', 'defaultBank'));
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:191',
            'client_phone' => 'required|string|max:191',
            'client_email' => 'nullable|email|max:191',
            'city' => 'nullable|string|max:191',
            'car_id' => 'nullable|exists:cars,id',
            'status' => 'required|in:'.implode(',', array_keys(Booking::STATUSES)),
            'assigned_to' => 'nullable|exists:employees,id',
            'booking_type' => 'nullable|string|max:50',
            'total_price' => 'nullable|numeric|min:0',
            'down_payment' => 'nullable|numeric|min:0',
            'last_payment' => 'nullable|numeric|min:0',
            'monthly_installment' => 'nullable|numeric|min:0',
            'interest_rate' => 'nullable|numeric|min:0|max:100',
            'duration_years' => 'nullable|integer|min:1|max:10',
            'preferred_color' => 'nullable|string|max:191',
            'location' => 'nullable|string|max:500',
            'notes' => 'nullable|string',
        ]);

        if (! isset($validated['interest_rate']) || (float) $validated['interest_rate'] <= 0) {
            $validated['interest_rate'] = $booking->interest_rate > 0 ? $booking->interest_rate : Booking::getDefaultInterestRate();
        }

        if (($validated['booking_type'] ?? $booking->booking_type) === 'finance' && empty($validated['monthly_installment'])) {
            $car = ! empty($validated['car_id']) ? Car::find($validated['car_id']) : $booking->car;
            $cashPrice = (float) (! empty($validated['total_price']) ? $validated['total_price'] : ($car?->cash_price ?? 0));
            $downPayment = (float) ($validated['down_payment'] ?? $booking->down_payment ?? 0);
            $lastPayment = (float) ($validated['last_payment'] ?? $booking->last_payment ?? 0);
            $durationYears = (int) ($validated['duration_years'] ?? $booking->duration_years ?? 5);
            $totalMonths = max(1, $durationYears * 12);
            $principal = max(0, $cashPrice - $downPayment);
            $rate = (float) $validated['interest_rate'];

            $durationYearsFloat = $totalMonths / 12;
            $totalInterest = $principal * ($rate / 100) * $durationYearsFloat;
            $repayable = max(0, ($principal + $totalInterest) - $lastPayment);
            $validated['monthly_installment'] = round($repayable / $totalMonths);
        }

        $oldStatus = $booking->status;
        $oldAssigned = $booking->assigned_to;

        $booking->update($validated);

        // سجل تحديث تفاصيل الطلب في الملاحظات
        $logMessage = 'تم تعديل بيانات وتفاصيل الطلب بواسطة '.(auth('employee')->user()->name ?? 'المشرف');
        if ($oldStatus !== $request->status) {
            $logMessage .= ' (تغيير الحالة إلى: '.(Booking::STATUSES[$request->status]['label'] ?? $request->status).')';
        }

        BookingNote::create([
            'booking_id' => $booking->id,
            'employee_id' => auth('employee')->id(),
            'note' => $logMessage,
            'type' => 'note',
        ]);

        if ($request->assigned_to && $request->assigned_to != $oldAssigned) {
            $employee = Employee::find($request->assigned_to);
            if ($employee) {
                $employee->notify(new NewBookingNotification($booking, __('طلب جديد'), __('تم تعيين طلب لك للعميل').' '.$booking->client_name));
            }
        }

        return back()->with('success', 'تم تعديل وحفظ كافة تفاصيل الطلب بنجاح');
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $request->validate(['status' => 'required|in:'.implode(',', array_keys(Booking::STATUSES))]);

        $oldStatus = $booking->status;
        $booking->update([
            'status' => $request->status,
            'last_contacted_at' => now(),
        ]);

        // تسجيل تغيير الحالة في الـ Notes
        BookingNote::create([
            'booking_id' => $booking->id,
            'employee_id' => auth('employee')->id(),
            'note' => 'تم تغيير الحالة من "'.Booking::STATUSES[$oldStatus]['label'].'" إلى "'.Booking::STATUSES[$request->status]['label'].'"',
            'type' => 'status_change',
            'old_status' => $oldStatus,
            'new_status' => $request->status,
        ]);

        if ($booking->assignedTo) {
            $booking->assignedTo->notify(new NewBookingNotification($booking, __('تحديث حالة الطلب'), __('تم تغيير حالة طلب العميل').' '.$booking->client_name.' '.__('إلى').' '.Booking::STATUSES[$request->status]['label']));
        }

        // إرسال رسالة واتساب للعميل إذا كان القالب مفعلاً
        $settings = Setting::whereIn('key', ['whatsapp_template_status_update'])->pluck('value', 'key');
        $template = $settings['whatsapp_template_status_update'] ?? '';

        if (! empty($template) && ! empty($booking->client_phone)) {
            $message = str_replace(
                ['{customer_name}', '{car_name}', '{status}'],
                [$booking->client_name, $booking->car?->name ?? 'السيارة', Booking::STATUSES[$request->status]['label']],
                $template
            );
            $twilioService = app(TwilioWhatsAppService::class);
            $twilioService->sendWhatsApp($booking->client_phone, $message);
        }

        return back()->with('success', 'تم تحديث حالة الطلب بنجاح');
    }

    public function assign(Request $request, Booking $booking)
    {
        $request->validate(['employee_id' => 'required|exists:employees,id']);
        $oldEmp = $booking->assignedTo?->name;
        $booking->update(['assigned_to' => $request->employee_id]);
        $newEmp = Employee::find($request->employee_id);

        BookingNote::create([
            'booking_id' => $booking->id,
            'employee_id' => auth('employee')->id(),
            'note' => 'تم تعيين الطلب إلى: '.($newEmp?->name ?? 'غير محدد').($oldEmp ? ' (سابقاً: '.$oldEmp.')' : ''),
            'type' => 'assignment',
        ]);
        $booking->touch();

        // Notify the assigned employee
        if ($newEmp) {
            $newEmp->notify(new NewBookingNotification($booking, __('طلب جديد'), __('تم تعيين طلب جديد لك للعميل').' '.$booking->client_name));
        }

        return back()->with('success', 'تم توزيع الطلب على الموظف');
    }

    public function addNote(Request $request, Booking $booking)
    {
        $request->validate(['note' => 'required|string|max:2000', 'type' => 'in:note,call']);
        BookingNote::create([
            'booking_id' => $booking->id,
            'employee_id' => auth('employee')->id(),
            'note' => $request->note,
            'type' => $request->type ?? 'note',
        ]);
        $booking->touch();

        return back()->with('success', 'تمت إضافة الملاحظة');
    }

    public function uploadDocument(Request $request, Booking $booking)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('booking_documents', 'public');
        $docTitle = $request->title ?? $file->getClientOriginalName();

        $booking->documents()->create([
            'employee_id' => auth('employee')->id(),
            'title' => $docTitle,
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
        ]);

        BookingNote::create([
            'booking_id' => $booking->id,
            'employee_id' => auth('employee')->id(),
            'note' => 'تم رفع مستند: '.$docTitle,
            'type' => 'document',
        ]);
        $booking->touch();

        return back()->with('success', 'تم رفع المستند بنجاح');
    }

    public function deleteDocument(BookingDocument $document)
    {
        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }
        $document->delete();

        return back()->with('success', 'تم حذف المستند بنجاح');
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();

        return redirect()->route('crm.bookings.index')->with('success', 'تم حذف الطلب');
    }

    public function export(Request $request)
    {
        $query = Booking::with(['car.brand', 'employee'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('booking_type')) {
            $query->where('booking_type', $request->booking_type);
        }
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }
        if ($request->filled('employee_id')) {
            $query->where('assigned_to', $request->employee_id);
        }
        if (! auth()->user()->hasRole('admin')) {
            $query->where(function ($q) {
                $q->where('assigned_to', auth()->id())
                    ->orWhereNull('assigned_to');
            });
        }
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('client_name', 'like', "%$s%")
                    ->orWhere('client_phone', 'like', "%$s%");
            });
        }

        $bookings = $query->get();

        $csv = "\xEF\xBB\xBF"; // UTF-8 BOM for Excel Arabic support
        $headers = [
            'رقم الطلب',
            'اسم العميل',
            'رقم الجوال',
            'البريد الإلكتروني',
            'المدينة',
            'نوع الطلب',
            'السيارة',
            'سعر السيارة (كاش)',
            'الدفعة الأولى',
            'مدة التمويل (سنوات)',
            'نسبة الفائدة %',
            'البنك المعتمد',
            'القسط الشهري',
            'إجمالي الفائدة / الأرباح',
            'إجمالي المبلغ بالفوائد',
            'مسؤول المبيعات',
            'الحالة',
            'المصدر',
            'تاريخ الطلب',
            'الملاحظات',
        ];

        $csv .= implode(',', array_map(fn ($h) => '"'.str_replace('"', '""', $h).'"', $headers))."\r\n";

        foreach ($bookings as $b) {
            $fin = $b->getFinanceDetails();
            $carName = $b->car ? (($b->car->brand?->name ?? '').' '.$b->car->name.' '.($b->car->year ?? '')) : ($b->model_name ?: '—');
            $row = [
                $b->id,
                $b->client_name,
                $b->client_phone,
                $b->client_email ?: '',
                $b->city ?: '',
                $b->booking_type_label,
                $carName,
                $fin['cash_price'],
                $fin['down_payment'],
                $fin['duration_years'],
                $fin['annual_rate'].'%',
                $fin['bank_name'],
                $fin['monthly_installment'],
                $fin['total_interest'],
                $fin['total_financed'],
                $b->employee?->name ?: 'غير معين',
                $b->status_label,
                $b->source ?: 'المتجر',
                $b->created_at->format('Y-m-d H:i'),
                str_replace(["\r", "\n", '"'], [' ', ' ', '""'], (string) ($b->notes ?? '')),
            ];

            $escaped = array_map(fn ($val) => '"'.str_replace('"', '""', (string) $val).'"', $row);
            $csv .= implode(',', $escaped)."\r\n";
        }

        $filename = 'bookings_export_'.now()->format('Y-m-d_His').'.csv';

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
            'المدينة',
            'نوع الطلب',
            'اسم السيارة',
            'سعر السيارة',
            'الدفعة الأولى',
            'مدة التمويل (سنوات)',
            'نسبة الفائدة %',
            'القسط الشهري',
            'الملاحظات',
        ];

        $csv .= implode(',', array_map(fn ($h) => '"'.str_replace('"', '""', $h).'"', $headers))."\r\n";

        $sample1 = [
            'محمد أحمد علي',
            '0501234567',
            'mohamed@example.com',
            'الرياض',
            'تمويل',
            'تويوتا كامري',
            '115000',
            '15000',
            '5',
            '3.5',
            '1950',
            'طلب تمويل سيارة جديدة',
        ];
        $sample2 = [
            'خالد عبد الله',
            '0559876543',
            'khaled@example.com',
            'جدة',
            'شراء كاش',
            'هيونداي سوناتا',
            '98000',
            '98000',
            '1',
            '0',
            '0',
            'شراء فوري كاش',
        ];

        foreach ([$sample1, $sample2] as $row) {
            $escaped = array_map(fn ($val) => '"'.str_replace('"', '""', (string) $val).'"', $row);
            $csv .= implode(',', $escaped)."\r\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="sample_bookings_template.csv"',
        ]);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240',
        ]);

        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension());

        $rows = [];

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

        $importedCount = 0;
        $defaultRate = Booking::getDefaultInterestRate();

        foreach ($rows as $row) {
            if (empty(array_filter($row, fn ($v) => ! empty(trim((string) $v))))) {
                continue;
            }

            $name = trim((string) ($row[$headerMap['name']] ?? ''));
            $phone = trim((string) ($row[$headerMap['phone']] ?? ''));

            if (empty($name) || empty($phone)) {
                continue;
            }

            $email = isset($headerMap['email']) && isset($row[$headerMap['email']]) ? trim((string) $row[$headerMap['email']]) : null;
            $city = isset($headerMap['city']) && isset($row[$headerMap['city']]) ? trim((string) $row[$headerMap['city']]) : null;
            $bookingType = isset($headerMap['booking_type']) && isset($row[$headerMap['booking_type']]) ? $this->normalizeBookingType($row[$headerMap['booking_type']]) : 'finance';
            $carName = isset($headerMap['car']) && isset($row[$headerMap['car']]) ? trim((string) $row[$headerMap['car']]) : null;
            $notes = isset($headerMap['notes']) && isset($row[$headerMap['notes']]) ? trim((string) $row[$headerMap['notes']]) : null;

            $totalPrice = isset($headerMap['total_price']) && isset($row[$headerMap['total_price']]) ? (float) $row[$headerMap['total_price']] : 0;
            $downPayment = isset($headerMap['down_payment']) && isset($row[$headerMap['down_payment']]) ? (float) $row[$headerMap['down_payment']] : 0;
            $durationYears = isset($headerMap['duration_years']) && isset($row[$headerMap['duration_years']]) ? (int) $row[$headerMap['duration_years']] : 5;
            if ($durationYears <= 0) {
                $durationYears = 5;
            }
            $interestRate = isset($headerMap['interest_rate']) && isset($row[$headerMap['interest_rate']]) && is_numeric($row[$headerMap['interest_rate']]) && (float) $row[$headerMap['interest_rate']] > 0
                ? (float) $row[$headerMap['interest_rate']]
                : $defaultRate;
            $monthlyInstallment = isset($headerMap['monthly_installment']) && isset($row[$headerMap['monthly_installment']]) ? (float) $row[$headerMap['monthly_installment']] : 0;

            // Match car if possible
            $carId = null;
            if (! empty($carName)) {
                $matchedCar = Car::where('name', 'like', "%{$carName}%")->first();
                if ($matchedCar) {
                    $carId = $matchedCar->id;
                    if ($totalPrice <= 0) {
                        $totalPrice = (float) $matchedCar->cash_price;
                    }
                }
            }

            // Calculate installment if finance and installment not provided
            if ($bookingType === 'finance' && $monthlyInstallment <= 0 && $totalPrice > 0) {
                $principal = max(0, $totalPrice - $downPayment);
                $totalMonths = $durationYears * 12;
                $mRate = ($interestRate / 100) / 12;
                if ($mRate > 0) {
                    $comp = pow(1 + $mRate, $totalMonths);
                    $monthlyInstallment = round($principal * ($mRate * $comp) / ($comp - 1));
                } else {
                    $monthlyInstallment = round($principal / $totalMonths);
                }
            }

            if ($totalPrice <= 0 && $bookingType === 'finance' && $monthlyInstallment > 0) {
                $totalPrice = ($monthlyInstallment * $durationYears * 12) + $downPayment;
            }

            Booking::create([
                'client_name' => $name,
                'client_phone' => $phone,
                'client_email' => $email ?: null,
                'city' => $city ?: null,
                'booking_type' => $bookingType,
                'car_id' => $carId,
                'total_price' => $totalPrice,
                'down_payment' => $downPayment,
                'duration_years' => $durationYears,
                'interest_rate' => $interestRate,
                'monthly_installment' => $monthlyInstallment,
                'notes' => $notes,
                'source' => 'Excel Import',
                'status' => 'new',
                'assigned_to' => auth('employee')->id(),
            ]);

            $importedCount++;
        }

        return back()->with('success', "تم استيراد {$importedCount} طلبات بنجاح من ملف الإكسيل");
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
            'city' => null,
            'booking_type' => null,
            'car' => null,
            'total_price' => null,
            'down_payment' => null,
            'duration_years' => null,
            'interest_rate' => null,
            'monthly_installment' => null,
            'notes' => null,
        ];

        foreach ($headers as $index => $header) {
            $h = mb_strtolower(trim((string) $header));
            if (str_contains($h, 'اسم') || str_contains($h, 'name') || str_contains($h, 'عميل') || str_contains($h, 'client')) {
                $map['name'] = $index;
            } elseif (str_contains($h, 'جوال') || str_contains($h, 'هاتف') || str_contains($h, 'phone') || str_contains($h, 'mobile')) {
                $map['phone'] = $index;
            } elseif (str_contains($h, 'بريد') || str_contains($h, 'email') || str_contains($h, 'mail')) {
                $map['email'] = $index;
            } elseif (str_contains($h, 'مدينة') || str_contains($h, 'city')) {
                $map['city'] = $index;
            } elseif (str_contains($h, 'نوع') || str_contains($h, 'type')) {
                $map['booking_type'] = $index;
            } elseif (str_contains($h, 'قسط') || str_contains($h, 'installment')) {
                $map['monthly_installment'] = $index;
            } elseif (str_contains($h, 'دفع') || str_contains($h, 'مقدم') || str_contains($h, 'down')) {
                $map['down_payment'] = $index;
            } elseif (str_contains($h, 'سعر') || str_contains($h, 'إجمالي') || str_contains($h, 'total') || str_contains($h, 'price') || str_contains($h, 'مبلغ')) {
                if (! isset($map['total_price'])) {
                    $map['total_price'] = $index;
                }
            } elseif (str_contains($h, 'فائد') || str_contains($h, 'rate') || str_contains($h, 'interest')) {
                $map['interest_rate'] = $index;
            } elseif (str_contains($h, 'مدة') || str_contains($h, 'سنوات') || str_contains($h, 'year') || str_contains($h, 'duration')) {
                $map['duration_years'] = $index;
            } elseif (str_contains($h, 'سيار') || str_contains($h, 'car') || str_contains($h, 'مركب') || str_contains($h, 'موديل')) {
                $map['car'] = $index;
            } elseif (str_contains($h, 'ملاحظ') || str_contains($h, 'note') || str_contains($h, 'وصف')) {
                $map['notes'] = $index;
            }
        }

        return $map;
    }

    private function normalizeBookingType(string $val): string
    {
        $v = mb_strtolower(trim($val));
        if (str_contains($v, 'كاش') || str_contains($v, 'شراء') || str_contains($v, 'purchase') || str_contains($v, 'cash')) {
            return 'purchase';
        }
        if (str_contains($v, 'قياد') || str_contains($v, 'تجر') || str_contains($v, 'drive')) {
            return 'test_drive';
        }
        if (str_contains($v, 'استفسار') || str_contains($v, 'inquiry')) {
            return 'inquiry';
        }

        return 'finance';
    }
}
