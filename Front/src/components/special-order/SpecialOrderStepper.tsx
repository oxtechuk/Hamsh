import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../store/language.store";
import type {
  ISpecialOrderStepperProps,
  ISpecialOrderStepCircleProps,
  IOrderStepperStep,
} from "../../interfaces/ISpecialOrderTypes";

const DEFAULT_SPECIAL_STEPS: IOrderStepperStep[] = [
  { number: 1, label: "" },
  { number: 2, label: "" },
  { number: 3, label: "" },
];

function StepCircle({ number, label, active, done }: ISpecialOrderStepCircleProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={[
          "flex h-[34px] w-[34px] items-center justify-center rounded-full text-[14px] font-extrabold transition",
          done || active
            ? "bg-[var(--brand-secondary-color)] text-white"
            : "bg-[#E5E7EB] text-[#9CA3AF]",
        ].join(" ")}
      >
        {done ? <Check size={16} strokeWidth={3} /> : number}
      </span>
      <span
        className={[
          "text-[13px] font-semibold",
          active ? "text-[var(--brand-secondary-color)]" : done ? "text-[#111111]" : "text-[#9CA3AF]",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}

export default function SpecialOrderStepper({ activeStep, steps }: ISpecialOrderStepperProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((s) => s.direction);

  const resolvedSteps = (steps ?? DEFAULT_SPECIAL_STEPS).map((s, i) => ({
    ...s,
    label: s.label || t(`specialOrder.stepper.step${i + 1}`, ["معلوماتك", "تفاصيل السيارة", "الميزانية"][i]),
  }));

  return (
    <div dir={direction} className="flex items-center justify-center gap-3">
      {resolvedSteps.map((step, idx) => (
        <div key={step.number} className="flex items-center gap-3">
          <StepCircle
            number={step.number}
            label={step.label}
            active={activeStep === step.number}
            done={activeStep > step.number}
          />
          {idx < resolvedSteps.length - 1 && (
            <div
              className={[
                "h-px w-[50px] sm:w-[80px] transition-colors",
                activeStep > step.number ? "bg-[var(--brand-secondary-color)]" : "bg-[#E5E7EB]",
              ].join(" ")}
            />
          )}
        </div>
      ))}
    </div>
  );
}
