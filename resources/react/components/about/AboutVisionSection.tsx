import { useTranslation } from "react-i18next";

import type { IAboutVisionSectionProps } from "../../interfaces/IAboutVisionSectionProps";

export default function AboutVisionSection({
  eyebrow,
  titleLine1,
  titleHighlight,
  titleLine2,
  description,
  image,
  className = "",
}: IAboutVisionSectionProps) {
  const { t, i18n } = useTranslation();

  return (
    <section
      dir={i18n.dir()}
      className={`w-full bg-white py-4 sm:py-6 lg:py-8 mb-16 sm:mb-20 lg:mb-24 ${className}`}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div
          className={[
            "grid grid-cols-1",
            "overflow-hidden bg-white",
            "lg:grid-cols-2",
            "lg:h-auto",
          ].join(" ")}
        >
          {/* Content */}
          <div
            className={[
              "flex flex-col justify-center",
              "px-6 py-10",
              "sm:px-10 sm:py-12",
              "lg:px-16 lg:py-16",
            ].join(" ")}
          >
            <div className="max-w-[520px] text-start">
              <p className="text-[11px] font-semibold text-[var(--brand-primary-color)] sm:text-[13px]">
                {eyebrow}
              </p>

              <h2
                className={[
                  "mt-4",
                  "text-[26px] font-extrabold",
                  "leading-[1.45]",
                  "text-[var(--brand-secondary-color)]",
                  "sm:text-[32px]",
                  "lg:text-[40px]",
                ].join(" ")}
              >
                <span className="block">{titleLine1}</span>

                <span className="block">
                  <span className="text-[var(--brand-primary-color)]">
                    {titleHighlight}
                  </span>{" "}
                  {titleLine2}
                </span>
              </h2>

              {description && (
                <p className="mt-6 text-[14px] leading-8 text-[#687084] sm:text-[15px]">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="relative min-h-[250px] overflow-hidden sm:min-h-[320px] lg:min-h-0">
            <img
              src={image}
              alt={titleLine1 ?? ""}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
