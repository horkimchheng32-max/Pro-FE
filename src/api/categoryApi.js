import { request } from "./api";
import { toList, unwrap } from "@/utils/normalize";
export const getCategories = async () => toList(await request("/sport_categories"));
export const getCategoryById = async (uuid) => unwrap(await request(`/sport_categories/${uuid}`));
export const createCategory = (data) => request("/sport_categories", { method: "POST", body: data });
export const updateCategory = (uuid, data) => request(`/sport_categories/${uuid}`, { method: "PATCH", body: data });
export const deleteCategory = (uuid) => request(`/sport_categories/${uuid}`, { method: "DELETE" });
