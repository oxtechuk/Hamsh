import { useTranslation } from "react-i18next";
import type { IBudgetCarsRangeFiltersProps } from "../interfaces/IBudgetCarsRangeFiltersProps";

export default function BudgetCarsRangeFilters({
    ranges,
    activeRange,
    onRangeChange,
}: IBudgetCarsRangeFiltersProps) {
    const { t } = useTranslation();

    const allRanges = [{ label: t("budgetCars.all"), value: "" }, ...ranges];

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
                            " border px-5",
                            "text-[13px] font-medium",
                            "transition-all duration-200",
                            isActive
                                ? "border-[var(--brand-secondary-color)] bg-[var(--brand-secondary-color)] text-white shadow-[0_4px_12px_rgba(48,58,84,0.2)]"
                                : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[var(--brand-secondary-color)] hover:text-[var(--brand-secondary-color)]",
                        ].join(" ")}
                    >
                        {range.label}
                    </button>
                );
            })}
        </div>
    );
}
