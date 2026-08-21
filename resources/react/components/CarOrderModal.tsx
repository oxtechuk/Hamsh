import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { CreditCard, User, X } from "lucide-react";

import CarOrderSummaryPanel from "./car-order/CarOrderSummaryPanel";
import CarOrderStepOneForm from "./car-order/CarOrderStepOneForm";
import CarOrderStepTwoForm from "./car-order/CarOrderStepTwoForm";
import CarOrderSuccess from "./car-order/CarOrderSuccess";
import { useCarOrderForm } from "../hooks/useCarOrderForm";
import { localize } from "../utils/localize";
import { useLanguageStore } from "../store/language.store";

import type { ICarOrderModalProps } from "../interfaces/ICarOrderModalProps";
import type { ICarOrderStepMeta } from "../interfaces/ICarOrderSummaryPanelProps";

export default function CarOrderModal({ car, onClose }: ICarOrderModalProps) {
    const { t, i18n } = useTranslation();
    const direction = useLanguageStore((state) => state.direction);

    const {
        step,
        setStep,
        done,
        submitting,
        form,
        cityOptions,
        setField,
        canContinueStep1,
        canSubmitStep2,
        eligibility,
        handleStep1Submit,
        handleStep2Submit,
    } = useCarOrderForm(car);

    const steps: ICarOrderStepMeta[] = [
        {
            number: 1,
            label: t("carDetails.modal.stepperBasicInfo"),
            icon: User,
        },
        {
            number: 2,
            label: t("carDetails.modal.stepperFinancialDetails"),
            icon: CreditCard,
        },
    ];

    return createPortal(
        <div
            dir={direction}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[950px]"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={t("common.close")}
                    className="absolute start-0 -top-12 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#20283A] shadow-md transition hover:bg-[#F0EEE8]"
                >
                    <X size={18} />
                </button>

                <div className="grid max-h-[90vh] w-full grid-cols-1 overflow-y-auto bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] lg:grid-cols-2">
                    <CarOrderSummaryPanel
                        car={car}
                        step={step}
                        done={done}
                        steps={steps}
                    />

                    <div className="order-2 flex flex-col p-6 lg:p-8  bg-[#FAF8F4]">
                        {done ? (
                            <CarOrderSuccess
                                fullName={form.fullName}
                                carLabel={localize(car.name, i18n.language)}
                                onClose={onClose}
                            />
                        ) : step === 1 ? (
                            <CarOrderStepOneForm
                                form={form}
                                cityOptions={cityOptions}
                                canContinue={canContinueStep1}
                                onFieldChange={setField}
                                onSubmit={handleStep1Submit}
                            />
                        ) : (
                            <CarOrderStepTwoForm
                                form={form}
                                eligibility={eligibility}
                                canSubmit={canSubmitStep2}
                                submitting={submitting}
                                onFieldChange={setField}
                                onBack={() => setStep(1)}
                                onSubmit={handleStep2Submit}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
