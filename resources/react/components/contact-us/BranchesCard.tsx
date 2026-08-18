import { useTranslation } from "react-i18next";
import type { IBranchesCardProps } from "../../interfaces/IBranchesCardProps";

export default function BranchesCard({ branches }: IBranchesCardProps) {
  const { t } = useTranslation();

  return (
    <section className="bg-white px-7 py-7">
      <h2 className="text-start text-[22px] font-extrabold text-[#20283A]">
        {t("contactPage.branches.title")}
      </h2>

      <div className="mt-5 divide-y divide-[#E8E2D7]">
        {branches.slice(0, 3).map((branch) => (
          <div
            key={branch.id}
            className="py-4 text-start first:pt-0 last:pb-0"
          >
            <h3 className="text-[14px] font-bold text-[#303A54]">
              {branch.city}
            </h3>

            <p className="mt-1 text-[11px] leading-5 text-[#71798A]">
              {branch.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
