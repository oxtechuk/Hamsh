import { useTranslation } from "react-i18next";
import type { IBudgetCarsRangeFiltersProps } from "../interfaces/IBudgetCarsRangeFiltersProps";

export default function BudgetCarsRangeFilters({
  ranges,
  activeRange,
  onRangeChange,
}: IBudgetCarsRangeFiltersProps) {
  const { t } = useTranslation();

  const allRanges = [
    { label: t("budgetCars.all", "الكل"), value: "" },
    ...ranges,
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {allRanges.map((range) => {
        const isActive = range.value === (activeRange ?? "");

        return (
          <button
            key={range.value || "__all__"}
            type="button"
            onClick={() => onRangeChange?.(range.value)}
            className={[
              "flex h-[38px] items-center justify-center",
              "rounded-full border px-5",
              "text-[13px] font-medium",
              "transition-all duration-200",
              isActive
                ? "border-[#C52A2E] bg-[#C52A2E] text-white shadow-[0_4px_12px_rgba(197,42,46,0.2)]"
                : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[#C52A2E] hover:text-[#C52A2E]",
            ].join(" ")}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
