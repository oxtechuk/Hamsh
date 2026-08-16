import type { IComparisonSectionProps } from "../../interfaces/IComparisonSectionProps";

interface ComparisonSectionProps extends IComparisonSectionProps {
  hideHeader?: boolean;
}

export default function ComparisonSection({
  title,
  rows,
  car1Name,
  car2Name,
  carOneLabel,
  carTwoLabel,
  hideHeader = false,
}: ComparisonSectionProps) {
  return (
    <div className="w-full">
      {/* Optional section heading */}
      {!hideHeader && title && (
        <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-[#E8E3D9] bg-white">
          {/* Property title */}
          <div className="flex min-h-[62px] items-center justify-start border-s border-[#E8E3D9] px-6 text-start">
            <span className="text-[14px] font-bold text-[#303A54]">
              {title}
            </span>
          </div>

          {/* Car 1 */}
          <div className="flex min-h-[62px] flex-col items-center justify-center border-s border-[#E8E3D9] px-4 text-center">
            <span className="text-[11px] text-[#8B8E98]">
              {carOneLabel}
            </span>

            <strong className="mt-1 line-clamp-1 text-[13px] font-bold text-[#161B29]">
              {car1Name}
            </strong>
          </div>

          {/* Car 2 */}
          <div className="flex min-h-[62px] flex-col items-center justify-center px-4 text-center">
            <span className="text-[11px] text-[#8B8E98]">
              {carTwoLabel}
            </span>

            <strong className="mt-1 line-clamp-1 text-[13px] font-bold text-[#161B29]">
              {car2Name}
            </strong>
          </div>
        </div>
      )}

      {/* Rows */}
      {rows.map((row, index) => {
        const alternate = index % 2 === 1;

        return (
          <div
            key={`${row.label}-${index}`}
            className={[
              "grid grid-cols-[1fr_1fr_1fr]",
              "border-b border-[#F5F2EC]",
              "last:border-b-0",
              alternate
                ? "bg-[#F5F2EC]"
                : "bg-white",
            ].join(" ")}
          >
            {/* Label */}
            <div
              className={[
                "flex min-h-[66px]",
                "items-center justify-start",
                "border-s border-[#E8E3D9]",
                "px-6 text-start",
              ].join(" ")}
            >
              <span className="text-[13px] font-medium text-[#303A54]">
                {row.label}
              </span>
            </div>

            {/* Car 1 */}
            <ValueCell value={row.val1} />

            {/* Car 2 */}
            <ValueCell value={row.val2} />
          </div>
        );
      })}
    </div>
  );
}

function ValueCell({
  value,
}: {
  value: string | number | null | undefined;
}) {
  return (
    <div
      className={[
        "flex min-h-[66px]",
        "items-center justify-center",
        "border-s border-[#E8E3D9]",
        "px-4 text-center",
      ].join(" ")}
    >
      <span className="text-[13px] font-bold text-[#22283A]">
        {value ?? "—"}
      </span>
    </div>
  );
}