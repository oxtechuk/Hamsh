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
    const prevIndex = activeImage === 0 ? images.length - 1 : activeImage - 1;
    onImageSelect(prevIndex);
  };

  const handleNext = () => {
    if (images.length === 0) return;
    const nextIndex = activeImage === images.length - 1 ? 0 : activeImage + 1;
    onImageSelect(nextIndex);
  };

  return (
    <div className="relative flex flex-col justify-between h-full min-h-[320px] sm:min-h-[360px]">
      {/* Main image container */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        <LazyImg
          src={currentImage}
          alt={title}
          className="max-h-[320px] w-auto object-contain transition-all duration-300"
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
          <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-4 py-1.5 text-[13px] font-medium text-white shadow-md backdrop-blur-md">
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
            aria-label={t("carDetails.hero.backToGallery")}
            className="absolute end-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-md transition hover:bg-black/80"
          >
            <ArrowLeft size={18} />
          </button>
        )}
      </div>

      {/* Controls Bar at bottom (Left Arrow, Dots, Right Arrow) matching reference design */}
      <div className="flex items-center justify-between px-2 pt-4">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Image"
          className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#3A405A]/30 bg-white text-[#2B3445] shadow-xs transition hover:bg-gray-50 active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Center Dot Indicators */}
        <div className="flex items-center gap-2">
          {images.map((_, index) => {
            const isActive = activeImage === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => onImageSelect(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={[
                  "h-2.5 rounded-full transition-all duration-300",
                  isActive
                    ? "w-3.5 bg-[#DFA655]"
                    : "w-2.5 bg-[#D1D5DB] hover:bg-gray-400",
                ].join(" ")}
              />
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Image"
          className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#3A405A]/30 bg-white text-[#2B3445] shadow-xs transition hover:bg-gray-50 active:scale-95"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Optional Thumbnails Strip */}
      {!isShowingColorImage && images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x justify-center">
          {images.map((image, index) => {
            const isActive = activeImage === index;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => onImageSelect(index)}
                className={[
                  "relative h-14 w-20 shrink-0 snap-start overflow-hidden rounded-[6px] border transition duration-200",
                  isActive
                    ? "border-[#DFA655] ring-2 ring-[#DFA655]/20"
                    : "border-gray-200 opacity-70 hover:opacity-100",
                ].join(" ")}
              >
                <LazyImg
                  src={image}
                  alt={`${title} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
