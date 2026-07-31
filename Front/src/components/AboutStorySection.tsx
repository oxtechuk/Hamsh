import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Crosshair, HandHeart, Sparkles } from "lucide-react";
import { formatNumber } from "../utils/formatNumber";
import LazyImg from "./LazyImg";
import type {
  IAboutValueItem,
  IAboutStorySectionProps,
} from "../interfaces/IAboutStorySectionProps";

const DEFAULT_VALUE_ICONS: Record<string, ReactNode> = {
  vision: <Crosshair size={22} strokeWidth={1.9} />,
  mission: <HandHeart size={22} strokeWidth={1.9} />,
  values: <Sparkles size={22} strokeWidth={1.9} />,
};

export default function AboutStorySection({
  eyebrow,
  title,
  paragraphs,
  primaryImage,
  secondaryImage,
  statValue = "#1",
  statLabel,
  values,
  className = "",
}: IAboutStorySectionProps) {
  const { t, i18n } = useTranslation();

  const localizeStatValue = (raw: string): string => {
    const match = raw.match(/^([^0-9]*)(\d+)(.*)$/);
    if (!match) return raw;
    const [, prefix, num, suffix] = match;
    return `${prefix}${formatNumber(Number(num), i18n.language)}${suffix}`;
  };

  const DEFAULT_VALUES: IAboutValueItem[] = [
    {
      id: "vision",
      title: t("aboutPage.story.values.vision.title"),
      description: t("aboutPage.story.values.vision.description"),
      icon: DEFAULT_VALUE_ICONS.vision,
      variant: "light",
    },
    {
      id: "mission",
      title: t("aboutPage.story.values.mission.title"),
      description: t("aboutPage.story.values.mission.description"),
      icon: DEFAULT_VALUE_ICONS.mission,
      variant: "dark",
    },
    {
      id: "values",
      title: t("aboutPage.story.values.values.title"),
      description: t("aboutPage.story.values.values.description"),
      icon: DEFAULT_VALUE_ICONS.values,
      variant: "light",
    },
  ];

  const resolvedValues: IAboutValueItem[] = (values ?? DEFAULT_VALUES).map(
    (item, index) => ({
      ...DEFAULT_VALUES[index % DEFAULT_VALUES.length],
      ...item,
    }),
  );

  return (
    <section
      dir={i18n.dir()}
      className={`w-full bg-[#FAF9F7] py-16 sm:py-20 lg:py-24 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: text + images */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div className="text-start">
            {eyebrow && (
              <p className="text-[13px] font-bold text-[#C5232B] sm:text-[14px]">
                {eyebrow}
              </p>
            )}
            <h2 className="mt-3 max-w-[620px] text-[34px] font-extrabold leading-[1.25] text-[#101010] sm:text-[42px] lg:text-[46px]">
              {title}
            </h2>
            <div className="mt-5 max-w-[650px] space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${paragraph.slice(0, 20)}-${index}`}
                  className="text-[15px] leading-8 text-[#8A8A8A] sm:text-[16px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Images composition */}
          <div className="relative mx-auto w-full max-w-[600px]">
            <div className="grid grid-cols-[1fr_1.05fr] items-center gap-4">
              <div className="overflow-hidden rounded-[14px] bg-[#E8E8E8]">
                <LazyImg
                  src={primaryImage}
                  alt=""
                  className="h-[365px] w-full object-cover sm:h-[405px]"
                />
              </div>
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[14px] bg-[#E8E8E8]">
                  <LazyImg
                    src={secondaryImage}
                    alt=""
                    className="h-[210px] w-full object-cover sm:h-[240px]"
                  />
                </div>
                <div className="flex min-h-[115px] flex-col justify-center rounded-[14px] bg-[#C5232B] px-6 py-5 text-white text-end">
                  <strong className="text-[34px] font-extrabold leading-none">
                    {localizeStatValue(statValue)}
                  </strong>
                  {statLabel && (
                    <span className="mt-3 text-[13px] text-white/80">
                      {statLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values cards */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3 lg:mt-16 lg:gap-7">
          {resolvedValues.map((item) => (
            <AboutValueCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutValueCard({ item }: { item: IAboutValueItem }) {
  const isDark = item.variant === "dark";

  return (
    <article
      className={[
        "group min-h-[155px] rounded-[16px] border px-6 py-5",
        "transition duration-300 hover:-translate-y-1",
        isDark
          ? "border-[#252933] bg-[#10131B] text-white shadow-[0_14px_30px_rgba(4,6,9,0.14)]"
          : "border-[#ECEAE6] bg-white text-[#111111] shadow-[0_6px_18px_rgba(15,23,42,0.04)]",
      ].join(" ")}
    >
      <div className="min-w-0 text-start">
        <div className="flex items-center gap-3">
          {item.icon && (
            <div
              className={[
                "flex h-[44px] w-[44px] shrink-0 items-center justify-center",
                "rounded-[12px] border",
                "transition duration-300 group-hover:scale-105",
                isDark
                  ? "border-[#5D2529] bg-[#2B171B] text-[#D52B32]"
                  : "border-[#F1D8D9] bg-[#FFF4F4] text-[#D52B32]",
              ].join(" ")}
            >
              {item.icon}
            </div>
          )}
          <h3
            className={[
              "text-[21px] font-extrabold",
              isDark ? "text-white" : "text-[#111111]",
            ].join(" ")}
          >
            {item.title}
          </h3>
        </div>
        <p
          className={[
            "mt-4 text-[13px] leading-7",
            isDark ? "text-white/55" : "text-[#777D86]",
          ].join(" ")}
        >
          {item.description}
        </p>
      </div>
    </article>
  );
}
