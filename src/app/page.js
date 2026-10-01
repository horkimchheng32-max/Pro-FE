"use client";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { getSports } from "@/api/sportApi";
import { getEvents } from "@/api/eventApi";
import { getCategories } from "@/api/categoryApi";
import { Async } from "@/components/States";
import { SportCard, EventCard, CategoryCard } from "@/components/Cards";

function Section({ title, href, state, empty, children }) {
  return (
    <section className="wrap section">
      <div className="bar"><h2>{title}</h2><Link href={href} className="link">View all →</Link></div>
      <Async state={state} empty={empty}>{(l) => <div className="grid">{children(l.slice(0, 4))}</div>}</Async>
    </section>
  );
}

export default function Home() {
  const sports = useFetch(getSports);
  const events = useFetch(getEvents);
  const cats = useFetch(getCategories);
  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <p className="kicker">Sports · Events · Community</p>
            <h1>Find your game.<br /><em>Show up.</em></h1>
            <p className="lead">Browse sports, discover events near you and join the conversation.</p>
            <div className="row">
              <Link href="/events" className="btn">Explore events</Link>
              <Link href="/sports" className="btn ghost">Browse sports</Link>
            </div>
          </div>
          <svg className="pitch" viewBox="0 0 200 200" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="100" cy="100" r="70" /><circle cx="100" cy="100" r="4" fill="currentColor" />
            <path d="M30 100h140M10 60h30v80H10M190 60h-30v80h30" />
          </svg>
        </div>
      </section>
      <Section title="Featured sports" href="/sports" state={sports} empty="No sports yet.">
        {(l) => l.map((s) => <SportCard key={s.uuid || s.id} sport={s} />)}
      </Section>
      <Section title="Popular events" href="/events" state={events} empty="No events yet.">
        {(l) => l.map((e) => <EventCard key={e.uuid || e.id} event={e} />)}
      </Section>
      <Section title="Categories" href="/categories" state={cats} empty="No categories yet.">
        {(l) => l.map((c) => <CategoryCard key={c.uuid || c.name} category={c} />)}
      </Section>
    </>
  );
}
