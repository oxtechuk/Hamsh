import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type {
  ICarDetailsRecommendationItem,
  ICarDetailsRecommendationsProps,
} from "../interfaces/ICarDetailsRecommendationsProps";
import LazyImg from "./LazyImg";

export type { ICarDetailsRecommendationItem };

export default function CarDetailsRecommendations({
  title,
  cars,
  maxItems = 3,
}: ICarDetailsRecommendationsProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const visibleCars = cars.slice(0, maxItems);

  if (!visibleCars.length) return null;

  return (
    <section
      dir={i18n.dir()}
      className="mt-5 overflow-hidden rounded-[20px] border border-[#E6E6E6] bg-white px-5 py-6 shadow-[0_3px_14px_rgba(15,23,42,0.04)]"
    >
      <h2 className="text-start text-[22px] font-extrabold text-[#111111]">
        {title ?? t("carDetails.recommendations.title")}
      </h2>

      <div className="mt-5 flex flex-col">
        {visibleCars.map((car, index) => (
          <RecommendationRow
            key={car.id}
            car={car}
            isLast={index === visibleCars.length - 1}
            onNavigate={() => navigate(car.detailsTo)}
          />
        ))}
      </div>
    </section>
  );
}

function RecommendationRow({
  car,
  isLast,
  onNavigate,
}: {
  car: ICarDetailsRecommendationItem;
  isLast: boolean;
  onNavigate: () => void;
}) {
  const { t } = useTranslation();

  return (
    <article
      onClick={onNavigate}
      className={[
        "group grid cursor-pointer items-center gap-3 py-3",
        "grid-cols-[92px_minmax(0,1fr)_108px]",
        !isLast ? "" : "",
      ].join(" ")}
    >
      <div className="h-[58px] overflow-hidden rounded-[8px] bg-[#F2F2F2]">
        <LazyImg
          src={car.image}
          alt={car.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 text-start">
        <h3
          title={car.name}
          className="truncate text-[16px] font-extrabold text-[#111111]"
        >
          {car.name}
        </h3>
        <p className="mt-1 truncate text-[14px] font-medium text-[#D0262E]">
          {car.price}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate();
        }}
        className="flex h-[34px] items-center justify-center rounded-[5px] bg-[var(--brand-secondary-color)] px-4 text-[13px] font-bold text-white transition duration-300 hover:opacity-90"
      >
        {t("carDetails.recommendations.details")}
      </button>
    </article>
  );
}
