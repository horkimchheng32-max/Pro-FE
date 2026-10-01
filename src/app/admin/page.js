"use client";
import { useState } from "react";
import ResourceManager from "@/components/ResourceManager";
import * as sport from "@/api/sportApi";
import * as event from "@/api/eventApi";
import * as cat from "@/api/categoryApi";

const base = [{ name: "name", label: "Name", type: "text", required: true }, { name: "description", label: "Description", type: "textarea" }];
const tabs = {
  Sports: { label: "Sports", api: { list: sport.getSports, create: sport.createSport, update: sport.updateSport, remove: sport.deleteSport },
    fields: [...base, { name: "categoryName", label: "Category", type: "category" }, { name: "imageUrls", label: "Images", type: "images" }] },
  Events: { label: "Events", api: { list: event.getEvents, create: event.createEvent, update: event.updateEvent, remove: event.deleteEvent },
    fields: [...base, { name: "locationName", label: "Location name", type: "text" }, { name: "latitude", label: "Latitude", type: "number" },
      { name: "longitude", label: "Longitude", type: "number" }, { name: "categoryName", label: "Category", type: "category" }, { name: "imageUrls", label: "Images", type: "images" }] },
  Categories: { label: "Categories", api: { list: cat.getCategories, create: cat.createCategory, update: cat.updateCategory, remove: cat.deleteCategory }, fields: base },
};

export default function Admin() {
  const [tab, setTab] = useState("Sports");
  return (
    <section className="wrap page">
      <h1>Admin</h1>
      <p className="lead">Create, update and delete content. There is no authentication in the API, so keep this page private.</p>
      <div className="chips" role="tablist">
        {Object.keys(tabs).map((t) => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "chip on" : "chip"} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      <ResourceManager key={tab} {...tabs[tab]} />
    </section>
  );
}
