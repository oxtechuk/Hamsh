import type { ISpecItemProps } from "../interfaces/ISpecItemProps";

export function SpecItem({ icon, label }: ISpecItemProps) {
  return (
    <span className="flex min-w-0 items-center gap-1.5 text-[13px]">
      <span className="shrink-0 text-[#737373]">{icon}</span>
      <span className="max-w-[92px] truncate">{label}</span>
    </span>
  );
}
