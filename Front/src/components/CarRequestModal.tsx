import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { X, ShieldCheck, AlertTriangle, RotateCcw } from "lucide-react";

import {
  submitCalculatorLead,
  calculateFinance,
  getCalculatorSettings,
  sendCalculatorOtp,
  verifyCalculatorOtp,
  getCities
} from "../services/api";
import { useLanguageStore } from "../store/language.store";
import type { ICity } from "../services/api/cities.service";
import type { ICalculateData } from "../interfaces/ICalculatorTypes";

interface CarRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    id: string | number;
    brand: string;
    name: string;
    year: string | number;
    price: string | number;
  };
}

const SECTORS = [
  { id: "private_accredited", label: "قطاع خاص معتمد", maxDti: 45 },
  { id: "government", label: "قطاع حكومي / مدني", maxDti: 50 },
  { id: "military", label: "قطاع عسكري", maxDti: 50 },
  { id: "private_unaccredited", label: "قطاع خاص غير معتمد", maxDti: 35 },
  { id: "retired", label: "متقاعد / أصحاب أعمال", maxDti: 40 },
];

export default function CarRequestModal({ isOpen, onClose, car }: CarRequestModalProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);
  const isRtl = direction === "rtl";

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [employerSector, setEmployerSector] = useState("private_accredited");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyObligations, setMonthlyObligations] = useState("");
  const [wantDebtConsolidation, setWantDebtConsolidation] = useState(false);

  // OTP/Settings states
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Data fetching
  const [cities, setCities] = useState<ICity[]>([]);
  const [calculation, setCalculation] = useState<ICalculateData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!isOpen) return;
    
    // Load general calculator settings for OTP
    getCalculatorSettings().then((s) => setOtpEnabled(s.otp_enabled)).catch(() => {});
    
    // Fetch cities
    getCities().then((data) => setCities(data)).catch(() => {});

    // Perform monthly payment calculation for the car
    const carId = Number(car.id);
    const carPrice = Number(car.price) || 0;
    if (carId && carPrice > 0) {
      setIsCalculating(true);
      calculateFinance({
        car_id: carId,
        down_payment_percentage: 20,
        period_months: 48,
      })
        .then((res) => setCalculation(res))
        .catch(() => setCalculation(null))
        .finally(() => setIsCalculating(false));
    }
  }, [isOpen, car.id, car.price]);

  const monthlyPayment = calculation?.monthly_payment ?? 0;
  const salary = Number(monthlyIncome) || 0;
  const obligations = Number(monthlyObligations) || 0;

  // Calculate Acceptance Probability
  const selectedSector = useMemo(
    () => SECTORS.find((s) => s.id === employerSector) || SECTORS[0],
    [employerSector]
  );

  const { dtiRatio, scorePercentage, status, colorClass, barColor, labelText } = useMemo(() => {
    if (!salary || salary <= 0) {
      return {
        dtiRatio: 0,
        scorePercentage: 0,
        status: "none",
        colorClass: "text-gray-400",
        barColor: "bg-gray-200",
        labelText: t("financeCalculator.acceptance.enterSalary", "يرجى إدخال الراتب والالتزامات لغرض احتساب نسبة القبول"),
      };
    }

    const totalObligations = obligations + monthlyPayment;
    const dti = Math.round((totalObligations / salary) * 100);
    const maxAllowed = selectedSector.maxDti;

    if (dti <= 33) {
      const score = Math.min(100, Math.max(80, 100 - Math.round(dti * 0.4)));
      return {
        dtiRatio: dti,
        scorePercentage: score,
        status: "excellent",
        colorClass: "text-emerald-600",
        barColor: "bg-emerald-500",
        labelText: t("financeCalculator.acceptance.excellent", "ممتاز — فرصة إمكانية قبول عالية جداً"),
      };
    } else if (dti <= maxAllowed) {
      const score = Math.max(60, 80 - Math.round((dti - 33) * 1.5));
      return {
        dtiRatio: dti,
        scorePercentage: score,
        status: "good",
        colorClass: "text-amber-600",
        barColor: "bg-amber-500",
        labelText: t("financeCalculator.acceptance.good", "جيد — ضمن نطاق التمويل المصرفي المسموح به"),
      };
    } else if (dti <= 50) {
      const score = Math.max(40, 60 - Math.round((dti - maxAllowed) * 2));
      return {
        dtiRatio: dti,
        scorePercentage: score,
        status: "warning",
        colorClass: "text-orange-600",
        barColor: "bg-orange-500",
        labelText: t("financeCalculator.acceptance.warning", "حدي — قريب من الحد الأقصى لنسبة الاستقطاع"),
      };
    } else {
      const score = Math.max(15, 40 - Math.round((dti - 50) * 0.8));
      return {
        dtiRatio: dti,
        scorePercentage: score,
        status: "exceeded",
        colorClass: "text-[#C5232B]",
        barColor: "bg-[#C5232B]",
        labelText: t("financeCalculator.acceptance.exceeded", "تجاوز الحد المباشر للمصرفية"),
      };
    }
  }, [salary, obligations, monthlyPayment, selectedSector, t]);

  const isHighRisk = dtiRatio > selectedSector.maxDti;

  const isSaudiPhone = (p: string): boolean => {
    if (!p) return false;
    const clean = p.replace(/[\s\-\+\(\)]/g, "");
    return /^(05\d{8}|5\d{8}|9665\d{8})$/.test(clean);
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      toast.error(t("financeCalculator.otp.invalidPhone", "رقم الجوال غير صحيح"));
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await sendCalculatorOtp(phone.trim());
      if (res.success) {
        setIsOtpSent(true);
        setCountdown(60);
        toast.success(res.message || t("financeCalculator.otp.sentSuccess", "تم إرسال رمز التحقق لرقم جوالك"));
      } else {
        toast.error(res.message || t("financeCalculator.otp.sendFailed", "فشل إرسال رمز التحقق"));
      }
    } catch {
      toast.error(t("financeCalculator.otp.sendError", "حدث خطأ أثناء إرسال رمز التحقق"));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.length < 4) {
      toast.error(t("financeCalculator.otp.enterCode", "يرجى إدخال رمز التحقق"));
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const res = await verifyCalculatorOtp(phone.trim(), otpCode.trim());
      if (res.success) {
        setIsPhoneVerified(true);
        toast.success(t("financeCalculator.otp.verifiedSuccess", "تم تأكيد رقم الجوال بنجاح"));
      } else {
        toast.error(res.message || t("financeCalculator.otp.invalidCode", "رمز التحقق غير صحيح"));
      }
    } catch {
      toast.error(t("financeCalculator.otp.verifyError", "فشل التحقق من الرمز"));
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const submitLead = async () => {
    setIsSubmitting(true);
    try {
      let combinedNotes = `جهة العمل: ${employerSector}`;
      if (wantDebtConsolidation) {
        combinedNotes += ` | يرغب في خيار الحلول التمويلية وتوحيد الالتزامات`;
      }

      await submitCalculatorLead({
        name: fullName.trim(),
        phone: phone.trim(),
        email: "",
        city,
        purpose: "",
        car_ids: [Number(car.id)],
        notes: combinedNotes,
        monthly_obligations: Number(monthlyObligations) || 0,
        salary: Number(monthlyIncome) || 0,
      });

      toast.success(t("financeCalculator.step3.successToast", "تم إرسال طلب التمويل بنجاح"));
      onClose();
    } catch {
      toast.error(t("financeCalculator.step3.errorToast", "تعذر إرسال طلب التمويل"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !city.trim() || !monthlyIncome.trim() || !monthlyObligations.trim()) {
      toast.error(t("financeCalculator.validation.fillRequired", "يرجى تعبئة جميع الحقول المطلوبة"));
      return;
    }

    if (otpEnabled && isSaudiPhone(phone) && !isPhoneVerified) {
      toast.error(t("financeCalculator.otp.verifyRequired", "يرجى التحقق من رقم الجوال أولاً"));
      return;
    }

    await submitLead();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir={direction}
      >
        {/* Header */}
        <div className="flex h-[60px] items-center justify-between bg-[#4A5568] px-6 text-white shrink-0">
          <h3 className="text-[17px] font-extrabold">
            {t("financeCalculator.popup.title", "تقديم طلب تمويل")} - {car.brand} {car.name} {car.year}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* الاسم الكريم */}
          <div>
            <label className="mb-1.5 block text-start text-[13px] font-bold text-gray-700">
              {t("financeCalculator.step1.fullNameLabel", "الاسم الكريم")}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("financeCalculator.step1.fullNamePlaceholder", "أدخل اسمك بالكامل")}
              className="h-[46px] w-full rounded-[8px] border border-gray-200 bg-gray-50/50 px-4 text-[14px] text-gray-900 outline-none focus:border-[#C5232B] focus:ring-1 focus:ring-[#C5232B]/10 transition"
            />
          </div>

          {/* رقم الجوال مع التحقق */}
          <div>
            <label className="mb-1.5 block text-start text-[13px] font-bold text-gray-700">
              {t("financeCalculator.step1.phoneLabel", "رقم الجوال")}
            </label>
            <div className="relative flex gap-2">
              <input
                type="text"
                required
                disabled={isPhoneVerified}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="h-[46px] flex-1 rounded-[8px] border border-gray-200 bg-gray-50/50 px-4 text-[14px] text-gray-900 outline-none focus:border-[#C5232B] focus:ring-1 focus:ring-[#C5232B]/10 transition disabled:opacity-70"
              />
              {otpEnabled && isSaudiPhone(phone) && !isPhoneVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || countdown > 0}
                  className="h-[46px] min-w-[100px] rounded-[8px] bg-[#4A5568] px-3 text-[13px] font-bold text-white transition hover:bg-[#3182ce] disabled:opacity-50"
                >
                  {isSendingOtp ? "..." : countdown > 0 ? `${countdown}s` : t("financeCalculator.otp.sendButton", "إرسال الرمز")}
                </button>
              )}
            </div>
          </div>

          {/* حقل رمز التحقق المرسل */}
          {otpEnabled && isOtpSent && !isPhoneVerified && (
            <div className="rounded-xl border border-red-100 bg-red-50/30 p-3 space-y-2">
              <label className="block text-start text-[12px] font-bold text-[#C5232B]">
                {t("financeCalculator.otp.codeLabel", "رمز التحقق المرسل لجوالك")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="h-[40px] flex-1 rounded-[6px] border border-gray-200 bg-white px-3 text-center text-[15px] font-bold outline-none focus:border-[#C5232B]"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || !otpCode.trim()}
                  className="h-[40px] rounded-[6px] bg-[#C5232B] px-4 text-[13px] font-bold text-white hover:bg-[#A91D24] transition disabled:opacity-50"
                >
                  {isVerifyingOtp ? "..." : t("financeCalculator.otp.verifyButton", "تأكيد الرمز")}
                </button>
              </div>
              {countdown === 0 && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C5232B] hover:underline"
                >
                  <RotateCcw size={12} />
                  {t("financeCalculator.otp.resendButton", "إعادة إرسال الرمز")}
                </button>
              )}
            </div>
          )}

          {/* المدينة */}
          <div>
            <label className="mb-1.5 block text-start text-[13px] font-bold text-gray-700">
              {t("financeCalculator.step1.cityLabel", "المدينة")}
            </label>
            <select
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-[46px] w-full rounded-[8px] border border-gray-200 bg-gray-50/50 px-3 text-[14px] text-gray-900 outline-none focus:border-[#C5232B] transition"
            >
              <option value="">{t("financeCalculator.step1.selectCity", "اختر المدينة")}</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* جهة العمل */}
          <div>
            <label className="mb-1.5 block text-start text-[13px] font-bold text-gray-700">
              {t("financeCalculator.acceptance.employerSector", "جهة العمل")}
            </label>
            <select
              value={employerSector}
              onChange={(e) => setEmployerSector(e.target.value)}
              className="h-[46px] w-full rounded-[8px] border border-gray-200 bg-gray-50/50 px-3 text-[14px] text-gray-900 outline-none focus:border-[#C5232B] transition"
            >
              {SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* الراتب الشهري والالتزامات الحالية في سطر واحد */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-start text-[13px] font-bold text-gray-700">
                {t("financeCalculator.step3.monthlyIncome", "الراتب الشهري (ر.س)")}
              </label>
              <input
                type="number"
                required
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="5000"
                className="h-[46px] w-full rounded-[8px] border border-gray-200 bg-gray-50/50 px-4 text-[14px] text-gray-900 outline-none focus:border-[#C5232B] transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-start text-[13px] font-bold text-gray-700">
                {t("financeCalculator.step3.monthlyObligations", "الالتزامات الحالية (ر.س)")}
              </label>
              <input
                type="number"
                required
                value={monthlyObligations}
                onChange={(e) => setMonthlyObligations(e.target.value)}
                placeholder="800"
                className="h-[46px] w-full rounded-[8px] border border-gray-200 bg-gray-50/50 px-4 text-[14px] text-gray-900 outline-none focus:border-[#C5232B] transition"
              />
            </div>
          </div>

          {/* مؤشر إمكانية القبول */}
          <div className="pt-2 border-t border-gray-100">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-gray-800">
                {t("financeCalculator.acceptance.title", "مؤشر إمكانية القبول:")}
              </span>
              <span className={`text-[15px] font-black ${colorClass}`}>
                {salary > 0 ? `${scorePercentage}%` : "—"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full transition-all duration-500 rounded-full ${barColor}`}
                style={{ width: `${salary > 0 ? scorePercentage : 0}%` }}
              />
            </div>

            {salary > 0 && (
              <div className="mt-2 flex items-center justify-between text-[11px] text-start">
                <span className={`font-semibold ${colorClass}`}>{labelText}</span>
                <span className="text-gray-400">
                  {t("financeCalculator.acceptance.dtiLabel", "نسبة الاستقطاع:")} {dtiRatio}%
                </span>
              </div>
            )}
          </div>

          {/* التنبيه والخيار عند تجاوز الحد */}
          {isHighRisk && (
            <div className="rounded-xl border border-red-200 bg-red-50/60 p-3.5 text-start transition-all">
              <div className="flex items-start gap-2 text-[#C5232B]">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p className="text-[12px] font-bold leading-relaxed">
                  {t(
                    "financeCalculator.acceptance.exceededWarning",
                    "الالتزامات تتجاوز الحد المباشر للمصرفية.",
                  )}
                </p>
              </div>

              <label
                className="mt-3 flex items-center gap-2 text-start text-[12px] font-extrabold text-gray-800 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={wantDebtConsolidation}
                  onChange={(e) => setWantDebtConsolidation(e.target.checked)}
                  className="rounded border-gray-300 text-[#C5232B] focus:ring-[#C5232B]"
                />
                <span>
                  {t(
                    "financeCalculator.acceptance.debtOption",
                    "أرغب في الاستفادة من \"خيار الحلول التمويلية وتوحيد الالتزامات\"",
                  )}
                </span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isCalculating}
              className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#C5232B] text-[15px] font-bold text-white transition hover:bg-[#A91D24] disabled:opacity-50"
            >
              {isSubmitting
                ? t("financeCalculator.step3.submitting", "جارٍ الإرسال...")
                : t("financeCalculator.popup.confirm", "تأكيد التقديم وحساب الإمكانية")}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
