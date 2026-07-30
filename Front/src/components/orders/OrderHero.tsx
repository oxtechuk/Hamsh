import { useTranslation } from "react-i18next";

interface IOrderHeroProps {
  badgeKey: string;
  badgeFallback: string;
  titleKey: string;
  titleFallback: string;
  subtitleKey: string;
  subtitleFallback: string;
}

export default function OrderHero({ badgeKey, badgeFallback, titleKey, titleFallback, subtitleKey, subtitleFallback }: IOrderHeroProps) {
  const { t } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden bg-[#060709] px-4 py-10 sm:py-14">
      <div className="pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <p className="mb-3 text-[13px] font-semibold text-[var(--brand-secondary-color)]">
          {t(badgeKey, badgeFallback)}
        </p>
        <h1 className="whitespace-pre-line text-[32px] font-extrabold leading-tight text-white sm:text-[42px]">
          {t(titleKey, titleFallback)}
        </h1>
        <p className="mt-3 pt-5 text-[14px] text-white/70">
          {t(subtitleKey, subtitleFallback)}
        </p>
      </div>
    </section>
  );
}
