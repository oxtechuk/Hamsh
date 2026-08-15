import { useLanguageStore } from "../../store/language.store";

export default function StepTwoSkeleton() {
  const direction = useLanguageStore((s) => s.direction);
  return (
    <div
      dir={direction}
      className="mx-auto w-full max-w-[600px] animate-pulse rounded-[16px] border border-[#E7E7E7] bg-white px-6 py-8"
    >
      <div className="mb-6 h-8 w-40 rounded bg-[#EEEEEE] ms-auto" />
      <div className="h-4 w-28 rounded bg-[#F1F1F1] ms-auto mb-2" />
      <div className="h-[72px] rounded-[12px] bg-[#F2F2F2]" />
      <div className="mt-5 h-4 w-28 rounded bg-[#F1F1F1] ms-auto mb-3" />
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[72px] rounded-[12px] bg-[#F2F2F2]" />
        ))}
      </div>
    </div>
  );
}
