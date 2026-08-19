import { useTranslation } from "react-i18next";

import LazyImg from "../LazyImg";
import { APP_IMAGES, getImageUrl } from "../../constants/app-images";
import { localize } from "../../utils/localize";

import type { IDriveSelectedCarPreviewProps } from "../../interfaces/IDriveSelectedCarPreviewProps";

export default function DriveSelectedCarPreview({
    car,
}: IDriveSelectedCarPreviewProps) {
    const { i18n } = useTranslation();

    const image = getImageUrl(car.main_image) || APP_IMAGES.CAR_PLACEHOLDER;

    return (
        <>
            <div className="border-t border-[#F3F4F6]" />
            <div className="px-4 py-4">
                <div className="mx-auto w-[354.08px] max-w-full overflow-hidden rounded-[12px] border border-[#F3F4F6] bg-[#F5F2EC]!">
                    <div className="h-[180px] w-full">
                        <LazyImg
                            src={image}
                            alt={localize(car.name, i18n.language)}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="px-4 py-3">
                        <p className="text-[12px] text-[var(--brand-primary-color)]">
                            {localize(car.brand?.name, i18n.language)}
                        </p>
                        <p className="text-[15px] font-extrabold text-[#111111]">
                            {localize(car.name, i18n.language)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
