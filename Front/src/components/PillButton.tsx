import type { IPillButtonProps } from "../interfaces/IPillButtonProps";

export function PillButton({ label, active, onClick }: IPillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[4px] border px-4 py-1.5 text-[13px] font-medium transition ${
        active
          ? "border-[var(--brand-secondary-color)] bg-[var(--brand-secondary-color)] text-white"
          : "border-[#D1D5DB] bg-white text-[#374151] hover:border-[var(--brand-secondary-color)] hover:text-[var(--brand-secondary-color)]"
      }`}
    >
      {label}
    </button>
  );
}
