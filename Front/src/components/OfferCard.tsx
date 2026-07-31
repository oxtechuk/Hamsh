import { useNavigate } from "react-router-dom";
import type { IOfferCardProps } from "../interfaces/IOfferCardProps";
import Button from "./button";
import LazyImg from "./LazyImg";

export default function OfferCard({
  image,
  title,
  buttonText,
  buttonTo,
  badge,
}: IOfferCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(buttonTo)}
      className="relative h-[400px] w-full max-w-[347px] cursor-pointer overflow-hidden rounded-[16px] shadow-lg"
    >
      <LazyImg src={image} alt={title ?? "Offer"} className="h-full w-full object-cover" />

      {title && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      )}

      {badge && (
        <div className="absolute top-4 right-4 z-10 bg-[var(--brand-secondary-color,#c0272d)] rounded-[10px] p-[3px] shadow-lg">
          <div className="rounded-[8px] border-2 border-white/60 px-4 py-1.5">
            <span className="text-white text-[15px] font-bold">
              {badge}
            </span>
          </div>
        </div>
      )}

      {title && (
        <div className="absolute left-6 right-6 top-[100px] z-10">
          <h3 className="text-white text-[24px] font-bold leading-tight text-center">
            {title}
          </h3>
        </div>
      )}

      <div className="absolute bottom-6 left-6 right-6 z-10" onClick={(e) => e.stopPropagation()}>
        <Button
          to={buttonTo}
          bgColor="bg-[var(--brand-secondary-color)]"
          className="w-full h-[52px] px-0 py-0 text-[16px]"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
