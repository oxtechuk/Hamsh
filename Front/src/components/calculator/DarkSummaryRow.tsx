export default function DarkSummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[44px] items-center justify-between gap-4 py-2.5 text-[12px]">
      <span className="text-white/45">{label}</span>
      <strong className="text-white/80">{value}</strong>
    </div>
  );
}
