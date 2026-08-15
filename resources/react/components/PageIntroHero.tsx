import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "react-i18next";

export interface PageIntroHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;

  children?: ReactNode;

  backgroundColor?: string;
  backgroundImage?: string;
  overlay?: boolean;

  contentWidth?: string;
  minHeight?: number;

  className?: string;
  contentClassName?: string;
}

export default function PageIntroHero({
  eyebrow,
  title,
  description,
  children,

  backgroundColor = "#040609",
  backgroundImage,
  overlay = true,

  contentWidth = "650px",
  minHeight = 160,

  className = "",
  contentClassName = "",
}: PageIntroHeroProps) {
  const { i18n } = useTranslation();

  const direction = i18n.dir();

  const sectionStyle: CSSProperties = {
    minHeight,
    backgroundColor,
    backgroundImage: backgroundImage
      ? `url("${backgroundImage}")`
      : undefined,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  return (
    <section
      dir={direction}
      style={sectionStyle}
      className={[
        "relative flex w-full items-center overflow-hidden",
        className,
      ].join(" ")}
    >
      {/* Dark overlay when a background image is used */}
      {backgroundImage && overlay && (
        <div className="pointer-events-none absolute inset-0 bg-black/65" />
      )}

      {/* Red ambient glow */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-y-0 start-0 w-[55%]",
          "bg-[radial-gradient(circle_at_center,rgba(118,15,23,0.24),transparent_68%)]",
        ].join(" ")}
      />

      {/* Secondary dark gradient */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          "bg-gradient-to-l from-[#26080C]/20 via-transparent to-transparent",
          "rtl:bg-gradient-to-r",
        ].join(" ")}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <div
          className={[
            "text-start",
            contentClassName,
          ].join(" ")}
          style={{
            maxWidth: contentWidth,
          }}
        >
          {eyebrow && (
            <p className="text-[13px] font-bold text-[var(--brand-secondary-color)] sm:text-[14px]">
              {eyebrow}
            </p>
          )}

          <h1
            className={[
              eyebrow ? "mt-4" : "",
              "text-[34px] font-extrabold leading-[1.3] text-white",
              "sm:text-[42px] lg:text-[48px]",
            ].join(" ")}
          >
            {title}
          </h1>

          {description && (
            <p className="mt-4 max-w-[620px] text-[14px] leading-7 text-white/55 sm:text-[16px] sm:leading-8">
              {description}
            </p>
          )}

          {children && (
            <div className="mt-7">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}