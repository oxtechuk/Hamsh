import type { IBlogArticleContentProps } from "../../interfaces/IBlogArticleContentProps";
import { useLanguageStore } from "../../store/language.store";

export default function BlogArticleContent({ content, contentItems }: IBlogArticleContentProps) {
  const direction = useLanguageStore((s) => s.direction);

  return (
    <div dir={direction} className="space-y-0">
      {content && (
        <p className="mb-6 text-[16px] leading-[1.9] text-[#7A7A7A]">
          {content}
        </p>
      )}

      {contentItems?.map((item, idx) => (
        <section key={idx} id={`heading-${idx}`}>
          <h2 className="mb-3 mt-8 text-[22px] font-extrabold text-[#111111]">
            {item.title}
          </h2>
          <p className="text-[16px] leading-[1.9] text-[#7A7A7A]">
            {item.content}
          </p>
        </section>
      ))}
    </div>
  );
}
