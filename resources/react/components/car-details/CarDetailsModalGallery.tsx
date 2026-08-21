import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

import LazyImg from "../LazyImg";
import { localize } from "../../utils/localize";

import type { ICarDetailsModalGalleryProps } from "../../interfaces/ICarDetailsModalGalleryProps";

export default function CarDetailsModalGallery({
    car,
    images,
    activeImage,
    badge,
    onSelectImage,
    onPrev,
    onNext,
}: ICarDetailsModalGalleryProps) {
    const { t, i18n } = useTranslation();

    return (
        <div className="order-1 flex flex-col">
            <div className="relative h-[260px] w-full overflow-hidden sm:h-[340px]">
                <LazyImg
                    src={images[activeImage] ?? car.main_image}
                    alt={localize(car.name, i18n.language)}
                    className="h-full w-full object-cover"
                />

                {badge?.text && (
                    <span className="absolute start-4 top-4 rounded-[4px] bg-[var(--brand-primary-color)] px-3 py-1 text-[12px] font-bold text-[#20283A]">
                        {badge.text}
                    </span>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <p className="text-[12px] text-white/80">
                        {localize(car.brand?.name, i18n.language)} · {car.year}
                    </p>
                    <p className="text-[18px] font-extrabold">
                        {localize(car.name, i18n.language)}
                    </p>
                </div>
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-1">
                    {images.slice(0, 4).map((image, index) => (
                        <button
                            key={image + index}
                            type="button"
                            onClick={() => onSelectImage(index)}
                            className={[
                                "h-[70px] w-full overflow-hidden",
                                "transition duration-300",
                                activeImage === index
                                    ? "opacity-100 ring-2 ring-inset ring-[var(--brand-primary-color)]"
                                    : "opacity-70 hover:opacity-100",
                            ].join(" ")}
                        >
                            <LazyImg
                                src={image}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {images.length > 1 && (
                <div
                    dir="ltr"
                    className="flex items-center justify-center gap-4 pt-4 pb-8"
                >
                    <button
                        type="button"
                        onClick={onPrev}
                        aria-label={t("carDetails.actions.prevImage")}
                        className="flex h-9 w-9 items-center justify-center border border-[#E1E2E5] bg-white text-[#20283A] transition hover:bg-[#F5F4EF]"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1.5">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => onSelectImage(index)}
                                aria-label={t("carDetails.actions.goToSlide", {
                                    number: index + 1,
                                })}
                                className={[
                                    "h-2 rounded-full transition-all duration-300",
                                    activeImage === index
                                        ? "w-5 bg-[var(--brand-primary-color)]"
                                        : "w-2 bg-[#D9D9D9]",
                                ].join(" ")}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onNext}
                        aria-label={t("carDetails.actions.nextImage")}
                        className="flex h-9 w-9 items-center justify-center border border-[#E1E2E5] bg-white text-[#20283A] transition hover:bg-[#F5F4EF]"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
