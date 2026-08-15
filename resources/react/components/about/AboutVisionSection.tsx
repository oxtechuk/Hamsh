import { useTranslation } from "react-i18next";

interface AboutVisionSectionProps {
    eyebrow?: string;
    titleLine1?: string;
    titleHighlight?: string;
    titleLine2?: string;
    description?: string;
    image?: string;
    className?: string;
}

export default function AboutVisionSection({
    eyebrow = "رؤيتنا",
    titleLine1 = "أكثر من وكالة.",
    titleHighlight = "وجهة",
    titleLine2 = "لعشاق السيارات.",
    description = "منذ تأسيسنا عام 2014، انطلقنا بهدف واحد: تقديم تجربة سيارات تستحق أن تُذكر. اليوم، نفخر بخدمة آلاف العملاء في المملكة بمعايير تفوق التوقعات.",
    image = "/images/about_vision.png",
    className = "",
}: AboutVisionSectionProps) {
    const { i18n } = useTranslation();

    return (
        <section
            dir={i18n.dir()}
            className={`w-full bg-[var(--background)] ${className}`}
        >
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div
                    className={[
                        "grid grid-cols-1",
                        "overflow-hidden bg-white",
                        "lg:grid-cols-2",
                        "lg:min-h-[420px]",
                    ].join(" ")}
                >
                    {/* Image */}
                    <div className="relative min-h-[320px] overflow-hidden sm:min-h-[390px] lg:min-h-full">
                        <img
                            src={image}
                            alt={titleLine1}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div
                        className={[
                            "flex flex-col justify-center",
                            "px-7 py-12",
                            "sm:px-10",
                            "lg:px-16 lg:py-16",
                        ].join(" ")}
                    >
                        <div className="max-w-[520px] text-start">
                            <p className="text-[12px] font-semibold text-[var(--brand-primary-color)] sm:text-[13px]">
                                {eyebrow}
                            </p>

                            <h2
                                className={[
                                    "mt-5",
                                    "text-[30px] font-extrabold",
                                    "leading-[1.45]",
                                    "text-[var(--brand-secondary-color)]",
                                    "sm:text-[36px]",
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
                </div>
            </div>
        </section>
    );
}
