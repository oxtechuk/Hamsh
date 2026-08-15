import type { IBlogArticleContentProps } from "../../interfaces/IBlogArticleContentProps";
import { useLanguageStore } from "../../store/language.store";

export default function BlogArticleContent({
  content,
  contentItems,
}: IBlogArticleContentProps) {
  const direction = useLanguageStore(
    (state) => state.direction,
  );

  return (
    <article
      dir={direction}
      className="w-full"
    >
      {content && (
        <div
          className={[
            "text-start",
            "text-[15px]",
            "leading-[2.15]",
            "text-[#526078]",
            "sm:text-[16px]",
            "[&_p]:mb-6",
            "[&_strong]:font-bold",
            "[&_strong]:text-[#303A54]",
            "[&_a]:text-[var(--brand-primary-color)]",
            "[&_a]:underline",
          ].join(" ")}
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      )}

      {contentItems?.map(
        (item, index) => (
          <section
            key={`${item.title}-${index}`}
            id={`heading-${index}`}
            className="scroll-mt-[110px]"
          >
            <h2
              className={[
                "mb-4 mt-10",
                "text-start",
                "text-[20px] font-bold",
                "leading-[1.6]",
                "text-[#303A54]",
                "sm:text-[22px]",
              ].join(" ")}
            >
              {item.title}
            </h2>

            <div
              className={[
                "text-start",
                "text-[15px]",
                "leading-[2.15]",
                "text-[#526078]",
                "sm:text-[16px]",
                "[&_p]:mb-6",
                "[&_strong]:font-bold",
                "[&_strong]:text-[#303A54]",
                "[&_ul]:my-5",
                "[&_ul]:list-disc",
                "[&_ul]:ps-6",
                "[&_ol]:my-5",
                "[&_ol]:list-decimal",
                "[&_ol]:ps-6",
              ].join(" ")}
              dangerouslySetInnerHTML={{
                __html: item.content,
              }}
            />
          </section>
        ),
      )}
    </article>
  );
}