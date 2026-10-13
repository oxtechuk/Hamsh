import type { CarDetails } from "../types/cars.types";

export interface ICarOrderModalProps {
  car: CarDetails;
  onClose: () => void;
  initialMode?: "finance" | "cash";
}

export type CarOrderWorkSector =
  | "private_approved"
  | "government"
  | "semi_government"
  | "private_unapproved"
  | "military"
  | "retired"
  | "private"
  | "freelance"
  | "other";

export type ObligationType = "none" | "personal" | "real_estate_personal";

export interface ICarOrderFormData {
  fullName: string;
  city: string;
  phone: string;
  email: string;
  salary: string;
  workSector: string;
  obligations: string;
  obligationType: ObligationType;
  otpCode?: string;
  otpVerified?: boolean;
  consolidateDebts?: boolean;
  orderType?: "finance" | "cash";
}

