import { getImageUrl, APP_IMAGES } from "../../constants/app-images";
import LazyImg from "../LazyImg";
import type { IOOCarGridCardProps } from "../../interfaces/IOOCarGridCardProps";

export default function OOCarGridCard({ car, selected, onSelect }: IOOCarGridCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "flex items-center gap-3",
        "rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3",
        "transition w-full hover:border-[var(--brand-secondary-color)]/40",
        selected ? "border-[var(--brand-secondary-color)] ring-2 ring-[var(--brand-secondary-color)]/15" : "",
      ].join(" ")}
    >
      <LazyImg
        src={getImageUrl(car.main_image) || APP_IMAGES.CAR_PLACEHOLDER}
        alt={car.name}
        className="h-[52px] w-[68px] shrink-0 rounded-[8px] object-cover"
      />

      <div className="flex-1 text-start">
        <p className="text-[13px] font-extrabold text-[#111111]">
         {car.name}
        </p>
        {car.current_price ? (
          <p className="text-[12px] text-[var(--brand-secondary-color)] font-bold">
            {car.current_price.toLocaleString()} ر.س
          </p>
        ) : null}
      </div>

      <span
        className={[
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-[var(--brand-secondary-color)]" : "border-[#D1D5DB]",
        ].join(" ")}
      >
        {selected && <span className="h-[9px] w-[9px] rounded-full bg-[var(--brand-secondary-color)]" />}
      </span>
    </button>
  );
}
