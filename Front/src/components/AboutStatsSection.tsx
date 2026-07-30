import { useTranslation } from "react-i18next";
import { formatNumber } from "../utils/formatNumber";
import type { IAboutStatsSectionProps } from "../interfaces/IAboutStatsSectionProps";

export default function AboutStatsSection({
  stats,
  className = "",
}: IAboutStatsSectionProps) {
  const { i18n } = useTranslation();

  const localizeStatValue = (raw: string): string => {
    const match = raw.match(/^([+\-]?)(\d+)(.*)$/);
    if (!match) return raw;
    const [, sign, num, suffix] = match;
    return `${sign}${formatNumber(Number(num), i18n.language)}${suffix}`;
  };

  if (!stats.length) return null;

  return (
    <section
      dir={i18n.dir()}
      className={`w-full bg-[#FAF9F7] py-8 sm:py-10 ${className}`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div
          className={[
            "grid grid-cols-2 gap-y-8",
            "rounded-[16px] bg-[#FBEFF0]",
            "px-5 py-7",
            "sm:grid-cols-4 sm:px-8 sm:py-8",
            "lg:px-12",
          ].join(" ")}
        >
          {stats.map((stat) => (
            <article
              key={stat.id}
              className="flex flex-col items-center justify-center text-center"
            >
              <strong className="text-[27px] font-extrabold leading-none text-[#C5232B] sm:text-[31px]">
                {localizeStatValue(stat.value)}
              </strong>
              <p className="mt-3 text-[12px] font-medium text-[#D9878B] sm:text-[13px]">
                {stat.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
