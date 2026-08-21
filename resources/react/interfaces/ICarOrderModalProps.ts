import type { CarDetails } from "../types/cars.types";

export interface ICarOrderModalProps {
  car: CarDetails;
  onClose: () => void;
}

export type CarOrderWorkSector =
  | "government"
  | "private"
  | "retired"
  | "freelance";

export interface ICarOrderFormData {
  fullName: string;
  city: string;
  phone: string;
  email: string;
  salary: string;
  workSector: CarOrderWorkSector | "";
  obligations: string;
}
