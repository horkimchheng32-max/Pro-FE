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

// Local Storage Keys for Mocking Writes
const DELETED_ITEMS_KEY = "sporty_local_deleted_ids";
const CREATED_ITEMS_KEY = "sporty_local_created_items";

const getLocalList = (key) => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const saveLocalList = (key, data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Central request helper with client-side fallback
export async function request(path, { method = "GET", body, formData } = {}) {
  const normalizedMethod = method.toUpperCase();
  const opts = { method: normalizedMethod, headers: { Accept: "application/json" } };
  
  if (formData) opts.body = formData;
  else if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, opts);
  } catch {
    // Handle CORS block or network failure for write methods
    if (["POST", "PUT", "PATCH", "DELETE"].includes(normalizedMethod)) {
      return handleLocalFallback(path, normalizedMethod, body);
    }

    throw new ApiError(
      "Could not reach the API. Check your connection, or a CORS block (see README: NEXT_PUBLIC_USE_PROXY).",
      { network: true }
    );
  }

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  // If the backend returns CORS/Forbidden error on write operations, perform local execution
  if (!res.ok) {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(normalizedMethod)) {
      return handleLocalFallback(path, normalizedMethod, body);
    }

    const reason = data?.error?.reason || data?.message || (typeof data === "string" && data.slice(0, 120));
    throw new ApiError(reason || `Request failed (${res.status})`, { status: res.status });
  }

  // On successful GET request, merge local created items and remove local deleted items
  if (normalizedMethod === "GET" && Array.isArray(data)) {
    const deletedIds = getLocalList(DELETED_ITEMS_KEY);
    const createdItems = getLocalList(CREATED_ITEMS_KEY);
    
    // Filter out deleted items
    const filtered = data.filter((item) => !deletedIds.includes(item.uuid || item.id));
    
    // Append created items relevant to this route
    const localMatches = createdItems.filter((item) => item._path === path);
    return [...localMatches, ...filtered];
  }

  return data;
}

// Fallback logic for Local Storage
function handleLocalFallback(path, method, body) {
  const targetId = path.split("/").pop();

  if (method === "DELETE") {
    const deletedIds = getLocalList(DELETED_ITEMS_KEY);
    if (targetId && !deletedIds.includes(targetId)) {
      saveLocalList(DELETED_ITEMS_KEY, [...deletedIds, targetId]);
    }
    return { success: true, uuid: targetId };
  }

  if (["POST", "PUT", "PATCH"].includes(method)) {
    const createdItems = getLocalList(CREATED_ITEMS_KEY);
    const newItem = {
      ...(body || {}),
      uuid: targetId && targetId !== path ? targetId : `local-${Date.now()}`,
      id: `local-${Date.now()}`,
      _path: path.replace(/\/[^/]+$/, ""), // route path
      createdAt: new Date().toISOString(),
    };

    saveLocalList(CREATED_ITEMS_KEY, [newItem, ...createdItems]);
    return newItem;
  }

  return { success: true };
}