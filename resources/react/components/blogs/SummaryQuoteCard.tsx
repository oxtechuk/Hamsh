interface SummaryQuoteCardProps {
  summary: string;
}

export default function SummaryQuoteCard({
  summary,
}: SummaryQuoteCardProps) {
  return (
    <blockquote
      className={[
        "relative bg-white",
        "px-7 py-7",
        "sm:px-10 sm:py-8",
        "border-e-[4px]",
        "border-[var(--brand-primary-color)]",
      ].join(" ")}
    >
      <p className="text-start text-[22px] font-extrabold leading-[1.6] text-[#20283A] sm:text-[26px]">
        “{summary}”
      </p>
    </blockquote>
  );
}