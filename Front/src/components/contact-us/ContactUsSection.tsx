import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IContactUsSectionProps } from "../../interfaces/IContactUsSectionProps";
import { useContactForm } from "../../hooks/useContactForm";
import BranchMapCard from "./BranchMapCard";
import DepartmentCard from "./DepartmentCard";
import ContactForm from "./ContactForm";

export default function ContactUsSection({
  title,
  description,
  branches = [],
}: IContactUsSectionProps) {
  const { t, i18n } = useTranslation();
  const [activeBranchIdx, setActiveBranchIdx] = useState(0);
  const branch = branches[activeBranchIdx] ?? branches[0] ?? null;

  const { values, set, submitStatus, isSubmitting, handleSubmit } =
    useContactForm();

  return (
    <section dir={i18n.dir()} className="w-full py-14">
      {branch && (
        <div className="mb-8 space-y-4">
          <BranchMapCard
            branches={branches}
            activeBranchIdx={activeBranchIdx}
            onBranchChange={setActiveBranchIdx}
          />

          {branch.departments?.map((dep) => (
            <DepartmentCard key={dep.label} department={dep} />
          ))}
        </div>
      )}

      <ContactForm
        title={title || t("contactPage.contactUs.title")}
        description={description || ""}
        values={values}
        set={set}
        submitStatus={submitStatus}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
