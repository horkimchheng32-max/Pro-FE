"use client";
import { useFetch } from "@/hooks/useFetch";
import { getFavorites } from "@/api/favoriteApi";
import { getSports } from "@/api/sportApi";
import { getEvents } from "@/api/eventApi";
import { Async } from "@/components/States";
import { SportCard, EventCard } from "@/components/Cards";
import { idOf } from "@/utils/normalize";

// Favorite item shape is unverified: accept embedded sport/event objects, or resolve by sportUuid/eventUuid.
async function load() {
  const favs = await getFavorites();
  const [sports, events] = await Promise.all([getSports().catch(() => []), getEvents().catch(() => [])]);
  return favs.map((f) => {
    const sport = f.sport || sports.find((s) => idOf(s) === f.sportUuid);
    const event = f.event || events.find((e) => idOf(e) === f.eventUuid);
    return { key: f.uuid || f.id || `${f.sportUuid}${f.eventUuid}`, sport, event };
  });
}
export default function FavoritesPage() {
  const state = useFetch(load);
  return (
    <section className="wrap page">
      <h1>Favorites</h1>
      <p className="lead">Your saved sports and events.</p>
      <Async state={state} empty="No favorites yet.">
        {(l) => (
          <div className="grid">
            {l.map((f) => f.sport ? <SportCard key={f.key} sport={f.sport} /> : f.event ? <EventCard key={f.key} event={f.event} /> : null)}
          </div>
        )}
      </Async>
    </section>
  );
}
