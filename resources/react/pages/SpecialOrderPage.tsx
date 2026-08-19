import { useTranslation } from "react-i18next";

import SpecialOrderHeader from "../components/special-order/SpecialOrderHeader";
import SpecialOrderStepper from "../components/special-order/SpecialOrderStepper";
import SpecialOrderStepOne from "../components/special-order/SpecialOrderStepOne";
import SpecialOrderStepTwo from "../components/special-order/SpecialOrderStepTwo";
import SpecialOrderStepThree from "../components/special-order/SpecialOrderStepThree";
import SpecialOrderSuccess from "../components/special-order/SpecialOrderSuccess";

import { useSpecialOrderForm } from "../hooks/useSpecialOrderForm";

export default function SpecialOrderPage() {
    const { i18n } = useTranslation();

    const {
        step,
        setStep,
        done,
        submitting,
        personal,
        car,
        budget,
        setPersonalField,
        setCarField,
        handleSubmit,
    } = useSpecialOrderForm();

    return (
        <main
            dir={i18n.dir()}
            className="min-h-screen w-full bg-[var(--background)]"
        >
            {!done && <SpecialOrderHeader />}

            <section className="w-full pb-16 pt-10 sm:pt-12">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                    {done ? (
                        <SpecialOrderSuccess
                            carLabel={`${car.brand}${
                                car.model ? ` ${car.model}` : ""
                            }`}
                            clientPhone={personal.phone}
                        />
                    ) : (
                        <div className="flex flex-col gap-8 lg:flex-row-reverse">
                            <div className="min-w-0 flex-1 lg:w-3/5">
                                {step === 1 ? (
                                    <SpecialOrderStepOne
                                        data={personal}
                                        onChange={setPersonalField}
                                        onNext={() => setStep(2)}
                                        hideEmail
                                    />
                                ) : step === 2 ? (
                                    <SpecialOrderStepTwo
                                        data={car}
                                        onChange={setCarField}
                                        onNext={() => setStep(3)}
                                        onBack={() => setStep(1)}
                                    />
                                ) : (
                                    <SpecialOrderStepThree
                                        personal={personal}
                                        car={car}
                                        budget={budget.salaryRange}
                                        onBack={() => setStep(2)}
                                        onSubmit={handleSubmit}
                                        submitting={submitting}
                                    />
                                )}
                            </div>

                            <aside className="w-full shrink-0 lg:w-2/5">
                                <div className="sticky top-6">
                                    <div className="min-h-[470px] w-full bg-white px-8 py-10">
                                        <SpecialOrderStepper activeStep={step} />
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
