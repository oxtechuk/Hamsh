import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { IContactCtaSectionProps } from "../interfaces/IContactCtaSectionProps";

export default function ContactCtaSection({
  titleWhite,
  titleOrange,
  description,
  phoneText,
}: IContactCtaSectionProps) {
  const { i18n, t } = useTranslation();

  const title = [titleWhite, titleOrange].filter(Boolean).join(" ");

  return (
    <section
      dir={i18n.dir()}
      className="w-full py-8 sm:py-10 lg:py-12"
      style={{}}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={[
            "flex min-h-[260px] items-center justify-center",
            "overflow-hidden rounded-[32px]",
            "bg-[#040609]",
            "px-6 py-10",
            "sm:px-10",
          ].join(" ")}
        >
          <div className="mx-auto flex w-full max-w-[760px] flex-col items-center text-center">
            <h2
              className={[
                "text-[34px] font-extrabold leading-[1.35]",
                "text-white",
                "sm:text-[42px]",
                "lg:text-[48px]",
              ].join(" ")}
            >
              {title || t("contactCta.title", "ما لقيت العرض المناسب؟")}
            </h2>

            {description && (
              <p
                className={[
                  "mt-5 pt-5 max-w-[650px]",
                  "text-[17px] leading-8",
                  "text-white/50",
                  "sm:text-[19px]",
                  "lg:text-[21px]",
                ].join(" ")}
              >
                {description}
              </p>
            )}

            <Link
              to="/orders/ordinary"
              className={[
                "mt-10 flex h-[64px] min-w-[210px]",
                "items-center justify-center",
                "rounded-[6px]",
                "bg-[#C5232B] px-8",
                "text-[19px] font-bold text-white!",
                "transition duration-300",
                "hover:-translate-y-0.5",
                "hover:bg-[#A91D24]",
              ].join(" ")}
            >
              {phoneText || t("contactCta.button", "تواصل معنا")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
