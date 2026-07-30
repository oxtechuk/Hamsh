import type { ApiResponse } from "../../types/home.types";
import api from "./http";

export interface ICity {
  id: number;
  name: string;
}

export async function getCities(): Promise<ICity[]> {
  const response = await api.get<ApiResponse<ICity[]>>("store/cities");
  return response.data.data;
}
