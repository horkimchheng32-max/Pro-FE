import { request } from "./api";
import { toList, unwrap } from "@/utils/normalize";
export const getSports = async () => toList(await request("/sports"));
export const getSportById = async (uuid) => unwrap(await request(`/sports/${uuid}`));
export const createSport = (data) => request("/sports", { method: "POST", body: data });
export const updateSport = (uuid, data) => request(`/sports/${uuid}`, { method: "PATCH", body: data });
export const deleteSport = (uuid) => request(`/sports/${uuid}`, { method: "DELETE" });
