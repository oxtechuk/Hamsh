import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard, { type CarCardProps } from "./CarCard";
import type { ICarDetailsRecommendationItem } from "../interfaces/ICarDetailsRecommendationsProps";

interface CarDetailsRecommendationsProps {
  title?: string;
  cars?: (ICarDetailsRecommendationItem | CarCardProps)[];
  maxItems?: number;
}

export default function CarDetailsRecommendations({
  title,
  cars = [],
}: CarDetailsRecommendationsProps) {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!cars || cars.length === 0) {
    return null;
  }

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 360;
    const isRtl = dir === "rtl";
    
    // In RTL, scrolling right means decreasing scrollLeft or vice versa depending on browser implementation
    const multiplier = (direction === "right" ? 1 : -1) * (isRtl ? -1 : 1);
    scrollRef.current.scrollBy({
      left: scrollAmount * multiplier,
      behavior: "smooth",
    });
  };

  return (
    <section dir={dir} className="w-full py-8">
      {/* Header Row */}
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* Title */}
        <h2 className="text-[24px] sm:text-[28px] font-black text-[#111111]">
          {title ?? t("carDetails.recommendations.title", "سيارات مشابهة")}
        </h2>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Previous cars"
            className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#CCCCCC]/60 bg-white text-[#222222] shadow-xs transition hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Next cars"
            className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#CCCCCC]/60 bg-white text-[#222222] shadow-xs transition hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Cards Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
      >
        {cars.map((car, index) => {
          // Normalize car props whether passed as simple recommendation or full CarCardProps
          const normalizedCarProps: CarCardProps = "detailsTo" in car && "price" in car && typeof car.price === "string"
            ? (car as CarCardProps)
            : {
                id: (car as any).id || index,
                image: (car as any).image,
                brand: (car as any).brand || "لكزس",
                name: (car as any).name,
                year: (car as any).year || "2024",
                type: (car as any).type || "فاخر SUV",
                price: (car as any).price || "420,000 ر.س",
                monthlyPrice: (car as any).monthlyPrice || (car as any).monthly_price || "780 ر.س",
                detailsTo: (car as any).detailsTo || `/cars/${(car as any).slug || (car as any).id}`,
                slug: (car as any).slug,
                badgeText: (car as any).badgeText || "حصري",
                badgeColor: "#DFA655",
              };

          return (
            <div
              key={normalizedCarProps.id || index}
              className="w-[300px] sm:w-[340px] shrink-0 snap-start"
            >
              <CarCard {...normalizedCarProps} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
