import type { IRadioRowProps } from "../interfaces/IRadioRowProps";

export function RadioRow({ label, active, onClick }: IRadioRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-start gap-2.5 text-[14px] text-[#374151] hover:text-[var(--brand-secondary-color)]"
    >
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition ${
          active
            ? "border-[var(--brand-secondary-color)] bg-[var(--brand-secondary-color)]"
            : "border-[#D1D5DB] bg-white"
        }`}
      >
        {active && <span className="h-[6px] w-[6px] rounded-full bg-white" />}
      </span>
      <span className={active ? "font-semibold text-[#111827]" : ""}>{label}</span>
    </button>
  );
}
