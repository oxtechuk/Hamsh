import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import type { ICarDetailsGalleryProps } from "../../interfaces/ICarDetailsGalleryProps";
import LazyImg from "../LazyImg";

export default function CarDetailsGallery({
    title,
    images,
    currentImage,
    activeImage,
    onImageSelect,
    isShowingColorImage,
    selectedColor,
    onClearColor,
}: ICarDetailsGalleryProps) {
    const { t } = useTranslation();

    const handlePrev = () => {
        if (images.length === 0) return;
        onImageSelect(activeImage === 0 ? images.length - 1 : activeImage - 1);
    };

    const handleNext = () => {
        if (images.length === 0) return;
        onImageSelect(activeImage === images.length - 1 ? 0 : activeImage + 1);
    };

    return (
        <div className="relative h-full w-full overflow-hidden ">
            {/* Main image — fills the full card */}
            <LazyImg
                src={currentImage}
                alt={title}
                className="h-full w-full object-cover transition-all duration-300"
            />

            {/* Color overlay */}
            {selectedColor && !isShowingColorImage && (
                <div
                    className="pointer-events-none absolute inset-0 transition-all duration-300"
                    style={{
                        backgroundColor: selectedColor.value,
                        opacity: 0.15,
                        mixBlendMode: "multiply",
                    }}
                />
            )}

            {/* Selected color label */}
            {selectedColor && (
                <div className="absolute top-3 start-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-4 py-1.5 text-[13px] font-medium text-white shadow-md backdrop-blur-md">
                    <span
                        className="h-3 w-3 shrink-0 rounded-full border border-white/50"
                        style={{ backgroundColor: selectedColor.value }}
                    />
                    <span>{selectedColor.name}</span>
                </div>
            )}

            {/* Back button when showing color image */}
            {isShowingColorImage && (
                <button
                    type="button"
                    onClick={onClearColor}
                    aria-label={t("carDetails.actions.backToGallery")}
                    className="absolute end-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-md transition hover:bg-black/80"
                >
                    <ArrowLeft size={18} />
                </button>
            )}

            {/* Arrows + dots overlaid at bottom */}
            <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleNext}
                    aria-label={t("carDetails.actions.nextImage")}
                    className="flex h-10 w-10 items-center justify-center  bg-white/80 backdrop-blur-sm text-[#2B3445] shadow-sm transition hover:bg-white active:scale-95"
                >
                    <ChevronRight size={20} />
                </button>

                {/* Dot indicators (reversed for RTL) */}
                <div className="flex items-center gap-1.5">
                    {[...images].reverse().map((_, i) => {
                        const index = images.length - 1 - i;
                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => onImageSelect(index)}
                                aria-label={t("carDetails.actions.goToSlide", {
                                    number: index + 1,
                                })}
                                className={[
                                    "rounded-full transition-all duration-300",
                                    activeImage === index
                                        ? "w-3.5 h-2.5 bg-[#DFA655]"
                                        : "w-2.5 h-2.5 bg-white/70 hover:bg-white",
                                ].join(" ")}
                            />
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={handlePrev}
                    aria-label={t("carDetails.actions.prevImage")}
                    className="flex h-10 w-10 items-center justify-center bg-white/80 backdrop-blur-sm text-[#2B3445] shadow-sm transition hover:bg-white active:scale-95"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>
        </div>
    );
}
