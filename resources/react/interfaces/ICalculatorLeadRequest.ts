export interface ICalculatorLeadRequest {
  name: string;
  phone: string;
  car_ids: number[];
  salary: number;
  city: string;
  monthly_obligations: number;
}

export interface ICalculatorLeadResponse {
  success: boolean;
  message: string;
  data: { lead_id: number } | null;
  errors: unknown;
  meta: unknown;
}
