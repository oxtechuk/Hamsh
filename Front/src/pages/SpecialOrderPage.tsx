import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { submitBooking } from "../services/api";
import SpecialOrderStepper from "../components/special-order/SpecialOrderStepper";
import SpecialOrderStepOne from "../components/special-order/SpecialOrderStepOne";
import SpecialOrderStepTwo from "../components/special-order/SpecialOrderStepTwo";
import SpecialOrderStepThree from "../components/special-order/SpecialOrderStepThree";
import OrderHero from "../components/orders/OrderHero";
import SpecialOrderSuccess from "../components/special-order/SpecialOrderSuccess";
import type {
  ISpecialOrderStep,
  ISpecialOrderPersonalInfo,
  ISpecialOrderCarDetails,
  ISpecialOrderBudget,
} from "../interfaces/ISpecialOrderTypes";

const EMPTY_PERSONAL: ISpecialOrderPersonalInfo = { fullName: "", phone: "", email: "", city: "" };
const EMPTY_CAR: ISpecialOrderCarDetails = { brand: "", model: "", year: "", color: "", transmission: "", fuelType: "", notes: "" };
const EMPTY_BUDGET: ISpecialOrderBudget = { salaryRange: "", notes: "" };

export default function SpecialOrderPage() {
  const { t } = useTranslation();

  const [step, setStep] = useState<ISpecialOrderStep>(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [personal, setPersonal] = useState<ISpecialOrderPersonalInfo>(EMPTY_PERSONAL);
  const [car, setCar] = useState<ISpecialOrderCarDetails>(EMPTY_CAR);
  const [budget, setBudget] = useState<ISpecialOrderBudget>(EMPTY_BUDGET);

  const setPersonalField = <K extends keyof ISpecialOrderPersonalInfo>(k: K, v: ISpecialOrderPersonalInfo[K]) =>
    setPersonal((p) => ({ ...p, [k]: v }));

  const setCarField = <K extends keyof ISpecialOrderCarDetails>(k: K, v: ISpecialOrderCarDetails[K]) =>
    setCar((p) => ({ ...p, [k]: v }));

  const setBudgetField = <K extends keyof ISpecialOrderBudget>(k: K, v: ISpecialOrderBudget[K]) =>
    setBudget((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const extraNotes = [
        car.transmission ? `ناقل الحركة: ${car.transmission}` : "",
        car.fuelType ? `نوع الوقود: ${car.fuelType}` : "",
        budget.notes ? `ملاحظات: ${budget.notes}` : "",
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
      toast.error(t("specialOrder.error.submitFailed", "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجدداً"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <OrderHero
        badgeKey="specialOrder.hero.badge"
        badgeFallback="طلب مخصص"
        titleKey="specialOrder.hero.title"
        titleFallback="اطلب سيارتك\nبالمواصفات اللي تناسبك"
        subtitleKey="specialOrder.hero.subtitle"
        subtitleFallback="فريقنا يساعدك تجيب سيارتك بالمواصفات المطلوبة"
      />

      <section className="w-full bg-[#F5F4EF] px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          {!done && (
            <div className="mb-10">
              <SpecialOrderStepper activeStep={step} />
            </div>
          )}

          {done ? (
            <SpecialOrderSuccess
              carLabel={`${car.brand}${car.model ? ` ${car.model}` : ""}`}
              clientPhone={personal.phone}
            />
          ) : step === 1 ? (
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
              data={budget}
              onChange={setBudgetField}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>
      </section>
    </>
  );
}
