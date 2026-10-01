"use client";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { getCategories } from "@/api/categoryApi";
import { idOf, imagesOf, categoryOf } from "@/utils/normalize";
import { Async } from "./States";
import ImageUpload from "./ImageUpload";

// Generic admin CRUD. fields: [{ name, label, type: text|textarea|number|category|images, required }]
export default function ResourceManager({ label, api, fields }) {
  const list = useFetch(api.list);
  const cats = useFetch(getCategories);
  const [editing, setEditing] = useState(null); // item | "new" | null
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  function open(item) {
    setMsg("");
    setEditing(item);
    const f = {};
    fields.forEach((x) => {
      f[x.name] = item === "new" ? (x.type === "images" ? [] : "")
        : x.type === "images" ? imagesOf(item)
        : x.name === "categoryName" ? categoryOf(item)
        : item[x.name] ?? "";
    });
    setForm(f);
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true); setMsg("");
    const body = {};
    fields.forEach((x) => {
      const v = form[x.name];
      if (x.type === "images") { if (v.length) body[x.name] = v; }
      else if (v !== "" && v != null) body[x.name] = x.type === "number" ? Number(v) : v;
    });
    try {
      editing === "new" ? await api.create(body) : await api.update(idOf(editing), body);
      setEditing(null); list.reload();
    } catch (err) { setMsg(err.message); }
    setBusy(false);
  }
  async function remove(item) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try { await api.remove(idOf(item)); list.reload(); } catch (err) { setMsg(err.message); }
  }
  const set = (n, v) => setForm((f) => ({ ...f, [n]: v }));

  return (
    <div>
      <div className="bar">
        <h2>{label}</h2>
        <button className="btn" onClick={() => open("new")}>+ New</button>
      </div>
      {msg && !editing && <p className="hint error-text" role="alert">{msg}</p>}
      {editing && (
        <form className="form panel" onSubmit={save}>
          <h3>{editing === "new" ? "Create" : "Update"} {label.toLowerCase()}</h3>
          {fields.map((x) => (
            <div key={x.name} className="field">
              <label htmlFor={`f-${x.name}`}>{x.label}</label>
              {x.type === "textarea" ? (
                <textarea id={`f-${x.name}`} rows={3} value={form[x.name]} required={x.required} onChange={(e) => set(x.name, e.target.value)} />
              ) : x.type === "images" ? (
                <ImageUpload value={form[x.name]} onChange={(v) => set(x.name, v)} />
              ) : x.type === "category" ? (
                <select id={`f-${x.name}`} value={form[x.name]} onChange={(e) => set(x.name, e.target.value)}>
                  <option value="">— choose —</option>
                  {(cats.data || []).map((c) => <option key={c.uuid || c.name}>{c.name}</option>)}
                </select>
              ) : (
                <input id={`f-${x.name}`} type={x.type === "number" ? "number" : "text"} step="any" value={form[x.name]} required={x.required} onChange={(e) => set(x.name, e.target.value)} />
              )}
            </div>
          ))}
          {msg && <p className="hint error-text" role="alert">{msg}</p>}
          <div className="row">
            <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            <button type="button" className="btn ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}
      <Async state={list} empty={`No ${label.toLowerCase()} yet.`}>
        {(items) => (
          <ul className="rows">
            {items.map((it) => (
              <li key={idOf(it)}>
                <span><b>{it.name}</b> <small>{categoryOf(it)}</small></span>
                <span className="row">
                  <button className="btn ghost sm" onClick={() => open(it)}>Edit</button>
                  <button className="btn danger sm" onClick={() => remove(it)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Async>
    </div>
  );
}
