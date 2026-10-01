import { request } from "./api";
// Single image -> field "file". Multiple -> field "files". No manual Content-Type.
export function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request("/upload", { method: "POST", formData });
}
export function uploadImages(files) {
  const formData = new FormData();
  [...files].forEach((f) => formData.append("files", f));
  return request("/upload", { method: "POST", formData });
}
