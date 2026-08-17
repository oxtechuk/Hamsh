import type { IAboutStatsSectionProps } from "../../interfaces/IAboutStatsSectionProps";

export default function AboutStatsSection({ stats }: IAboutStatsSectionProps) {
    if (!stats.length) {
        return null;
    }

    return (
        <section className="w-full bg-[var(--background)] pt-16 pb-8 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-16">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                <div className="grid grid-cols-2 gap-px bg-[#E6DFD2] lg:grid-cols-4">
                    {stats.map((stat) => (
                        <article
                            key={stat.id}
                            className="relative flex min-h-[140px] flex-col items-center justify-center bg-[var(--background)] px-4 py-8 text-center sm:min-h-[155px]"
                        >
                            <strong
                                className={[
                                    "text-[26px] font-extrabold",
                                    "leading-none",
                                    "text-[var(--brand-primary-color)]",
                                    "sm:text-[30px]",
                                    "lg:text-[34px]",
                                ].join(" ")}
                            >
                                {stat.value}
                            </strong>

                            <p className="mt-3 text-[14px] font-bold text-[#303A54] sm:text-[14px]">
                                {stat.label}
                            </p>

                            {stat.description && (
                                <p className="mt-1 text-[9px] leading-5 text-[#777F90]">
                                    {stat.description}
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
