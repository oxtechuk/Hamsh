import { useTranslation } from "react-i18next";

import { APP_IMAGES } from "../constants/app-images";
import type { IRiyalLabelProps } from "../interfaces/IRiyalLabelProps";

export default function RiyalLabel({ text }: IRiyalLabelProps) {
  const { t } = useTranslation();

  return (
    <span className="inline-flex items-center gap-1">
      <span>{text}</span>
      <span
        aria-label={t("common.riyal")}
        className="inline-block h-[13px] w-[13px] shrink-0"
        style={{
          backgroundColor: "currentColor",
          WebkitMask: `url(${APP_IMAGES.RIYAL}) center / contain no-repeat`,
          mask: `url(${APP_IMAGES.RIYAL}) center / contain no-repeat`,
        }}
      />
    </span>
  );
}
