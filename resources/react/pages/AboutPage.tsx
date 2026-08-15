import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { useLanguageStore } from "../store/language.store";
import { useSEO } from "../utils/useSEO";
import { getAboutPageData } from "../services/api";

import type { IAboutData } from "../interfaces/IAboutData";
import AboutVisionSection from "../components/about/AboutVisionSection";
import AboutValuesSection from "../components/about/AboutValuesSection";
import AboutTestimonialsSection from "../components/about/AboutTestimonialsSection";

interface AboutStatViewModel {
    id: string | number;
    value: string;
    label: string;
    description: string;
}

interface AboutTestimonialViewModel {
    id: string | number;
    quote: string;
    customerName: string;
    customerCar?: string;
    rating?: number;
}

interface AboutCoreValueViewModel {
    id: string | number;
    title: string;
    description: string;
    icon?: "belonging" | "excellence" | "transparency";
}

const STATIC_STATS: AboutStatViewModel[] = [
    {
        id: 1,
        value: "+12",
        label: "سنة خبرة",
        description: "في السوق السعودي",
    },
    {
        id: 2,
        value: "+5000",
        label: "عميل راضٍ",
        description: "من جميع أنحاء المملكة",
    },
    {
        id: 3,
        value: "+24",
        label: "علامة تجارية",
        description: "خيارات استثنائية",
    },
    {
        id: 4,
        value: "98%",
        label: "رضاء عملائنا",
        description: "تجربة مميزة معنا",
    },
];

const STATIC_TESTIMONIALS: AboutTestimonialViewModel[] = [
    {
        id: 1,
        quote: "أفضل تجربة شراء سيارات على الإطلاق. الفريق كان محترفاً وساعدني في اختيار السيارة المثالية بكل صدق.",
        customerName: "محمد العتيبي",
        customerCar: "تويوتا هايلكس",
        rating: 5,
    },
    {
        id: 2,
        quote: "عملية سلسة من البداية إلى النهاية، وسعر عادل مقارنة بالسوق. أنصح أي شخص يبحث عن الموثوقية بالتعامل معهم.",
        customerName: "خالد الشمري",
        customerCar: "نيسان باترول",
        rating: 5,
    },
    {
        id: 3,
        quote: "التزامهم بالوعود وشفافيتهم في التفاصيل جعلتني عميلاً دائماً. تجربة تستحق أن تُروى.",
        customerName: "عبدالله القحطاني",
        customerCar: "لكزس ES",
        rating: 5,
    },
];

const STATIC_CORE_VALUES: AboutCoreValueViewModel[] = [
    {
        id: 1,
        title: "الاهتمام",
        description: "نمنح كل عميل اهتماماً كاملاً من أول اتصال حتى ما بعد التسليم.",
        icon: "belonging",
    },
    {
        id: 2,
        title: "السرعة",
        description: "نجهّز طلبك ونسلّمه في أسرع وقت ممكن دون التنازل عن الجودة.",
        icon: "excellence",
    },
    {
        id: 3,
        title: "الجودة",
        description: "نلتزم بأعلى معايير الجودة في كل مرحلة، من الفحص حتى التسليم.",
        icon: "transparency",
    },
    {
        id: 4,
        title: "ثقة",
        description: "نبني علاقة دائمة مع عملائنا تقوم على الثقة والصدق.",
    },
];

