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
    "bi-people": "bi bi-people",
    "bi-shield": "bi bi-shield",
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
        <section dir={direction} className="w-full pb-14 sm:pb-16 lg:pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {resolvedFeatures.map((feature) => (
                        <article
                            key={feature.id}
                            className={[
                                "flex flex-col items-start text-start",
                                "border border-[#ECE8DF] bg-white",
                                "px-6 py-6",
                                "transition duration-300",
                                "hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
                            ].join(" ")}
                        >
                            <i
                                className={`${feature.icon} text-[26px] text-[var(--brand-primary-color)]`}
                            />

                            <h3 className="mt-4 text-[17px] font-extrabold text-[#20283A]">
                                {feature.title}
                            </h3>

                            <p className="mt-2 text-[13px] leading-6 text-[#8B909C]">
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
