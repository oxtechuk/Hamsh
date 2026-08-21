import { useTranslation } from "react-i18next";
import { Briefcase } from "lucide-react";

import {
    CAR_ORDER_WORK_SECTORS,
    carOrderFieldCls,
    carOrderLabelCls,
} from "../../constants/car-order.constants";

import type { ICarOrderStepTwoFormProps } from "../../interfaces/ICarOrderStepTwoFormProps";

export default function CarOrderStepTwoForm({
    form,
    eligibility,
    canSubmit,
    submitting,
    onFieldChange,
    onBack,
    onSubmit,
}: ICarOrderStepTwoFormProps) {
    const { t } = useTranslation();

    return (
        <form onSubmit={onSubmit} className="flex flex-1 flex-col">
            <h2 className="text-[24px] font-extrabold text-[#20283A]">
                {t("carDetails.modal.step2Title")}
            </h2>
            <p className="mt-1 text-[13px] text-[#8B909C]">
                {t("carDetails.modal.step2Subtitle")}
            </p>

            <div className="mt-6 flex flex-col gap-4">
                <div>
                    <label className={carOrderLabelCls}>
                        {t("carDetails.modal.salaryLabel")} *
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={form.salary}
                        onChange={(event) =>
                            onFieldChange("salary", event.target.value)
                        }
                        placeholder={t("carDetails.modal.salaryPlaceholder")}
                        className={carOrderFieldCls}
                        required
                    />
                </div>

                <div>
                    <label className={carOrderLabelCls}>
                        {t("carDetails.modal.workSectorLabel")} *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {CAR_ORDER_WORK_SECTORS.map((sector) => {
                            const isActive = form.workSector === sector;

                            return (
                                <button
                                    key={sector}
                                    type="button"
                                    onClick={() =>
                                        onFieldChange("workSector", sector)
                                    }
                                    className={[
                                        "flex h-[44px] items-center justify-center gap-2 border",
                                        "text-[13px] font-bold",
                                        "transition duration-300",
                                        isActive
                                            ? "border-[var(--brand-primary-color)] bg-[var(--brand-primary-color)]/10 text-[#20283A] font-semibold!"
                                            : "border-[#E1E2E5] bg-white text-[#303A54] hover:bg-[#F5F4EF]",
                                    ].join(" ")}
                                >
                                    <Briefcase size={15} strokeWidth={2} />
                                    {t(`carDetails.modal.workSector.${sector}`)}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className={carOrderLabelCls}>
                        {t("carDetails.modal.obligationsLabel")}
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={form.obligations}
                        onChange={(event) =>
                            onFieldChange("obligations", event.target.value)
                        }
                        placeholder={t(
                            "carDetails.modal.obligationsPlaceholder",
                        )}
                        className={carOrderFieldCls}
                    />
                </div>

                <div>
                    <p className={carOrderLabelCls}>
                        {t("carDetails.modal.eligibilityLabel")}
                    </p>
                    <div
                        dir="ltr"
                        className="relative h-[6px] w-full rounded-full bg-[#E7E5DE]"
                    >
                        <div
                            className="h-full rounded-full bg-[var(--brand-primary-color)]"
                            style={{ width: `${eligibility}%` }}
                        />
                        <div
                            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[var(--brand-primary-color)] bg-white"
                            style={{
                                insetInlineStart: `calc(${eligibility}% - 8px)`,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-auto flex items-center gap-3 pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex h-[48px] items-center justify-center border border-[var(--brand-secondary-color)] px-6 text-[13px] font-bold text-[#20283A] transition duration-300 hover:bg-[#F5F4EF]"
                >
                    {t("carDetails.modal.backButton")}
                </button>

                <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className="flex h-[48px] flex-1 items-center justify-center bg-[var(--brand-primary-color)] px-8 text-[13px] font-semibold! text-[#20283A] transition duration-300 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {submitting
                        ? t("carDetails.modal.submitting")
                        : t("carDetails.modal.submitButton")}
                </button>
            </div>
        </form>
    );
}
