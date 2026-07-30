import { useTranslation } from "react-i18next";
import type { IBlogTableOfContentsProps } from "../../interfaces/IBlogTableOfContentsProps";
import type { ITocItem } from "../../interfaces/ITocItem";

export type { ITocItem };

export default function BlogTableOfContents({
  items,
  activeId,
  onClickItem,
}: IBlogTableOfContentsProps) {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  return (
    <div className="rounded-[14px] border border-[#ECECEC] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[15px] font-extrabold text-[#111111]">
        {t("blogPage.sidebar.tableOfContents")}
      </h3>
      <ol className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onClickItem(item.id)}
              className={[
                "flex w-full items-center gap-3 text-start text-[13px] transition",
                "font-bold text-[#C5232B] underline decoration-2 underline-offset-4 ",
              ].join(" ")}
            >
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#EFEFEF] text-[11px] text-[#7A7A7A]">
                {item.index}
              </span>
              <span className="flex-1 text-start text-[#7A7A7A]">
                {item.text}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
