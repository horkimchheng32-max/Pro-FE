"use client";
import { useState } from "react";
import { uploadImage } from "@/api/uploadApi";
import { findUrl } from "@/utils/normalize";

// value: array of image URLs. Upload via POST /upload, or paste a URL manually.
export default function ImageUpload({ value = [], onChange }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [url, setUrl] = useState("");

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setMsg("");
    try {
      const res = await uploadImage(file);
      const u = findUrl(res);
      if (!u) throw new Error("Upload succeeded but no image URL was found in the response.");
      onChange([...value, u]);
    } catch (err) { setMsg(`${err.message}. You can paste an image URL below instead.`); }
    setBusy(false);
    e.target.value = "";
  }
  return (
    <div className="upload">
      <input type="file" accept="image/*" onChange={onFile} disabled={busy} aria-label="Upload image" />
      {busy && <p className="hint">Uploading…</p>}
      {msg && <p className="hint error-text" role="alert">{msg}</p>}
      <div className="row">
        <input type="url" placeholder="or paste image URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button type="button" className="btn ghost" onClick={() => { if (url) { onChange([...value, url]); setUrl(""); } }}>Add</button>
      </div>
      <div className="thumbs">
        {value.map((u, i) => (
          <figure key={u + i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" />
            <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((_, j) => j !== i))}>×</button>
          </figure>
        ))}
      </div>
    </div>
  );
}
