// The deployed response shapes could not be verified, so these helpers accept several likely shapes.
export function toList(d) {
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") {
    for (const k of ["data", "content", "items", "results", "payload"]) {
      const v = d[k];
      if (Array.isArray(v)) return v;
      if (v && typeof v === "object") { const r = toList(v); if (r.length) return r; }
    }
    const arr = Object.values(d).find(Array.isArray);
    if (arr) return arr;
  }
  return [];
}
export const unwrap = (d) =>
  d && typeof d === "object" && d.data && typeof d.data === "object" && !Array.isArray(d.data) ? d.data : d;
export const idOf = (x) => x?.uuid ?? x?.id;
export const imagesOf = (x) => {
  const raw = x?.imageUrls ?? x?.images ?? (x?.imageUrl || x?.image ? [x.imageUrl || x.image] : []);
  return (Array.isArray(raw) ? raw : [raw]).map((i) => (typeof i === "string" ? i : i?.url)).filter(Boolean);
};
export const imageOf = (x) => imagesOf(x)[0] || null;
export const categoryOf = (x) =>
  (typeof x?.category === "string" ? x.category : x?.categoryName ?? x?.category?.name) || "";
export const commentText = (c) => c?.comment ?? c?.content ?? c?.text ?? "";
export function findUrl(d) {
  if (typeof d === "string") return /^https?:\/\//.test(d) ? d : null;
  if (Array.isArray(d)) { for (const x of d) { const u = findUrl(x); if (u) return u; } }
  else if (d && typeof d === "object") { for (const v of Object.values(d)) { const u = findUrl(v); if (u) return u; } }
  return null;
}
