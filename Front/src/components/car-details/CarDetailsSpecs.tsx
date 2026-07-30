import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, Fuel, Gauge, Settings2, ShieldCheck, Tag, Zap } from "lucide-react";
import type { IFeatureItem, ISpecItem, ITab } from "../../interfaces/ICarDetailsSpecsProps";
import type { ICarDetailsSpecsCardProps } from "../../interfaces/ICarDetailsSpecsCardProps";
import { localize } from "../../utils/localize";

export type {
  ISpecItem as SpecItem,
  ITab as Tab,
};

interface CarDetailsSpecsProps {
  tabs: ITab[];
  embedded?: boolean;
  className?: string;
}

export default function CarDetailsSpecs({
  tabs,
  embedded = false,
  className = "",
}: CarDetailsSpecsProps) {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs.length) {
    return null;
  }

  const safeActiveTab =
    activeTab >= tabs.length ? 0 : activeTab;

  const currentTab = tabs[safeActiveTab];

  const content = (
    <div
      className={[
        "overflow-hidden rounded-[8px]",
        "border border-[#ECECEC] bg-white",
        "shadow-[0_3px_14px_rgba(15,23,42,0.04)]",
      ].join(" ")}
    >
      {/* Tabs */}
      <div className="border-b border-[#EEEEEE] px-5 sm:px-6">
        <div className="flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab, index) => {
            const isActive = index === safeActiveTab;

            return (
              <button
                key={`${tab.label}-${index}`}
                type="button"
                onClick={() => setActiveTab(index)}
                className={[
                  "relative shrink-0 py-4",
                  "text-[14px] font-bold",
                  "transition-colors duration-300",
                  isActive
                    ? "text-[#C5232B]"
                    : "text-[#8A8A8A] hover:text-[#333333]",
                ].join(" ")}
              >
                {tab.label}

                <span
                  className={[
                    "absolute inset-x-0 bottom-0 h-[2px]",
                    "transition-opacity duration-300",
                    isActive
                      ? "bg-[#C5232B] opacity-100"
                      : "opacity-0",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
        {currentTab.type === "specs" &&
          (currentTab.items as ISpecItem[]).map(
            (item, index) => (
              <SpecCard
                key={`${item.label}-${index}`}
                label={item.label}
                value={item.value}
                icon={resolveSpecIcon(item.label, index)}
              />
            ),
          )}

        {(currentTab.type === "safety" ||
          currentTab.type === "other") &&
          (
            currentTab.items as Array<
              string | IFeatureItem
            >
          ).map((item, index) => {
            if (typeof item === "string") {
              return (
                <SpecCard
                  key={`${item}-${index}`}
                  label={item}
                  value="—"
                  icon={
                    <ShieldCheck
                      size={18}
                      strokeWidth={1.8}
                    />
                  }
                />
              );
            }

            return (
              <SpecCard
                key={`${item.name}-${index}`}
                label={localize(item.name, i18n.language)}
                value={localize(item.value, i18n.language) || "—"}
                icon={
                  <ShieldCheck
                    size={18}
                    strokeWidth={1.8}
                  />
                }
              />
            );
          })}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div
        dir={i18n.dir()}
        className={`w-full ${className}`}
      >
        {content}
      </div>
    );
  }

  return (
    <section
      dir={i18n.dir()}
      className={`mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 ${className}`}
    >
      {content}
    </section>
  );
}

interface SpecCardProps extends ICarDetailsSpecsCardProps {}

function SpecCard({
  label,
  value,
  icon,
}: SpecCardProps) {
  return (
    <article
      className={[
        "flex min-h-[100px] flex-col justify-center",
        "rounded-[16px] border border-[#E8E8E8]",
        "bg-white px-5 py-4",
        "transition duration-300",
        "hover:border-[#D9D9D9]",
        "hover:shadow-[0_7px_20px_rgba(15,23,42,0.05)]",
      ].join(" ")}
    >
      {/* Icon + label row */}
      <div className="flex items-center justify-start gap-2">
        {icon && (
          <span className="shrink-0 text-[#D22A32]">{icon}</span>
        )}
        <span className="text-[13px] text-[#989898]">{label}</span>
      </div>

      {/* Value */}
      <p className="mt-2 text-start text-[20px] font-extrabold leading-tight text-[#111111]">
        {value || "—"}
      </p>
    </article>
  );
}

function resolveSpecIcon(
  label: string,
  index: number,
): ReactNode {
  const normalized = label.toLowerCase();

  if (
    normalized.includes("محرك") ||
    normalized.includes("engine")
  ) {
    return <Zap size={18} strokeWidth={1.8} />;
  }

  if (
    normalized.includes("قوة") ||
    normalized.includes("حصان") ||
    normalized.includes("power")
  ) {
    return <Gauge size={18} strokeWidth={1.8} />;
  }

  if (
    normalized.includes("ناقل") ||
    normalized.includes("قير") ||
    normalized.includes("transmission")
  ) {
    return <Settings2 size={18} strokeWidth={1.8} />;
  }

  if (
    normalized.includes("وقود") ||
    normalized.includes("fuel")
  ) {
    return <Fuel size={18} strokeWidth={1.8} />;
  }

  if (
    normalized.includes("لون") ||
    normalized.includes("color")
  ) {
    return <Tag size={18} strokeWidth={1.8} />;
  }

  if (
    normalized.includes("سنة") ||
    normalized.includes("موديل") ||
    normalized.includes("year")
  ) {
    return (
      <CalendarDays size={18} strokeWidth={1.8} />
    );
  }

  const fallbackIcons = [
    <Zap key="zap" size={18} strokeWidth={1.8} />,
    <Gauge key="gauge" size={18} strokeWidth={1.8} />,
    <Settings2
      key="settings"
      size={18}
      strokeWidth={1.8}
    />,
    <Fuel key="fuel" size={18} strokeWidth={1.8} />,
    <Tag key="tag" size={18} strokeWidth={1.8} />,
    <CalendarDays
      key="calendar"
      size={18}
      strokeWidth={1.8}
    />,
  ];

  return fallbackIcons[index % fallbackIcons.length];
}