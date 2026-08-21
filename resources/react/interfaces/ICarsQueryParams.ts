export interface ICarsQueryParams {
  page?: number;
  per_page?: number;
  brands?: number[];
  type?: string;
  category_id?: number;
  year?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  q?: string;
  offer_id?: number;
  sort?: "price_asc" | "price_desc" | "year_desc" | "year_asc";
}
