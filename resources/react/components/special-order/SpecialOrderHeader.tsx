import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function SpecialOrderHeader() {
    const { t, i18n } = useTranslation();

    return (
        <div className="mx-auto max-w-[1280px] px-5 pt-8 sm:px-8 lg:px-10">
            <nav
                className="flex items-center justify-start gap-2 text-[11px]"
                aria-label="breadcrumb"
            >
                <Link to="/" className="font-medium text-[#303A54]">
                    {t("specialOrder.breadcrumb.home")}
                </Link>

                <span className="text-[#8B909A]">
                    {i18n.dir() === "rtl" ? "‹" : "›"}
                </span>

                <span className="text-[var(--brand-primary-color)]">
                    {t("specialOrder.hero.badge")}
                </span>
            </nav>

            <h1
                className={[
                    "mt-3 text-start",
                    "text-[30px] font-extrabold",
                    "leading-tight text-[#20283A]",
                    "sm:text-[36px]",
                ].join(" ")}
            >
                <span>{t("specialOrder.pageTitle.prefix")}</span>{" "}
                <span className="text-[var(--brand-primary-color)]">
                    {t("specialOrder.pageTitle.highlight")}
                </span>
            </h1>
        </div>
    );
}
