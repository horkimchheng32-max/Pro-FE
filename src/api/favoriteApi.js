// Favorites are kept separate on purpose. Only GET /favorites is confirmed on the deployed server.
// The Postman POST points to http://localhost:8080 and DELETE uses /favorite/{uuid} (singular), so both
// are disabled until NEXT_PUBLIC_ENABLE_FAVORITE_WRITE=true.
import { request, ApiError } from "./api";
import { toList } from "@/utils/normalize";

export const favoritesWriteEnabled = process.env.NEXT_PUBLIC_ENABLE_FAVORITE_WRITE === "true";
const blocked = () => new ApiError("Saving favorites isn't available on the deployed server yet.");

export const getFavorites = async () => toList(await request("/favorites"));
export async function createFavorite({ sportUuid = "", eventUuid = "" }) {
  if (!favoritesWriteEnabled) throw blocked();
  return request("/favorites", { method: "POST", body: { sportUuid, eventUuid } });
}
export async function deleteFavorite(uuid) {
  if (!favoritesWriteEnabled) throw blocked();
  return request(`/favorite/${uuid}`, { method: "DELETE" });
}
