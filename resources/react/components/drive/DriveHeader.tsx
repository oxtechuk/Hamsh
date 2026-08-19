import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function DriveHeader() {
    const { t, i18n } = useTranslation();

    return (
        <div className="mx-auto max-w-[1280px] px-5 pt-8 sm:px-8 lg:px-10">
            <nav
                aria-label="breadcrumb"
                className="flex items-center gap-2 text-[11px]"
            >
                <Link
                    to="/"
                    className="font-medium text-[#303A54] transition hover:text-[var(--brand-primary-color)]"
                >
                    {t("drivePage.breadcrumb.home")}
                </Link>

                <span className="text-[#8B909A]">
                    {i18n.dir() === "rtl" ? "‹" : "›"}
                </span>

                <span className="text-[var(--brand-primary-color)]">
                    {t("drivePage.breadcrumb.current")}
                </span>
            </nav>

            <h1 className="mt-3 text-start text-[30px] font-extrabold leading-tight text-[#20283A] sm:text-[36px]">
                <span>{t("drivePage.title.prefix")}</span>{" "}
                <span className="text-[var(--brand-primary-color)]">
                    {t("drivePage.title.highlight")}
                </span>
            </h1>
        </div>
    );
}
