import type { IDrivePersonalInfo } from "./IDrivePersonalInfo";

export interface IDriveStepOneProps {
  data: IDrivePersonalInfo;
  onChange: (key: keyof IDrivePersonalInfo, value: string) => void;
  onNext: () => void;
}
