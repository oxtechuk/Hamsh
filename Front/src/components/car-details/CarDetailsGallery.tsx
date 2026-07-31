import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
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

  return (
    <div className="min-w-0">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-[8px] border border-[#E8E8E8] bg-[#F4F4F4]">
        <LazyImg
          src={currentImage}
          alt={title}
          className="h-auto w-full object-contain"
        />

        {/* Color overlay */}
        {selectedColor && !isShowingColorImage && (
          <div
            className="pointer-events-none absolute inset-0 transition-all duration-300"
            style={{
              backgroundColor: selectedColor.value,
              opacity: 0.18,
              mixBlendMode: "multiply",
            }}
          />
        )}

        {/* Selected color label */}
        {selectedColor && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-[13px] font-medium text-white shadow-lg backdrop-blur-md">
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
            className="absolute end-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/75"
          >
            <ArrowLeft size={18} />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {!isShowingColorImage && images.length > 0 && (
        <div className="mt-4 overflow-hidden">
          <div
            dir="ltr"
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory"
          >
            {images.map((image, index) => {
              const isActive = activeImage === index;
              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => onImageSelect(index)}
                  aria-label={`${title} ${index + 1}`}
                  className={[
                    "relative h-[74px] w-[116px] shrink-0 snap-start overflow-hidden",
                    "rounded-[6px] transition duration-300 sm:w-[126px]",
                    isActive
                      ? "opacity-100"
                      : "border border-white opacity-80 hover:border-[#B7BCC2] hover:opacity-100",
                  ].join(" ")}
                >
                  <LazyImg
                    src={image}
                    alt={`${title} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {!isActive && (
                    <span className="pointer-events-none absolute inset-0 bg-white/5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
