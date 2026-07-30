import type { IBlogPost } from "./IBlogPost";
import type { IBlogMeta } from "./IBlogMeta";

export interface IBlogApiResponse {
  success: boolean;
  message: string;
  data: IBlogPost[];
  errors: null;
  meta: IBlogMeta;
}
