import { useTranslation } from "react-i18next";
import type { ISlideArrowProps } from "../interfaces/ISlideArrowProps";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SlideArrow({ direction, onClick, className = "" }: ISlideArrowProps) {
  const { t } = useTranslation();
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? t("common.previousSlide") : t("common.nextSlide")}
      className={[
        "flex h-[38px] w-[38px] items-center justify-center",
        "rounded-[12px] border border-white/25 bg-white/30",
        "text-white backdrop-blur-md",
        "transition duration-300 hover:bg-white/45",
        className,
      ].join(" ")}
    >
      {isPrev ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
}
