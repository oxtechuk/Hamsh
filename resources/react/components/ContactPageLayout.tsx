interface BranchItem {
  id: string | number;
  city: string;
  address?: string;
  phone?: string;
  workingHours?: string;
  mapUrl?: string;
}

interface ContactPageLayoutProps {
  form: React.ReactNode;
  faq: React.ReactNode;
  branches?: BranchItem[];
}

export default function ContactPageLayout({
  form,
  faq,
  branches = [],
}: ContactPageLayoutProps) {
  return (
    <section className="w-full bg-[var(--background)] pb-16 sm:pb-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div
          className={[
            "grid grid-cols-1 items-start gap-8",
            "lg:grid-cols-[0.95fr_1.15fr]",
            "lg:gap-12",
          ].join(" ")}
        >
          {/* FAQ + branches */}
          <aside className="order-2 space-y-6 lg:order-1">
            {faq}

            {branches.length > 0 && (
              <BranchesCard
                branches={branches}
              />
            )}
          </aside>

          {/* Form */}
          <div className="order-1 lg:order-2">
            {form}
          </div>
        </div>
      </div>
    </section>
  );
}

function BranchesCard({
  branches,
}: {
  branches: BranchItem[];
}) {
  return (
    <section className="bg-white px-7 py-7">
      <h2 className="text-start text-[22px] font-extrabold text-[#20283A]">
        معلومات الفروع
      </h2>

      <div className="mt-5 divide-y divide-[#E8E2D7]">
        {branches.slice(0, 3).map(
          (branch) => (
            <div
              key={branch.id}
              className="py-4 text-start first:pt-0 last:pb-0"
            >
              <h3 className="text-[14px] font-bold text-[#303A54]">
                {branch.city}
              </h3>

              {branch.address && (
                <p className="mt-1 text-[11px] leading-5 text-[#71798A]">
                  {branch.address}
                </p>
              )}

              {branch.workingHours && (
                <p className="mt-1 text-[11px] text-[#71798A]">
                  {branch.workingHours}
                </p>
              )}
            </div>
          ),
        )}
      </div>
    </section>
  );
}