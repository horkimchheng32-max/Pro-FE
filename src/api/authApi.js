// Client-side demo auth.
// The Sport API has no documented auth endpoints, so accounts are stored in the browser (localStorage)
// with SHA-256 hashed passwords. To use a real backend later, replace the bodies of
// signUp / signIn / signOut / getSession with request("/auth/...") calls — the UI won't need to change.
const USERS_KEY = "sporty_users";
const SESSION_KEY = "sporty_session";

const read = (k, fallback) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; }
};

async function hash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const publicUser = ({ id, name, email }) => ({ id, name, email });

export function getSession() {
  if (typeof window === "undefined") return null;
  return read(SESSION_KEY, null);
}

export async function signUp({ name, email, password }) {
  const users = read(USERS_KEY, []);
  const mail = email.trim().toLowerCase();
  if (users.some((u) => u.email === mail)) throw new Error("An account with this email already exists.");
  const user = { id: `u-${Date.now()}`, name: name.trim(), email: mail, password: await hash(password) };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  const session = publicUser(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signIn({ email, password }) {
  const users = read(USERS_KEY, []);
  const mail = email.trim().toLowerCase();
  const user = users.find((u) => u.email === mail);
  if (!user || user.password !== (await hash(password))) throw new Error("Incorrect email or password.");
  const session = publicUser(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}
