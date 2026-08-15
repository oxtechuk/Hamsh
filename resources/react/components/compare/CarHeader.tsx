import { useTranslation } from "react-i18next";

import type { ICarHeaderProps } from "../../interfaces/ICarHeaderProps";

export default function CarHeader({ label, name, className = "" }: ICarHeaderProps) {
  const { i18n } = useTranslation();

  return (
    <div
      dir={i18n.dir()}
      className={[
        "flex flex-col items-center justify-center",
        "bg-white px-5 py-4 text-center",
        className,
      ].join(" ")}
    >
      <span className="text-[13px] font-medium text-[#8A94A6]">{label}</span>

      <strong
        title={name}
        className="mt-1 max-w-full truncate text-[15px] font-extrabold text-[#080808]"
      >
        {name}
      </strong>
    </div>
  );
}
