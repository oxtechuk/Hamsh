import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import type { IStepCircleProps, IStepperProps } from "../../interfaces/IStepperProps";

function StepCircle({ number, label, active, done }: IStepCircleProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "flex h-[34px] w-[34px] items-center justify-center rounded-full text-[14px] font-extrabold transition",
          done || active
            ? "bg-[#C5232B] text-white"
            : "bg-[#E5E7EB] text-[#9CA3AF]",
        ].join(" ")}
      >
        {done ? <Check size={16} strokeWidth={3} /> : number}
      </span>
      <span
        className={[
          "text-[13px] font-semibold",
          active ? "text-[#C5232B]" : done ? "text-[#111111]" : "text-[#9CA3AF]",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

export default function Stepper({ activeStep }: IStepperProps) {
  const { t } = useTranslation();

  const steps = [
    { number: 1, label: t("financeCalculator.step1.stepperLabel", "معلوماتك") },
    { number: 2, label: t("financeCalculator.step2.stepperLabel", "تفاصيل السيارة") },
    { number: 3, label: t("financeCalculator.step3.stepperLabel", "المراجعة") },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {steps.map((step, idx) => (
        <div key={step.number} className="flex items-center gap-3">
          <StepCircle
            number={step.number}
            label={step.label}
            active={activeStep === step.number}
            done={activeStep > step.number}
          />
          {idx < steps.length - 1 && (
            <div
              className={[
                "h-px w-[50px] sm:w-[80px] transition-colors",
                activeStep > step.number ? "bg-[#C5232B]" : "bg-[#E5E7EB]",
              ].join(" ")}
            />
          )}
        </div>
      ))}
    </div>
  );
}
