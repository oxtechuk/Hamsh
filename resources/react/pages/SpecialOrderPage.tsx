import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { submitBooking } from "../services/api";

import SpecialOrderStepper from "../components/special-order/SpecialOrderStepper";
import SpecialOrderStepOne from "../components/special-order/SpecialOrderStepOne";
import SpecialOrderStepTwo from "../components/special-order/SpecialOrderStepTwo";
import SpecialOrderStepThree from "../components/special-order/SpecialOrderStepThree";
import SpecialOrderSuccess from "../components/special-order/SpecialOrderSuccess";

import type {
    ISpecialOrderStep,
    ISpecialOrderPersonalInfo,
    ISpecialOrderCarDetails,
    ISpecialOrderBudget,
} from "../interfaces/ISpecialOrderTypes";

const EMPTY_PERSONAL: ISpecialOrderPersonalInfo = {
    fullName: "",
    phone: "",
    email: "",
    city: "",
    salary: "",
    obligations: "",
};

const EMPTY_CAR: ISpecialOrderCarDetails = {
    brand: "",
    model: "",
    year: "",
    color: "",
    transmission: "",
    fuelType: "",
    notes: "",
};

const EMPTY_BUDGET: ISpecialOrderBudget = {
    salaryRange: "",
    notes: "",
};

export default function SpecialOrderPage() {
    const { t, i18n } = useTranslation();

    const [step, setStep] = useState<ISpecialOrderStep>(1);

    const [done, setDone] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const [personal, setPersonal] =
        useState<ISpecialOrderPersonalInfo>(EMPTY_PERSONAL);

    const [car, setCar] = useState<ISpecialOrderCarDetails>(EMPTY_CAR);

    const [budget, setBudget] = useState<ISpecialOrderBudget>(EMPTY_BUDGET);

    const setPersonalField = <K extends keyof ISpecialOrderPersonalInfo>(
        key: K,
        value: ISpecialOrderPersonalInfo[K],
    ) => {
        setPersonal((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const setCarField = <K extends keyof ISpecialOrderCarDetails>(
        key: K,
        value: ISpecialOrderCarDetails[K],
    ) => {
        setCar((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const setBudgetField = <K extends keyof ISpecialOrderBudget>(
        key: K,
        value: ISpecialOrderBudget[K],
    ) => {
        setBudget((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            const extraNotes = [
                car.transmission ? `ناقل الحركة: ${car.transmission}` : "",

                car.fuelType ? `نوع الوقود: ${car.fuelType}` : "",

                car.notes ? `تفاصيل السيارة: ${car.notes}` : "",

                budget.notes ? `ملاحظات: ${budget.notes}` : "",

                personal.salary ? `الراتب: ${personal.salary}` : "",

                personal.obligations
                    ? `الالتزامات: ${personal.obligations}`
                    : "",
            ]
                .filter(Boolean)
                .join(" | ");

            await submitBooking({
                client_name: personal.fullName,
                client_phone: personal.phone,
                client_email: personal.email,
                city: personal.city,

                brand_name: car.brand,
                model_name: car.model,
                model_year: car.year,
                preferred_color: car.color,

                salary_range: budget.salaryRange,

                booking_type: "inquiry",

                notes: extraNotes,
            });

            setDone(true);
        } catch {
            toast.error(
                t(
                    "specialOrder.error.submitFailed",
                    "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجدداً",
                ),
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main
            dir={i18n.dir()}
            className="min-h-screen w-full bg-[var(--background)]"
        >
            {/* ------------------------------------------------ */}
            {/* Page header                                      */}
            {/* ------------------------------------------------ */}

            <div className="mx-auto max-w-[1280px] px-5 pt-8 sm:px-8 lg:px-10">
                {/* Breadcrumb */}
                <nav
                    className="flex items-center justify-start gap-2 text-[11px]"
                    aria-label="breadcrumb"
                >
                    <Link to="/" className="font-medium text-[#303A54]">
                        {t("breadcrumb.home", "الرئيسية")}
                    </Link>

                    <span className="text-[#8B909A]">
                        {i18n.dir() === "rtl" ? "‹" : "›"}
                    </span>

                    <span className="text-[var(--brand-primary-color)]">
                        {t("specialOrder.hero.badge", "طلب مخصص")}
                    </span>
                </nav>

                {/* Title */}
                <h1
                    className={[
                        "mt-3 text-start",
                        "text-[30px] font-extrabold",
                        "leading-tight text-[#20283A]",
                        "sm:text-[36px]",
                    ].join(" ")}
                >
                    <span>{t("specialOrder.pageTitle.prefix", "سيارتك")}</span>{" "}
                    <span className="text-[var(--brand-primary-color)]">
                        {t("specialOrder.pageTitle.highlight", "بمواصفاتك")}
                    </span>
                </h1>
            </div>

            {/* ------------------------------------------------ */}
            {/* Main content                                     */}
            {/* ------------------------------------------------ */}

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
                        <div
                            className={[
                                "grid grid-cols-1 items-start",
                                "gap-10",
                                "lg:grid-cols-[minmax(0,650px)_330px]",
                                "lg:justify-center lg:gap-14",
                            ].join(" ")}
                        >
                            {/* -------------------------------------- */}
                            {/* Main form                              */}
                            {/* -------------------------------------- */}

                            <div className="min-w-0">
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

                            {/* -------------------------------------- */}
                            {/* Side stepper                           */}
                            {/* -------------------------------------- */}

                            <aside className="w-full">
                                <div
                                    className={[
                                        "min-h-[470px] w-full",
                                        "bg-white",
                                        "px-8 py-10",
                                        "lg:sticky lg:top-[100px]",
                                    ].join(" ")}
                                >
                                    <SpecialOrderStepper activeStep={step} />
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
