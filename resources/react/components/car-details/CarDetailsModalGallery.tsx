import { useTranslation } from "react-i18next";

import LazyImg from "../LazyImg";
import { localize } from "../../utils/localize";
import type { ICarDetailsModalGalleryProps } from "../../interfaces/ICarDetailsModalGalleryProps";

export default function CarDetailsModalGallery({
    car,
    images,
    activeImage,
    onSelectImage,
    onPrev,
    onNext,
}: ICarDetailsModalGalleryProps) {
    const { t, i18n } = useTranslation();

    return (
        <div className="order-1 flex flex-col">
            <div className="relative h-[260px] w-full overflow-hidden sm:h-[340px]">
                <div className="relative overflow-hidden h-full w-full object-cover">
                    <LazyImg
                        src={images[activeImage] ?? car.main_image}
                        alt={localize(car.name, i18n.language)}
                        className="w-full h-full object-cover relative z-10 transition-opacity duration-300 opacity-100"
                    />
                </div>
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
                            className={`h-[70px] w-full overflow-hidden transition duration-300 ${
                                activeImage === index
                                    ? "opacity-100 ring-2 ring-inset ring-[var(--brand-primary-color)]"
                                    : "opacity-70 hover:opacity-100"
                            }`}
                        >
                            <div className="relative overflow-hidden h-full w-full object-cover">
                                <LazyImg
                                    src={image}
                                    alt=""
                                    className="w-full h-full object-cover relative z-10 transition-opacity duration-300 opacity-100"
                                />
                            </div>
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
                        aria-label={t("carDetails.actions.prevImage", {
                            defaultValue: "الصورة السابقة",
                        })}
                        className="flex h-9 w-9 items-center justify-center border border-[#E1E2E5] bg-white text-[#20283A] transition hover:bg-[#F5F4EF]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-left"
                            aria-hidden="true"
                        >
                            <path d="m15 18-6-6 6-6"></path>
                        </svg>
                    </button>

                    <div className="flex items-center gap-1.5">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => onSelectImage(index)}
                                aria-label={t("carDetails.actions.goToSlide", {
                                    defaultValue: `انتقل للصورة ${index + 1}`,
                                    number: index + 1,
                                })}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    activeImage === index
                                        ? "w-5 bg-[var(--brand-primary-color)]"
                                        : "w-2 bg-[#D9D9D9]"
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onNext}
                        aria-label={t("carDetails.actions.nextImage", {
                            defaultValue: "الصورة التالية",
                        })}
                        className="flex h-9 w-9 items-center justify-center border border-[#E1E2E5] bg-white text-[#20283A] transition hover:bg-[#F5F4EF]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-right"
                            aria-hidden="true"
                        >
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

