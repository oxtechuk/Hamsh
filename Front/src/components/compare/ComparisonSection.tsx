import type { IComparisonSectionProps } from "../../interfaces/IComparisonSectionProps";
import CarHeader from "./CarHeader";
import ComparisonValue from "./ComparisonValue";

export default function ComparisonSection({
  title,
  rows,
  car1Name,
  car2Name,
  carOneLabel,
  carTwoLabel,
}: IComparisonSectionProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div
        className={[
          "min-w-[760px] overflow-hidden",
          "rounded-[20px] border border-[#E2E5E9]",
          "bg-white",
          "shadow-[0_2px_8px_rgba(15,23,42,0.025)]",
        ].join(" ")}
      >
        {/* Header */}
        <div className="grid min-h-[86px] grid-cols-[1.05fr_1fr_1fr] border-b border-[#E4E7EB]">
          {/* Section name */}
          <div className="flex items-center justify-center bg-[#FAFAFA] px-5 text-center">
            <h3 className="text-[15px] font-extrabold text-[#111111]">
              {title}
            </h3>
          </div>

          {/* First car */}
          <CarHeader
            label={carOneLabel}
            name={car1Name}
            className="border-s border-[#E4E7EB]"
          />

          {/* Second car */}
          <CarHeader
            label={carTwoLabel}
            name={car2Name}
            className="border-s border-[#E4E7EB]"
          />
        </div>

        {/* Rows */}
        {rows.map((row, rowIndex) => {
          const car1Winner = row.winner === 1;
          const car2Winner = row.winner === 2;

          return (
            <div
              key={`${row.label}-${rowIndex}`}
              className={[
                "grid min-h-[65px] grid-cols-[1.05fr_1fr_1fr]",
                rowIndex !== rows.length - 1 ? "border-b border-[#E4E7EB]" : "",
              ].join(" ")}
            >
              {/* Attribute label */}
              <div className="flex items-center justify-center bg-white px-5 text-center">
                <span className="text-[16px] font-medium text-[#69758A]">
                  {row.label}
                </span>
              </div>

              {/* First car value */}
              <ComparisonValue
                value={row.val1}
                isWinner={car1Winner}
                className="border-s border-[#E4E7EB]"
              />

              {/* Second car value */}
              <ComparisonValue
                value={row.val2}
                isWinner={car2Winner}
                className="border-s border-[#E4E7EB]"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
