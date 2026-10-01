// Favorites are kept separate on purpose. Only GET /favorites is confirmed on the deployed server.
import { request } from "./api";
import { toList } from "@/utils/normalize";

export const favoritesWriteEnabled = true;

const STORAGE_KEY = "sporty_local_favorites";

const getLocalFavorites = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const setLocalFavorites = (items) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

export const getFavorites = async () => {
  try {
    const apiFavorites = toList(await request("/favorites"));
    const localFavorites = getLocalFavorites();
    
    // Combine API favorites with local favorites without duplicates
    const combined = [...apiFavorites];
    localFavorites.forEach((localItem) => {
      if (!combined.some((item) => (item.uuid || item.id) === (localItem.uuid || localItem.id))) {
        combined.push(localItem);
      }
    });
    return combined;
  } catch {
    return getLocalFavorites();
  }
};

export async function createFavorite({ sportUuid = "", eventUuid = "" }) {
  const newItem = {
    uuid: `local-${Date.now()}`,
    sportUuid,
    eventUuid,
    createdAt: new Date().toISOString(),
  };

  const current = getLocalFavorites();
  const updated = [newItem, ...current];
  setLocalFavorites(updated);

  return newItem;
}

export async function deleteFavorite(uuid) {
  const current = getLocalFavorites();
  const updated = current.filter((item) => (item.uuid || item.id) !== uuid);
  setLocalFavorites(updated);

  return { success: true, uuid };
}