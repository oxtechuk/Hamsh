export interface ICalculatorLeadRequest {
  name: string;
  phone: string;
  email: string;
  city: string;
  purpose: string;
  car_ids: number[];
  notes: string;
  monthly_obligations: number;
  salary: number;
}

export interface ICalculatorLeadResponse {
  success: boolean;
  message: string;
  data: { lead_id: number } | null;
  errors: unknown;
  meta: unknown;
}
