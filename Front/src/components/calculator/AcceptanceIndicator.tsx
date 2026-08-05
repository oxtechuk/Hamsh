import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CheckSquare, Square } from "lucide-react";

interface AcceptanceIndicatorProps {
  salary: number;
  obligations: number;
  monthlyPayment: number;
  employerSector: string;
  setEmployerSector: (v: string) => void;
  wantDebtConsolidation: boolean;
  setWantDebtConsolidation: (v: boolean) => void;
}

const SECTORS = [
  { id: "private_accredited", label: "قطاع خاص معتمد", maxDti: 45 },
  { id: "government", label: "قطاع حكومي / مدني", maxDti: 50 },
  { id: "military", label: "قطاع عسكري", maxDti: 50 },
  { id: "private_unaccredited", label: "قطاع خاص غير معتمد", maxDti: 35 },
  { id: "retired", label: "متقاعد / أصحاب أعمال", maxDti: 40 },
];

export default function AcceptanceIndicator({
  salary,
  obligations,
  monthlyPayment,
  employerSector,
  setEmployerSector,
  wantDebtConsolidation,
  setWantDebtConsolidation,
}: AcceptanceIndicatorProps) {
  const { t } = useTranslation();

  const selectedSector = useMemo(
    () => SECTORS.find((s) => s.id === employerSector) || SECTORS[0],
    [employerSector],
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

    const totalObligations = (obligations || 0) + (monthlyPayment || 0);
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

  return (
    <div className="mt-5 space-y-4 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      {/* جهة العمل */}
      <div>
        <label className="mb-1.5 block text-start text-[13px] font-bold text-[#111111]">
          {t("financeCalculator.acceptance.employerSector", "جهة العمل")}
        </label>
        <select
          value={employerSector}
          onChange={(e) => setEmployerSector(e.target.value)}
          className="h-[46px] w-full rounded-[8px] border border-[#E5E7EB] bg-white px-3 text-[13px] font-semibold text-[#111111] outline-none transition focus:border-[#C5232B]"
        >
          {SECTORS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* مؤشر إمكانية القبول */}
      <div className="pt-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] font-extrabold text-gray-800">
            {t("financeCalculator.acceptance.title", "مؤشر إمكانية القبول:")}
          </span>
          <span className={`text-[15px] font-black ${colorClass}`}>
            {salary > 0 ? `${scorePercentage}%` : "—"}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full transition-all duration-500 rounded-full ${barColor}`}
            style={{ width: `${salary > 0 ? scorePercentage : 0}%` }}
          />
        </div>

        {salary > 0 && (
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className={`font-semibold ${colorClass}`}>{labelText}</span>
            <span className="text-gray-400">
              {t("financeCalculator.acceptance.dtiLabel", "نسبة الاستقطاع:")} {dtiRatio}%
            </span>
          </div>
        )}
      </div>

      {/* التنبيه والخيار عند تجاوز الحد */}
      {isHighRisk && (
        <div className="rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-start transition-all">
          <div className="flex items-start gap-2 text-[#C5232B]">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <p className="text-[12px] font-bold leading-relaxed">
              {t(
                "financeCalculator.acceptance.exceededWarning",
                "الالتزامات تتجاوز الحد المباشر للمصرفية.",
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setWantDebtConsolidation(!wantDebtConsolidation)}
            className="mt-3 flex items-center gap-2 text-start text-[12px] font-extrabold text-gray-800 transition hover:text-[#C5232B]"
          >
            {wantDebtConsolidation ? (
              <CheckSquare size={18} className="shrink-0 text-[#C5232B]" />
            ) : (
              <Square size={18} className="shrink-0 text-gray-400" />
            )}
            <span>
              {t(
                "financeCalculator.acceptance.debtOption",
                "أرغب في الاستفادة من \"خيار الحلول التمويلية وتوحيد الالتزامات\"",
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