export default function AboutPage() {
    const { t } = useTranslation();

    const language = useLanguageStore((state) => state.language);

    const direction = useLanguageStore((state) => state.direction);

    useSEO(t("nav.about"), t("aboutPage.hero.description"));

    const { data: aboutData } = useQuery<IAboutData>({
        queryKey: ["about", language],
        queryFn: getAboutPageData,
    });

    const stats = useMemo<AboutStatViewModel[]>(() => {
        const apiStats = aboutData?.about_stats ?? [];

        if (!apiStats.length) {
            return STATIC_STATS;
        }

        return apiStats.slice(0, 4).map((stat, index) => ({
            id: index + 1,
            value: stat.value,
            label: stat.label,
            description: STATIC_STATS[index]?.description ?? "",
        }));
    }, [aboutData]);

    const testimonials = useMemo<AboutTestimonialViewModel[]>(() => {
        const apiTestimonials = aboutData?.testimonials ?? [];

        if (!apiTestimonials.length) {
            return STATIC_TESTIMONIALS;
        }

        return apiTestimonials.slice(0, 3).map((item) => ({
            id: item.id,
            quote: item.content,
            customerName: item.name,
            customerCar: item.job_title,
            rating: item.rating,
        }));
    }, [aboutData]);

    const coreValues = useMemo<AboutCoreValueViewModel[]>(() => {
        const apiItems = aboutData?.core_values?.items ?? [];

        if (!apiItems.length) {
            return STATIC_CORE_VALUES;
        }

        return apiItems.slice(0, 3).map((item, index) => ({
            id: item.title || index,
            title: item.title,
            description: item.description || STATIC_CORE_VALUES[index]?.description || "",
        }));
    }, [aboutData]);

    const quote =
        aboutData?.hero?.subtitle ||
        t(
            "aboutPage.statement",
            "نؤمن بأن اقتناء سيارتك المثالية ينبغي أن يكون تجربة تُروى، لا مجرد صفقة تُبرم",
        );

    return (
        <main dir={direction} className="w-full bg-[var(--background)]">
            <AboutStatementSection quote={quote} />

            <AboutStatsSection stats={stats} />

            <AboutVisionSection
                image="/images/about_vision.png"
                eyebrow="رؤيتنا"
                titleLine1="أكثر من وكالة."
                titleHighlight="وجهة"
                titleLine2="لعشاق السيارات."
                description="منذ تأسيسنا عام 2014، انطلقنا بهدف واحد: تقديم تجربة سيارات تستحق أن تُذكر. اليوم، نفخر بخدمة آلاف العملاء في المملكة بمعايير تفوق التوقعات."
            />

            <AboutTestimonialsSection
                title={t("aboutPage.testimonials.title", "يتحدثون عن تجربتهم")}
                testimonials={testimonials}
            />

            <AboutValuesSection values={coreValues} />
        </main>
    );
}

/* -------------------------------------------------------------------------- */
/* Statement                                                                  */
/* -------------------------------------------------------------------------- */

interface AboutStatementSectionProps {
    quote: string;
}

function AboutStatementSection({ quote }: AboutStatementSectionProps) {
    return (
        <section className="w-full bg-[var(--brand-secondary-color)]">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                <div
                    className={[
                        "flex min-h-[205px]",
                        "items-center justify-center",
                        "py-12 text-center",
                        "sm:min-h-[230px]",
                    ].join(" ")}
                >
                    <blockquote className="max-w-[820px]">
                        <p
                            className={[
                                "text-[22px] font-medium",
                                "leading-[1.8]",
                                "text-[var(--brand-primary-color)]",
                                "sm:text-[26px]",
                                "lg:text-[29px]",
                            ].join(" ")}
                        >
                            “{quote}”
                        </p>
                    </blockquote>
                </div>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/* Stats                                                                      */
/* -------------------------------------------------------------------------- */

interface AboutStatsSectionProps {
    stats: AboutStatViewModel[];
}

function AboutStatsSection({ stats }: AboutStatsSectionProps) {
    if (!stats.length) {
        return null;
    }

    return (
        <section className="w-full bg-[var(--background)]">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                <div className="grid grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <article
                            key={stat.id}
                            className={[
                                "relative flex min-h-[155px]",
                                "flex-col items-center justify-center",
                                "px-4 py-8 text-center",
                                index > 0
                                    ? "lg:border-s lg:border-[#E6DFD2]"
                                    : "",
                                index % 2 !== 0
                                    ? "max-lg:border-s max-lg:border-[#E6DFD2]"
                                    : "",
                                index >= 2
                                    ? "max-lg:border-t max-lg:border-[#E6DFD2]"
                                    : "",
                            ].join(" ")}
                        >
                            <strong
                                className={[
                                    "text-[30px] font-extrabold",
                                    "leading-none",
                                    "text-[var(--brand-primary-color)]",
                                    "sm:text-[34px]",
                                ].join(" ")}
                            >
                                {stat.value}
                            </strong>

                            <p className="mt-3 text-[12px] font-bold text-[#303A54]">
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
