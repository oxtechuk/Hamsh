import { useState } from "react";
import { MapPin, Phone, Clock3, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IContactMapProps, IContactMapBranch } from "../interfaces/IContactMapProps";

export type { IContactMapBranch };

export default function ContactMap({ branches, className = "" }: IContactMapProps) {
  const { i18n } = useTranslation();
  const [activeId, setActiveId] = useState<string | number>(branches[0]?.id ?? 0);

  const activeBranch = branches.find((b) => b.id === activeId) ?? branches[0];

  const embedSrc = activeBranch?.mapUrl
    ? activeBranch.mapUrl.replace(
        /https:\/\/maps\.google\.com\/\?q=([\d.]+),([\d.]+)/,
        "https://maps.google.com/maps?q=$1,$2&z=15&output=embed",
      )
    : null;

  return (
    <div dir={i18n.dir()} className={className}>
      {/* Map iframe */}
      <div className="overflow-hidden rounded-[16px] border border-[#E8E8E8] bg-[#f0ede8]">
        {embedSrc ? (
          <iframe
            key={embedSrc}
            src={embedSrc}
            title="branch-map"
            className="h-[240px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <MapFallback />
        )}
      </div>

      {/* Branch cards */}
      {branches.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              active={branch.id === activeId}
              onClick={() => setActiveId(branch.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MapFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex h-[240px] w-full items-center justify-center text-[#999]">
      {t("contactPage.contactUs.noMap", "—")}
    </div>
  );
}

function BranchCard({
  branch,
  active,
  onClick,
}: {
  branch: IContactMapBranch;
  active: boolean;
  onClick: () => void;
}) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-[16px] border p-5",
        isRtl ? "text-right" : "text-left",
        "shadow-[0_2px_10px_rgba(15,23,42,.04)]",
        "transition-all duration-200 cursor-pointer",
        active
          ? "border-[#C5232B] bg-white ring-2 ring-[#C5232B]/15"
          : "border-[#ECECEC] bg-white hover:border-[#C5232B]/40",
      ].join(" ")}
    >
      <h3 className="mb-4 text-[20px] font-extrabold text-[#111111]">
        {branch.city}
      </h3>

      <div className="space-y-3">
        <InfoRow icon={<MapPin size={15} />} value={branch.address} />
        <InfoRow icon={<Phone size={15} />} value={branch.phone} ltr />
        <InfoRow icon={<Clock3 size={15} />} value={branch.workingHours} />
      </div>

      {branch.mapUrl && (
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 flex items-center gap-1 text-[12px] text-[#C5232B] hover:underline"
        >
          <ExternalLink size={12} />
          {t("contactPage.contactUs.openMap")}
        </a>
      )}
    </button>
  );
}

function InfoRow({
  icon,
  value,
  ltr,
}: {
  icon: React.ReactNode;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 text-start`}>
      <span className="shrink-0 text-[#C5232B]">{icon}</span>
      <span className="text-[13px] text-[#666666]" dir={ltr ? "ltr" : undefined}>
        {value}
      </span>
    </div>
  );
}
