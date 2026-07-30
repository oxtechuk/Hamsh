import { useTranslation } from "react-i18next";
import type { IContactPageLayoutProps } from "../interfaces/IContactPageLayoutProps";

export default function ContactPageLayout({
  form,
  map,
  faq,
  bottomContent,
  className = "",
}: IContactPageLayoutProps) {
  const { i18n } = useTranslation();

  return (
    <section
      dir={i18n.dir()}
      className={`w-full py-10 sm:py-14 lg:py-16 ${className}`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div
          className={[
            "grid grid-cols-1 items-start gap-8",
            "lg:grid-cols-[minmax(320px,0.72fr)_minmax(0,1.28fr)]",
            "lg:gap-10 xl:grid-cols-[380px_minmax(0,1fr)] xl:gap-12",
          ].join(" ")}
        >
          <aside className="min-w-0">
            <div className="lg:sticky lg:top-[110px]">{form}</div>
          </aside>

          <div className="min-w-0 space-y-8">
            {map}
            {faq}
          </div>
        </div>

        {bottomContent && <div className="mt-12">{bottomContent}</div>}
      </div>
    </section>
  );
}
