"use client";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { getCategories } from "@/api/categoryApi";
import { categoryOf } from "@/utils/normalize";
import { Async } from "./States";

// Shared list page: search + category filter. `fetcher` returns an array, `Card` renders one item.
export default function Browse({ title, intro, fetcher, Card, prop, searchHint }) {
  const state = useFetch(fetcher);
  const cats = useFetch(getCategories); // if this fails the page still works, just without chips
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  useEffect(() => { setCat(new URLSearchParams(window.location.search).get("category") || ""); }, []);

  const filter = (list) => list.filter((x) => {
    const hay = `${x.name} ${x.description} ${x.locationName || ""}`.toLowerCase();
    return hay.includes(q.toLowerCase()) && (!cat || categoryOf(x).toLowerCase() === cat.toLowerCase());
  });

  return (
    <section className="wrap page">
      <h1>{title}</h1>
      <p className="lead">{intro}</p>
      <div className="filters">
        <label className="sr" htmlFor="q">Search</label>
        <input id="q" type="search" placeholder={searchHint} value={q} onChange={(e) => setQ(e.target.value)} />
        {Array.isArray(cats.data) && (
          <div className="chips" role="group" aria-label="Filter by category">
            <button className={!cat ? "chip on" : "chip"} onClick={() => setCat("")}>All</button>
            {cats.data.map((c) => (
              <button key={c.uuid || c.name} className={cat === c.name ? "chip on" : "chip"} onClick={() => setCat(c.name)}>{c.name}</button>
            ))}
          </div>
        )}
      </div>
      <Async state={state} empty={`No ${title.toLowerCase()} yet.`}>
        {(list) => {
          const shown = filter(list);
          return shown.length ? (
            <div className="grid">{shown.map((x) => <Card key={x.uuid || x.id} {...{ [prop]: x }} />)}</div>
          ) : <div className="notice"><strong>No matches</strong><p>Try a different search or category.</p></div>;
        }}
      </Async>
    </section>
  );
}
