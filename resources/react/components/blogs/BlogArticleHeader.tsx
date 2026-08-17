import type { IBlogArticleHeaderProps } from "../../interfaces/IBlogArticleHeaderProps";
import LazyImg from "../LazyImg";

interface BlogArticleHeaderProps
  extends IBlogArticleHeaderProps {
  image: string;
  authorName?: string;
}

export default function BlogArticleHeader({
  category,
  title,
  image,
}: BlogArticleHeaderProps) {
  return (
    <header className="relative w-full overflow-hidden">
      <div className="relative min-h-[180px] w-full overflow-hidden sm:min-h-[220px] lg:min-h-[260px]">
        <LazyImg
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-black/20" />

        <div
          className={[
            "absolute inset-0",
            "bg-gradient-to-t",
            "from-[#1B2234]/90",
            "via-[#1B2234]/30",
            "to-black/5",
          ].join(" ")}
        />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
            {category && (
              <p className="text-start text-[12px] font-bold text-[var(--brand-primary-color)] sm:text-[13px]">
                {category}
              </p>
            )}

            <h1
              className={[
                "mt-4 max-w-[980px]",
                "text-start",
                "text-[34px] font-extrabold",
                "leading-[1.35] text-white",
                "sm:text-[46px]",
                "lg:text-[54px]",
              ].join(" ")}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}