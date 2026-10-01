"use client";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { getFavorites, createFavorite, deleteFavorite } from "@/api/favoriteApi";

const match = (f, kind, uuid) => f[`${kind}Uuid`] === uuid || f[kind]?.uuid === uuid;

export default function FavoriteButton({ kind, uuid }) {
  const favs = useFetch(getFavorites);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const current = Array.isArray(favs.data) ? favs.data.find((f) => match(f, kind, uuid)) : null;

  async function toggle() {
    setBusy(true); setMsg("");
    try {
      if (current) await deleteFavorite(current.uuid || current.id);
      else await createFavorite({ [`${kind}Uuid`]: uuid });
      favs.reload();
    } catch (e) { setMsg(e.message); }
    setBusy(false);
  }
  return (
    <div>
      <button className={current ? "btn on" : "btn ghost"} onClick={toggle} disabled={busy} aria-pressed={!!current}>
        {current ? "♥ Remove favorite" : "♡ Add to favorites"}
      </button>
      {msg && <p className="hint" role="status">{msg}</p>}
    </div>
  );
}
