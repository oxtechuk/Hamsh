import {
  Award,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type { IAboutValueItem } from "../../interfaces/IAboutValueItem";
import type { IAboutValuesSectionProps } from "../../interfaces/IAboutValuesSectionProps";

const VALUE_ICONS = {
  belonging: UsersRound,
  excellence: Award,
  transparency: ShieldCheck,
};

export default function AboutValuesSection({
  values,
  className = "",
}: IAboutValuesSectionProps) {
  const { i18n } = useTranslation();

  if (!values.length) {
    return null;
  }

  return (
    <section
      dir={i18n.dir()}
      className={[
        "w-full bg-[var(--background)]",
        "py-14 sm:py-16 lg:py-20",
        className,
      ].join(" ")}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.slice(0, 3).map((value, index) => {
            const fallbackIcons: IAboutValueItem["icon"][] = [
              "belonging",
              "excellence",
              "transparency",
            ];

            const iconKey =
              value.icon ?? fallbackIcons[index] ?? "transparency";

            const Icon = VALUE_ICONS[iconKey];

            return (
              <article
                key={value.id}
                className={[
                  "min-h-[170px] bg-white",
                  "px-7 py-7",
                  "transition duration-300",
                  "hover:-translate-y-1",
                  "hover:shadow-[0_12px_28px_rgba(48,58,84,0.08)]",
                ].join(" ")}
              >
                <div className="flex justify-start">
                  <Icon
                    size={24}
                    strokeWidth={1.6}
                    className="text-[var(--brand-primary-color)]"
                  />
                </div>

                <h3 className="mt-5 text-start text-[19px] font-extrabold text-[#303A54]">
                  {value.title}
                </h3>

                <p className="mt-3 text-start text-[13px] leading-7 text-[#677084]">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
