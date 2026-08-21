import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";

import {
    carOrderFieldCls,
    carOrderLabelCls,
} from "../../constants/car-order.constants";

import type { ICarOrderStepOneFormProps } from "../../interfaces/ICarOrderStepOneFormProps";

export default function CarOrderStepOneForm({
    form,
    cityOptions,
    canContinue,
    onFieldChange,
    onSubmit,
}: ICarOrderStepOneFormProps) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const NextArrowIcon = isRTL ? ArrowLeft : ArrowRight;

    return (
        <form onSubmit={onSubmit} className="flex flex-1 flex-col ">
            <h2 className="text-[24px] font-extrabold text-[#20283A]">
                {t("carDetails.modal.stepperBasicInfo")}
            </h2>
            <p className="mt-1 text-[13px] text-[#8B909C]">
                {t("carDetails.modal.step1Subtitle")}
            </p>

            <div className="mt-6 flex flex-col gap-4">
                <div>
                    <label className={carOrderLabelCls}>
                        {t("specialOrder.step1.fullName")} *
                    </label>
                    <input
                        type="text"
                        value={form.fullName}
                        onChange={(event) =>
                            onFieldChange("fullName", event.target.value)
                        }
                        placeholder={t("carDetails.modal.fullNamePlaceholder")}
                        className={carOrderFieldCls}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={carOrderLabelCls}>
                            {t("specialOrder.step1.phone")} *
                        </label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(event) =>
                                onFieldChange("phone", event.target.value)
                            }
                            placeholder={t(
                                "specialOrder.step1.phonePlaceholder",
                            )}
                            dir="ltr"
                            className={`${carOrderFieldCls} text-end`}
                            required
                        />
                    </div>

                    <div>
                        <label className={carOrderLabelCls}>
                            {t("specialOrder.step1.city")} *
                        </label>
                        <select
                            value={form.city}
                            onChange={(event) =>
                                onFieldChange("city", event.target.value)
                            }
                            className={carOrderFieldCls}
                            required
                        >
                            <option value="" disabled>
                                {t("specialOrder.step1.cityPlaceholder")}
                            </option>
                            {cityOptions.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className={carOrderLabelCls}>
                        {t("specialOrder.step1.email")}
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                            onFieldChange("email", event.target.value)
                        }
                        placeholder={t("specialOrder.step1.emailPlaceholder")}
                        dir="ltr"
                        className={`${carOrderFieldCls} text-end`}
                    />
                </div>
            </div>

            <div className="mt-auto flex justify-end pt-6">
                <button
                    type="submit"
                    disabled={!canContinue}
                    className="flex h-[48px] items-center justify-center gap-2 bg-[var(--brand-primary-color)] px-8 text-[13px] font-semibold! text-[var(--brand-secondary-color)] transition duration-300 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {t("carDetails.modal.nextButton")}
                    <NextArrowIcon size={16} />
                </button>
            </div>
        </form>
    );
}
