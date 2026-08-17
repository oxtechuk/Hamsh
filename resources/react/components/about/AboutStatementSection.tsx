import type { IAboutStatementSectionProps } from "../../interfaces/IAboutStatementSectionProps";

export default function AboutStatementSection({
    quote,
}: IAboutStatementSectionProps) {
    return (
        <section className="w-full bg-[#1A1F2E] py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                <div className="flex min-h-[150px] items-center justify-center text-center sm:min-h-[150px]">
                    <blockquote className="max-w-[820px]">
                        <p
                            className={[
                                "text-[18px] font-medium",
                                "leading-[1.8]",
                                "text-[var(--brand-primary-color)]",
                                "sm:text-[22px]",
                                "lg:text-[29px]",
                            ].join(" ")}
                        >
                            &ldquo;{quote}&rdquo;
                        </p>
                    </blockquote>
                </div>
            </div>
        </section>
    );
}
