import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "./CarCard";
import type { ICarCardProps } from "../interfaces/ICarCardProps";
import type { ICarDetailsRecommendationsProps } from "../interfaces/ICarDetailsRecommendationsProps";

export default function CarDetailsRecommendations({
    title,
    cars = [],
}: ICarDetailsRecommendationsProps) {
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!cars || cars.length === 0) {
        return null;
    }

    const handleScroll = (direction: "next" | "prev") => {
        if (!scrollRef.current) return;
        const scrollAmount = 360;
        const multiplier = direction === "next" ? 1 : -1;
        scrollRef.current.scrollBy({ left: scrollAmount * multiplier, behavior: "smooth" });
    };

    return (
        <section dir={dir} className="w-full py-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-[24px] sm:text-[28px] font-black text-[#111111]">
                    {title ?? t("carDetails.recommendations.title")}
                </h2>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => handleScroll("next")}
                        aria-label={t("carDetails.actions.nextCars")}
                        className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#CCCCCC]/60  text-[#222222] shadow-xs transition hover:bg-gray-50 active:scale-95 cursor-pointer"
                    >
                        <ChevronRight size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={() => handleScroll("prev")}
                        aria-label={t("carDetails.actions.prevCars")}
                        className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#CCCCCC]/60  text-[#222222] shadow-xs transition hover:bg-gray-50 active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
            >
                {cars.map((car, index) => {
                    const normalizedCarProps: ICarCardProps =
                        "detailsTo" in car && "price" in car && typeof car.price === "string"
                            ? (car as ICarCardProps)
                            : {
                                  id: (car as any).id || index,
                                  image: (car as any).image,
                                  brand: (car as any).brand,
                                  name: (car as any).name,
                                  year: (car as any).year,
                                  type: (car as any).type,
                                  price: (car as any).price,
                                  monthlyPrice: (car as any).monthlyPrice || (car as any).monthly_price,
                                  detailsTo: (car as any).detailsTo || `/cars/${(car as any).slug || (car as any).id}`,
                                  slug: (car as any).slug,
                                  badgeText: (car as any).badgeText,
                                  badgeColor: (car as any).badgeColor,
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
