import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect, useCallback } from "react";
import SlideArrow from "./SlideArrow";
import type {
  IAboutTestimonialItem,
  IAboutTestimonialsSectionProps,
} from "../interfaces/IAboutTestimonialsSectionProps";

const GAP = 24;
const VISIBLE_LG = 3;
const VISIBLE_MD = 2;
const VISIBLE_SM = 1;

function getVisible() {
  if (typeof window === "undefined") return VISIBLE_SM;
  if (window.innerWidth >= 1024) return VISIBLE_LG;
  if (window.innerWidth >= 640) return VISIBLE_MD;
  return VISIBLE_SM;
}

export default function AboutTestimonialsSection({
  eyebrow,
  title,
  testimonials,
  className = "",
}: IAboutTestimonialsSectionProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const resolvedEyebrow = eyebrow ?? t("aboutPage.testimonials.badge");
  const resolvedTitle = title ?? t("aboutPage.testimonials.title");

  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(getVisible);
  const [cardWidth, setCardWidth] = useState(0);
  const [realIdx, setRealIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const n = testimonials.length;

  useEffect(() => {
    const measure = () => {
      const vis = getVisible();
      setVisible(vis);
      const el = containerRef.current;
      if (el) setCardWidth(Math.floor((el.offsetWidth - GAP * (vis - 1)) / vis));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => { setRealIdx(0); }, [n]);

  const next = useCallback(() => setRealIdx((p) => (p + 1) % n), [n]);
  const prev = useCallback(() => setRealIdx((p) => (p - 1 + n) % n), [n]);

  useEffect(() => {
    if (paused || n <= visible) return;
    const id = setInterval(() => (isRTL ? prev : next)(), 4000);
    return () => clearInterval(id);
  }, [paused, n, visible, next, prev, isRTL]);

  useEffect(() => {
    const handle = () => setPaused(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, []);

  if (!n) return null;

  const visibleItems: IAboutTestimonialItem[] = Array.from(
    { length: visible },
    (_, i) => testimonials[(realIdx + i) % n],
  );

  return (
    <section
      dir={i18n.dir()}
      className={["relative w-full bg-[#0a0a0a] py-16 text-white overflow-hidden", className].join(" ")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 text-center">
          {resolvedEyebrow && (
            <p className="mb-3 text-[13px] font-semibold tracking-wide text-[#C5232B]">
              {resolvedEyebrow}
            </p>
          )}
          <h2 className="text-[42px] font-extrabold leading-tight text-white sm:text-[52px]">
            {resolvedTitle}
          </h2>
        </div>

        {/* Cards */}
        <div ref={containerRef} className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ gap: GAP }}>
            {visibleItems.map((item, i) => (
              <div
                key={`${item.id}-${realIdx}-${i}`}
                style={{ minWidth: cardWidth > 0 ? cardWidth : undefined, flex: cardWidth > 0 ? "none" : "1" }}
              >
                <TestimonialCard testimonial={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators — mobile only */}
        {n > 1 && visible === 1 && (
          <div dir="ltr" className="mt-6 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRealIdx(i)}
                className={[
                  "h-2 rounded-full transition-all duration-300",
                  i === realIdx ? "w-6 bg-[#C5232B]" : "w-2 bg-white/30",
                ].join(" ")}
              />
            ))}
          </div>
        )}

        {/* Arrows */}
        {n > visible && (
          <div dir="ltr" className="mt-8 flex items-center justify-center gap-4">
            <SlideArrow
              direction="prev"
              onClick={isRTL ? next : prev}
              className="h-10! w-10! rounded-[5px]! border-[var(--brand-secondary-color)]! bg-transparent! text-[var(--brand-secondary-color)]! shadow-none!"
            />
            <SlideArrow
              direction="next"
              onClick={isRTL ? prev : next}
              className="h-10! w-10! rounded-[5px]! border-[var(--brand-secondary-color)]! bg-transparent! text-[var(--brand-secondary-color)]! shadow-none!"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: IAboutTestimonialItem }) {
  const { i18n } = useTranslation();
  const rating = Math.min(5, Math.max(0, testimonial.rating ?? 5));

  return (
    <article className="flex h-full min-h-[190px] flex-col rounded-[12px] bg-white/[0.04] px-5 py-5">
      <div className="flex justify-start">
        <Quote size={28} strokeWidth={1.8} className="text-[#B42225]" />
      </div>
      <blockquote className="mt-3 flex-1 text-[13px] leading-7 text-white/70 text-start">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0 text-start">
          <h3 className="truncate text-[15px] font-bold text-white">{testimonial.customerName}</h3>
          {testimonial.customerCar && (
            <p className="mt-0.5 truncate text-[11px] text-white/40">{testimonial.customerCar}</p>
          )}
        </div>
        <div dir="ltr" className="flex shrink-0 items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className={["text-[15px] leading-none", index < rating ? "text-[#FFB400]" : "text-white/15"].join(" ")}>
              ★
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
