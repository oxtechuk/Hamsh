import type { IBlogApiResponse } from "../../interfaces/IBlogApiResponse";
import type { IBlogDetailsApiResponse } from "../../interfaces/IBlogDetailsApiResponse";
import type { IBlogDetails } from "../../interfaces/IBlogDetails";
import api from "./http";

export async function getBlogs(
  page = 1,
  perPage = 6
): Promise<IBlogApiResponse> {
  const response = await api.get<IBlogApiResponse>("store/blog", {
    params: { page, per_page: perPage },
  });
  return response.data;
}

export async function getBlogBySlug(slug: string): Promise<IBlogDetails> {
  const response = await api.get<IBlogDetailsApiResponse>(`store/blog/${slug}`);
  return response.data.data;
}
