import { Clock3 } from "lucide-react";
import { NavLink } from "react-router-dom";

import type { IBlogCardProps } from "../../interfaces/IBlogCardProps";
import { useLanguageStore } from "../../store/language.store";
import LazyImg from "../LazyImg";

export default function BlogCard({
  image,
  category,
  date,
  readTime,
  title,
  readMoreTo,
}: IBlogCardProps) {
  const direction = useLanguageStore((state) => state.direction);

  return (
    <NavLink
      to={readMoreTo}
      dir={direction}
      className={[
        "group block w-full",
        "transition duration-300",
        "hover:-translate-y-1",
      ].join(" ")}
    >
      {/* Image */}
      <div
        className={[
          "relative w-full overflow-hidden",
          "rounded-[12px] bg-[#E8E8E8]",
          "aspect-[1.54/1]",
        ].join(" ")}
      >
        <LazyImg
          src={image}
          alt={title}
          className={[
            "h-full w-full object-cover",
            "transition-transform duration-700 ease-out",
            "group-hover:scale-[1.025]",
          ].join(" ")}
        />

        {/* Category badge */}
        {category && (
          <span
            className={[
              "absolute top-5 z-10",
              "start-5",
              "inline-flex min-h-[30px] items-center justify-center",
              "rounded-[6px] bg-[var(--brand-secondary-color)] px-2",
              "text-[13px] text-white font-semibold",
              "shadow-[0_8px_20px_rgba(0,0,0,0.12)]",
            ].join(" ")}
          >
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-1 pt-3">
        <div
          className={[
            "flex flex-wrap items-center gap-x-4 gap-y-2",
            "text-[14px] text-[#858585]",
          ].join(" ")}
        >
          {date && <span>{date}</span>}

          {date && readTime && (
            <span className="h-1 w-1 rounded-full bg-[#9A9A9A]" />
          )}

          {readTime && (
            <span className="flex items-center gap-2">
              <Clock3 size={16} strokeWidth={1.7} />
              {readTime}
            </span>
          )}
        </div>

        <h3
          title={title}
          className={[
            "mt-3 line-clamp-2 text-start",
            "text-[16px] font-bold leading-[1.45]",
            "text-[#080808]",
            "sm:text-[16px]",
          ].join(" ")}
        >
          {title}
        </h3>
      </div>
    </NavLink>
  );
}
