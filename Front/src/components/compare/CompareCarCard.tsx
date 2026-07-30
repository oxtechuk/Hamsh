import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getImageUrl } from "../../constants/app-images";
import type { ICompareCarCardProps } from "../../interfaces/ICompareCarCardProps";
import LazyImg from "../LazyImg";

export default function CompareCarCard({ car, onRemove }: ICompareCarCardProps) {
  const { t, i18n } = useTranslation();

  const brandName = car.brand?.name ?? "";
  const carName = car.name ?? "";
  const imageSrc = getImageUrl(car.main_image);

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRemove();
  };

  return (
    <article
      dir={i18n.dir()}
      className={[
        "w-full overflow-hidden",
        "rounded-[16px]",
        "border border-[#DDDFE2]",
        "bg-white",
        "shadow-[0_2px_5px_rgba(15,23,42,0.04)]",
      ].join(" ")}
    >
      {/* Car image */}
      <div
        className={[
          "relative w-full overflow-hidden",
          "bg-[#F2F2F2]",
          "aspect-[1.73/1]",
        ].join(" ")}
      >
        <LazyImg
          src={imageSrc}
          alt={`${brandName} ${carName}`}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Bottom information */}
      <div
        className={[
          "flex min-h-[80px] items-center",
          "justify-between gap-5",
          "bg-white px-8 py-4",
        ].join(" ")}
      >
        {/* Vehicle information */}
        <div className="min-w-0 flex-1 text-start">
          {brandName && (
            <p className="truncate text-[17px] font-medium leading-6 text-[#858585]">
              {brandName}
            </p>
          )}

          <h2
            title={`${brandName} ${carName}`}
            className={[
              "mt-2 line-clamp-2",
              "text-[18px] font-bold",
              "leading-[1.3] text-[#080808]",
            ].join(" ")}
          >
            {brandName} {carName}
          </h2>
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={handleRemove}
          aria-label={t("comparePage.removeCar")}
          title={t("comparePage.removeCar")}
          className={[
            "flex h-[40px] w-[40px] shrink-0",
            "items-center justify-center",
            "rounded-[8px]",
            "border-2 border-[var(--brand-secondary-color)]",
            "bg-white text-[var(--brand-secondary-color)]",
            "transition-colors duration-300",
            "hover:bg-[var(--brand-secondary-color)] hover:text-white",
          ].join(" ")}
        >
          <Trash2 size={24} strokeWidth={2.5} />
        </button>
      </div>
    </article>
  );
}
