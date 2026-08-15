import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TestimonialItem {
  id: string | number;
  quote: string;
  customerName: string;
  customerCar?: string;
  rating?: number;
}

interface AboutTestimonialsSectionProps {
  title?: string;
  testimonials: TestimonialItem[];
  className?: string;
}

export default function AboutTestimonialsSection({
  title = "يتحدثون عن تجربتهم",
  testimonials,
  className = "",
}: AboutTestimonialsSectionProps) {
  const { i18n } = useTranslation();

  if (!testimonials.length) {
    return null;
  }

  return (
    <section
      dir={i18n.dir()}
      className={[
        "w-full bg-[var(--brand-secondary-color)]",
        "py-14 sm:py-16 lg:py-20",
        className,
      ].join(" ")}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-[26px] font-extrabold text-[var(--brand-primary-color)] sm:text-[30px]">
          {title}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: TestimonialItem;
}) {
  const rating = Math.min(
    Math.max(testimonial.rating ?? 5, 0),
    5,
  );

  return (
    <article
      className={[
        "flex min-h-[250px] flex-col",
        "bg-white px-7 py-7",
        "shadow-[0_6px_20px_rgba(0,0,0,0.04)]",
      ].join(" ")}
    >
      {/* Quote mark */}
      <div className="text-start text-[40px] font-serif leading-none text-[var(--brand-primary-color)]/35">
        ”
      </div>

      {/* Quote */}
      <p className="mt-5 flex-1 text-start text-[14px] leading-8 text-[#303A54]">
        {testimonial.quote}
      </p>

      <div className="mt-6 h-px w-full bg-[#EAE5DC]" />

      {/* Footer */}
      <div className="mt-5 flex items-end justify-between gap-4">
        <div className="text-start">
          <p className="text-[13px] font-bold text-[#303A54]">
            {testimonial.customerName}
          </p>

          {testimonial.customerCar && (
            <p className="mt-1 text-[11px] text-[var(--brand-primary-color)]">
              {testimonial.customerCar}
            </p>
          )}
        </div>

        <div dir="ltr" className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={13}
              strokeWidth={1.5}
              className={
                index < rating
                  ? "fill-[var(--brand-primary-color)] text-[var(--brand-primary-color)]"
                  : "text-[#D8D5CE]"
              }
            />
          ))}
        </div>
      </div>
    </article>
  );
}