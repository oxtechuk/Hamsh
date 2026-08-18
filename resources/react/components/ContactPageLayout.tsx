import type { IContactPageLayoutProps } from "../interfaces/IContactPageLayoutProps";
import BranchesCard from "./contact-us/BranchesCard";

export default function ContactPageLayout({
  form,
  faq,
  branches = [],
}: IContactPageLayoutProps) {
  return (
    <section className="w-full bg-[var(--background)] pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={[
            "grid grid-cols-1 items-start gap-8",
            "lg:grid-cols-[0.95fr_1.15fr]",
            "lg:gap-12",
          ].join(" ")}
        >
          {/* Form */}
          <div className="order-1">
            {form}
          </div>

          {/* FAQ + branches */}
          <aside className="order-2 space-y-6 self-start">
            {faq}

            {branches.length > 0 && (
              <BranchesCard branches={branches} />
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
