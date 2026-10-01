import { request } from "./api";
import { toList, unwrap } from "@/utils/normalize";
export const getEvents = async () => toList(await request("/events"));
export const getEventById = async (uuid) => unwrap(await request(`/events/${uuid}`));
export const createEvent = (data) => request("/events", { method: "POST", body: data });
export const updateEvent = (uuid, data) => request(`/events/${uuid}`, { method: "PATCH", body: data });
export const deleteEvent = (uuid) => request(`/events/${uuid}`, { method: "DELETE" });
