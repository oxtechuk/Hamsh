import type { ITocItem } from "./ITocItem";

export interface IBlogTableOfContentsProps {
  items: ITocItem[];
  activeId: string;
  onClickItem: (id: string) => void;
}
