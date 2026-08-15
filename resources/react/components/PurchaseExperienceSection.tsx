import { useTranslation } from "react-i18next";
import "bootstrap-icons/font/bootstrap-icons.css";

import type {
  IPurchaseExperienceSectionProps,
  IPurchaseFeature,
} from "../interfaces/IPurchaseExperienceSectionProps";
import { useLanguageStore } from "../store/language.store";

const ICON_MAP: Record<string, string> = {
  "bi-shield-check": "bi bi-shield-check",
  "bi-cash-coin": "bi bi-cash-coin",
  "bi-truck": "bi bi-truck",
  "bi-credit-card": "bi bi-credit-card",
  "bi-gear": "bi bi-gear",
  "bi-headset": "bi bi-headset",
  "bi-star": "bi bi-star",
  "bi-award": "bi bi-award",
};

function resolveIcon(icon: string): string {
  if (icon.startsWith("bi ")) return icon;
  if (icon.startsWith("bi-")) return `bi ${icon}`;
  return ICON_MAP[icon] || `bi ${icon}`;
}

const DEFAULT_FEATURES: IPurchaseFeature[] = [
  {
    id: "finance",
    title: "purchaseExperience.features.finance.title",
    description: "purchaseExperience.features.finance.description",
    icon: "bi-shield-check",
  },
  {
    id: "ownership",
    title: "purchaseExperience.features.ownership.title",
    description: "purchaseExperience.features.ownership.description",
    icon: "bi-cash-coin",
  },
  {
    id: "options",
    title: "purchaseExperience.features.options.title",
    description: "purchaseExperience.features.options.description",
    icon: "bi-truck",
  },
  {
    id: "prices",
    title: "purchaseExperience.features.prices.title",
    description: "purchaseExperience.features.prices.description",
    icon: "bi-credit-card",
  },
];

export default function PurchaseExperienceSection({
  features,
}: IPurchaseExperienceSectionProps) {
  const { t } = useTranslation();
  const direction = useLanguageStore((state) => state.direction);

  const resolvedFeatures = features?.length
    ? features.map((f) => ({
        ...f,
        title: f.title,
        description: f.description,
        icon: resolveIcon(f.icon),
      }))
    : DEFAULT_FEATURES.map((f) => ({
        ...f,
        title: t(f.title),
        description: t(f.description),
        icon: resolveIcon(f.icon),
      }));

  return (
    <section
      dir={direction}
      className="relative w-full overflow-hidden bg-[#040609] py-16 text-white sm:py-20"
    >
      {/* Red glow — start side */}
      <div className="pointer-events-none absolute start-0 top-1/2 h-[400px] w-[300px] -translate-y-1/2 rounded-full bg-[#C5232B] opacity-[0.12] blur-[80px]" />
      {/* Red glow — end side */}
      <div className="pointer-events-none absolute end-0 top-1/2 h-[400px] w-[300px] -translate-y-1/2 rounded-full bg-[#C5232B] opacity-[0.12] blur-[80px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Features */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {resolvedFeatures.map((feature) => (
            <article
              key={feature.id}
              className={[
                "group relative min-h-[175px] rounded-[18px] overflow-hidden",
                "border border-[#30343B]",
                "bg-[#262A30]",
                "px-6 pb-5 pt-4",
                "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
                "transition duration-300",
                "hover:-translate-y-1",
                "hover:border-[#3E434B]",
                "hover:bg-[#2B2F35]",
                "hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
              ].join(" ")}
            >
              <div className="flex justify-start">
                <div
                  className={[
                    "flex h-[52px] w-[52px] items-center justify-center",
                    "rounded-[15px]",
                    "border border-[#5A252B]",
                    "bg-[#3A2025]",
                    "text-[#E12A33]",
                    "transition duration-300",
                    "group-hover:scale-105",
                    "group-hover:bg-[#442329]",
                  ].join(" ")}
                >
                  <i className={`${feature.icon} text-[24px]`} />
                </div>
              </div>

              <h3 className="mt-4 text-[18px] font-bold text-white">
                {feature.title}
              </h3>

              <p className="mt-3 text-[14px] leading-7 text-[#9A9EA5]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
