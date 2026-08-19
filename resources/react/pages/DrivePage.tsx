import { useTranslation } from "react-i18next";

import DriveHeader from "../components/drive/DriveHeader";
import DriveStepper from "../components/drive/DriveStepper";
import DriveSuccess from "../components/drive/DriveSuccess";
import DriveStepOne from "../components/drive/DriveStepOne";
import DriveStepTwo from "../components/drive/DriveStepTwo";
import DriveSelectedCarPreview from "../components/drive/DriveSelectedCarPreview";

import { useDriveForm } from "../hooks/useDriveForm";

export default function DrivePage() {
    const { i18n } = useTranslation();

    const {
        step,
        setStep,
        done,
        submitting,
        personal,
        setPersonalField,
        selectedCar,
        setSelectedCar,
        selectedCarLabel,
        cars,
        isLoading,
        handleSubmit,
    } = useDriveForm();

    return (
        <main
            dir={i18n.dir()}
            className="min-h-screen w-full bg-[var(--background)]"
        >
            {!done && <DriveHeader />}

            <section className="w-full pb-16 pt-10 sm:pt-12">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                    {done ? (
                        <DriveSuccess
                            carLabel={selectedCarLabel}
                            clientPhone={personal.phone}
                        />
                    ) : (
                        <div className="flex flex-col gap-8 lg:flex-row-reverse">
                            <div className="min-w-0 flex-1 lg:w-3/5">
                                {step === 1 ? (
                                    <DriveStepOne
                                        data={personal}
                                        onChange={setPersonalField}
                                        onNext={() => setStep(2)}
                                    />
                                ) : (
                                    <DriveStepTwo
                                        cars={cars}
                                        isLoading={isLoading}
                                        selectedCar={selectedCar}
                                        onCarSelect={setSelectedCar}
                                        onBack={() => setStep(1)}
                                        onSubmit={handleSubmit}
                                        submitting={submitting}
                                    />
                                )}
                            </div>

                            <aside className="w-full shrink-0 lg:w-2/5">
                                <div className="sticky top-6">
                                    <div className="min-h-[470px] w-full overflow-hidden bg-white">
                                        <div className="px-8 py-10">
                                            <DriveStepper activeStep={step} />
                                        </div>

                                        {selectedCar && step === 2 && (
                                            <DriveSelectedCarPreview
                                                car={selectedCar}
                                            />
                                        )}
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
