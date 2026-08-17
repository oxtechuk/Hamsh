import { useTranslation } from "react-i18next";

import type { IBlogsPageHeroProps } from "../../interfaces/IBlogsPageHeroProps";
import { useLanguageStore } from "../../store/language.store";
import LazyImg from "../LazyImg";

export default function BlogsPageHero({
    badgeText,
    title,
    description,
    image,
    categories,
    activeCategory,
    onCategoryChange,
}: IBlogsPageHeroProps) {
    const { t } = useTranslation();

    const direction = useLanguageStore((state) => state.direction);

    return (
        <section
            dir={direction}
            className="relative flex min-h-[270px] w-full flex-col overflow-hidden bg-[#1A1F2E] text-white"
        >
            <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 sm:px-8 lg:px-12 xl:px-[70px]">
                {/* Hero content */}
                <div className="flex flex-1 items-center">
                    <div className="max-w-[620px] text-start">
                        {/* Eyebrow */}
                        <p className="text-[13px] font-medium text-[var(--brand-primary-color)]">
                            {badgeText || t("blogPage.hero.badge")}
                        </p>

                        {/* Title */}
                        <h1
                            className={[
                                "mt-5",
                                "text-[34px] font-extrabold",
                                "leading-[1.2] text-white",
                                "sm:text-[42px]",
                                "lg:text-[48px]",
                            ].join(" ")}
                            dangerouslySetInnerHTML={{
                                __html: title,
                            }}
                        />

                        {/* Description */}
                        {description && (
                            <p className="mt-5 max-w-[560px] text-[15px] leading-8 text-white/60 sm:text-[16px]">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/[0.10]" />

                {/* Categories */}
                {categories && categories.length > 0 && (
                    <div className="flex shrink-0 items-center justify-start overflow-x-auto">
                        {categories.map((category) => {
                            const isActive = category.value === activeCategory;

                            return (
                                <button
                                    key={category.value}
                                    type="button"
                                    onClick={() =>
                                        onCategoryChange?.(category.value)
                                    }
                                    className={[
                                        "relative flex h-[64px]",
                                        "shrink-0 items-center justify-center",
                                        "px-6",
                                        "text-[14px] font-medium",
                                        "transition duration-300",
                                        isActive
                                            ? "text-[var(--brand-primary-color)]"
                                            : "text-white/45 hover:text-white/75",
                                    ].join(" ")}
                                >
                                    {category.label}

                                    {isActive && (
                                        <span
                                            className={[
                                                "absolute bottom-0 start-1/2",
                                                "h-[2px] w-[58px]",
                                                "-translate-x-1/2",
                                                "bg-[var(--brand-primary-color)]",
                                            ].join(" ")}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
