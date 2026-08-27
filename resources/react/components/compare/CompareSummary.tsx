import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { ICompareSummaryProps } from "../../interfaces/ICompareSummaryProps";

export default function CompareSummary({
    sections,
    car1Name,
    car2Name,
    car1Slug,
    car2Slug,
}: ICompareSummaryProps) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const car1Score = sections.reduce(
        (sum, section) =>
            sum + section.rows.filter((row) => row.winner === 1).length,
        0,
    );

    const car2Score = sections.reduce(
        (sum, section) =>
            sum + section.rows.filter((row) => row.winner === 2).length,
        0,
    );

    const isTie = car1Score === car2Score;
    const car1Wins = car1Score > car2Score;

    const winnerName = isTie ? null : car1Wins ? car1Name : car2Name;
    const winnerScore = Math.max(car1Score, car2Score);
    const totalComparedCriteria = sections.reduce(
        (sum, section) => sum + section.rows.length,
        0,
    );
    const winnerSlug = isTie ? null : car1Wins ? car1Slug : car2Slug;

    const handleOpenWinner = () => {
        if (!winnerSlug) return;
        navigate(`/cars/${winnerSlug}`);
    };

    return (
        <section
            dir={i18n.dir()}
            className="mx-auto w-full max-w-7xl px-4 pb-10"
        >
            <div
                className={[
                    "flex min-h-[245px] flex-col items-center justify-center",
                    "rounded-[20px] border border-[#E8BFC1]",
                    "bg-[#dcbb73]/13",
                    "px-6 py-8 text-center",
                    "sm:min-h-[265px] sm:px-10",
                ].join(" ")}
            >
                {/* Small heading */}
                <p className="text-[14px] font-bold text-[#111111]">
                    {t("comparePage.summaryBadge")}
                </p>

                {/* Winner name */}
                <h2
                    className={[
                        "mt-4 text-[30px] font-extrabold leading-tight",
                        "text-[var(--brand-secondary-color)]",
                        "sm:text-[34px]",
                    ].join(" ")}
                >
                    {isTie ? t("comparePage.tieResult") : winnerName}
                </h2>

                {/* Score line */}
                <p className="mt-4 text-[16px] font-medium text-[#111111]">
                    {isTie ? (
                        <>
                            {t("comparePage.tieScorePrefix")}{" "}
                            <span className="font-extrabold text-[var(--brand-secondary-color)]">
                                {car1Score}
                            </span>{" "}
                            {t("comparePage.scoreSuffix", {
                                total: totalComparedCriteria,
                            })}
                        </>
                    ) : (
                        <>
                            {t("comparePage.scorePrefix")}{" "}
                            <span className="font-extrabold text-[var(--brand-secondary-color)]">
                                {winnerScore}
                            </span>{" "}
                            {t("comparePage.scoreSuffix", {
                                total: totalComparedCriteria,
                            })}
                        </>
                    )}
                </p>

                {/* CTA — only when there's a clear winner */}
                {!isTie && (
                    <button
                        type="button"
                        onClick={handleOpenWinner}
                        disabled={!winnerSlug}
                        className={[
                            "mt-5 flex h-[70px] min-w-[200px]",
                            "items-center justify-center rounded-[6px]",
                            "bg-[var(--brand-secondary-color)] px-8",
                            "text-[19px] font-bold text-white",
                            "transition duration-300",
                            "hover:bg-[#AA1E25]",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                        ].join(" ")}
                    >
                        {t("comparePage.getItNow")}
                    </button>
                )}
            </div>
        </section>
    );
}
