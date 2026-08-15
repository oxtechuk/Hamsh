import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { IComparisonValueProps } from "../../interfaces/IComparisonValueProps";

export default function ComparisonValue({
  value,
  isWinner,
  className = "",
}: IComparisonValueProps) {
  const { t, i18n } = useTranslation();

  return (
    <div
      dir={i18n.dir()}
      className={[
        "flex items-center justify-center gap-3 px-4 text-center",
        isWinner ? "bg-[#FCEEEF]" : "bg-white",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "text-[16px] font-extrabold",
          isWinner ? "text-[#C5232B]" : "text-[#69758A]",
        ].join(" ")}
      >
        {value ?? "—"}
      </span>

      {isWinner && (
        <span
          className={[
            "flex h-[20px] w-[20px] shrink-0",
            "items-center justify-center rounded-full",
            "bg-[#C5232B] text-white",
          ].join(" ")}
          aria-label={t("comparePage.bestValue")}
        >
          <Check size={12} strokeWidth={3} />
        </span>
      )}
    </div>
  );
}
