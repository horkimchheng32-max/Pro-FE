import { request } from "./api";
import { toList } from "@/utils/normalize";
export const getComments = async () => toList(await request("/comments"));
export const getCommentsByEvent = async (eventUuid) => toList(await request(`/comments/events/${eventUuid}`));
// data: { eventUuid, comment }
export const createComment = (data) => request("/comments", { method: "POST", body: data });
export const deleteComment = (uuid) => request(`/comments/${uuid}`, { method: "DELETE" });
