const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY === "true";
export const API_URL = (
  USE_PROXY ? "/api-proxy" : process.env.NEXT_PUBLIC_API_URL || "https://sport-api.eunglyzhia.com/api/v1"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, { status = 0, network = false } = {}) {
    super(message);
    this.status = status;
    this.network = network;
  }
}

// Central request helper. Pass `formData` for uploads: Content-Type is left for the browser to set.
export async function request(path, { method = "GET", body, formData } = {}) {
  const opts = { method, headers: { Accept: "application/json" } };
  if (formData) opts.body = formData;
  else if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, opts);
  } catch {
    throw new ApiError(
      "Could not reach the API. Check your connection, or a CORS block (see README: NEXT_PUBLIC_USE_PROXY).",
      { network: true }
    );
  }
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const reason = data?.error?.reason || data?.message || (typeof data === "string" && data.slice(0, 120));
    throw new ApiError(reason || `Request failed (${res.status})`, { status: res.status });
  }
  return data;
}
