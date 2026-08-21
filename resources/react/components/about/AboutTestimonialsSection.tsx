import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import SlideArrow from "../SlideArrow";
import { useInfiniteCarousel, GAP } from "../../hooks/useInfiniteCarousel";

import type { IAboutTestimonialItem } from "../../interfaces/IAboutTestimonialsSectionProps";

interface IAboutTestimonialsSectionInternalProps {
  title?: string;
  testimonials: IAboutTestimonialItem[];
  className?: string;
}

export default function AboutTestimonialsSection({
  title,
  testimonials,
  className = "",
}: IAboutTestimonialsSectionInternalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const {
    track,
    containerRef,
    cardWidth,
    translateX,
    animated,
    canLoop,
    setIsPaused,
    next,
    prev,
    onTransitionEnd,
  } = useInfiniteCarousel({
    items: testimonials,
    isRTL,
  });

  if (!testimonials.length) {
    return null;
  }

  return (
    <section
      dir={i18n.dir()}
      className={`relative w-full overflow-hidden bg-[#20283A] py-14 sm:py-16 lg:py-20 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[22px] font-bold text-[var(--brand-primary-color)] sm:text-[28px] lg:text-[32px]">
            {title ?? t("aboutPage.testimonials.title")}
          </h2>

          {canLoop && (
            <div dir="ltr" className="flex items-center justify-center gap-4">
              <SlideArrow
                direction="prev"
                onClick={isRTL ? next : prev}
                className="h-10! w-10! rounded-[5px]! border-[var(--brand-primary-color)]! bg-transparent! text-[var(--brand-primary-color)]! shadow-none!"
              />
              <SlideArrow
                direction="next"
                onClick={isRTL ? prev : next}
                className="h-10! w-10! rounded-[5px]! border-[var(--brand-primary-color)]! bg-transparent! text-[var(--brand-primary-color)]! shadow-none!"
              />
            </div>
          )}
        </div>

        {/* Carousel */}
        <div ref={containerRef} className="w-full overflow-hidden px-6 sm:px-0">
          <div
            className="flex"
            style={{
              columnGap: `${GAP}px`,
              transform: `translateX(${translateX}px)`,
              transition: animated ? "transform 300ms ease-in-out" : "none",
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {track.map((testimonial, i) => (
              <div
                key={`${testimonial.id}-${i}`}
                dir={isRTL ? "rtl" : "ltr"}
                style={{ width: `${cardWidth}px`, flexShrink: 0 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: IAboutTestimonialItem;
}) {
  const rating = Math.min(Math.max(testimonial.rating ?? 5, 0), 5);

  return (
    <article className="flex min-h-[260px] flex-col bg-white px-5 py-6 sm:min-h-[300px] sm:px-7 sm:py-7">
      <div className="text-end text-[30px] font-serif leading-none text-[var(--brand-primary-color)] sm:text-[36px]">
        &ldquo;
      </div>

      <p className="mt-4 flex-1 text-start text-[13px] leading-7 text-[#20283A] sm:mt-5 sm:text-[14px] sm:leading-8">
        {testimonial.quote}
      </p>

      <div className="my-5 h-px w-full bg-[#E5E7EB]" />

      <div className="flex flex-col items-start gap-2">
        <div dir="ltr" className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={15}
              strokeWidth={1.5}
              className={
                index < rating
                  ? "fill-[var(--brand-primary-color)] text-[var(--brand-primary-color)]"
                  : "text-[#D1D5DB]"
              }
            />
          ))}
        </div>

        <p className="text-[13px] font-bold text-[#20283A]">
          {testimonial.customerName}
        </p>

        {testimonial.customerCar && (
          <p className="text-[11px] text-[var(--brand-primary-color)]">
            {testimonial.customerCar}
          </p>
        )}
      </div>
    </article>
  );
}
