import type { ICompareSpecProps } from "../../interfaces/ICompareSpecProps";

export default function CompareSpec({
    value,
    label,
    highlighted = false,
}: ICompareSpecProps) {
    return (
        <div
            className={[
                "flex min-h-[52px]",
                "flex-col items-center justify-center",
                "px-2 text-center",
                "border-s border-[#E8E3DA]",
                "first:border-s-0",
            ].join(" ")}
        >
            <span
                className={[
                    "text-[16px] font-extrabold leading-none",
                    highlighted
                        ? "text-[var(--brand-primary-color)]"
                        : "text-[var(--brand-secondary-color)]",
                ].join(" ")}
            >
                {value}
            </span>

            <span className="mt-0.5 text-[10px] text-[#747B89]">{label}</span>
        </div>
    );
}
