import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { submitBooking } from "../services/api";
import SpecialOrderStepper from "../components/special-order/SpecialOrderStepper";
import SpecialOrderStepOne from "../components/special-order/SpecialOrderStepOne";
import OrdinaryOrderStepTwo from "../components/ordinary-order/OrdinaryOrderStepTwo";
import SpecialOrderSuccess from "../components/special-order/SpecialOrderSuccess";
import OrderHero from "../components/orders/OrderHero";
import type {
  ISpecialOrderPersonalInfo,
  IOrderStepperStep,
} from "../interfaces/ISpecialOrderTypes";
import type { CarItem } from "../types/home.types";

const EMPTY_PERSONAL: ISpecialOrderPersonalInfo = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
};

export default function OrdinaryOrderPage() {
  const { t } = useTranslation();
  const location = useLocation();

  const STEPS: IOrderStepperStep[] = [
    { number: 1, label: t("ordinaryOrder.stepper.step1", "معلوماتك") },
    { number: 2, label: t("ordinaryOrder.stepper.step2", "تفاصيل السيارة") },
    { number: 3, label: t("ordinaryOrder.stepper.step3", "المراجعة") },
  ];
  const preSelectedCar =
    (location.state as { car?: CarItem } | null)?.car ?? null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [personal, setPersonal] =
    useState<ISpecialOrderPersonalInfo>(EMPTY_PERSONAL);
  const [selectedCar, setSelectedCar] = useState<CarItem | null>(preSelectedCar);

  const setPersonalField = <K extends keyof ISpecialOrderPersonalInfo>(
    k: K,
    v: ISpecialOrderPersonalInfo[K],
  ) => setPersonal((p) => ({ ...p, [k]: v }));

  const activeCar = selectedCar ?? preSelectedCar;

  const handleSubmit = async () => {
    if (!activeCar) return;
    setSubmitting(true);
    try {
      await submitBooking({
        client_name: personal.fullName,
        client_phone: personal.phone,
        client_email: personal.email,
        city: personal.city,
        car_id: activeCar.id,
        down_payment: 0,
        duration_years: null,
        interest_rate: 0,
        booking_type: "purchase",
        notes: "",
      });
      setDone(true);
    } catch {
      toast.error(t("specialOrder.error.submitFailed", "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مجدداً"));
    } finally {
      setSubmitting(false);
    }
  };

  const carLabel = activeCar
    ? `${activeCar.brand?.name ?? ""} ${activeCar.name} ${activeCar.year ?? ""}`.trim()
    : "";

  return (
    <>
      <OrderHero
        badgeKey="ordinaryOrder.hero.badge"
        badgeFallback="طلب سيارة"
        titleKey="ordinaryOrder.hero.title"
        titleFallback="اطلب سيارتك\nبالمواصفات اللي تناسبك"
        subtitleKey="ordinaryOrder.hero.subtitle"
        subtitleFallback="فريقنا يساعدك تجيب سيارتك بالمواصفات المطلوبة"
      />

      <section className="w-full px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          {!done && (
            <div className="mb-10">
              <SpecialOrderStepper activeStep={step} steps={STEPS} />
            </div>
          )}

          {done ? (
            <SpecialOrderSuccess
              carLabel={carLabel}
              clientPhone={personal.phone}
            />
          ) : step === 1 ? (
            <SpecialOrderStepOne
              data={personal}
              onChange={setPersonalField}
              onNext={() => setStep(2)}
              hideEmail
            />
          ) : (
            <OrdinaryOrderStepTwo
              initialCar={preSelectedCar}
              selected={selectedCar}
              onSelect={setSelectedCar}
              onSubmit={handleSubmit}
              onBack={() => setStep(1)}
              submitting={submitting}
            />
          )}
        </div>
      </section>
    </>
  );
}
