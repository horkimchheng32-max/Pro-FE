import Link from "next/link";
import { idOf, imageOf, categoryOf } from "@/utils/normalize";

function Media({ item }) {
  const src = imageOf(item);
  // eslint-disable-next-line @next/next/no-img-element
  return <div className="media">{src ? <img src={src} alt={item.name || ""} loading="lazy" /> : <span className="ph">{(item.name || "?")[0]}</span>}</div>;
}
export function SportCard({ sport }) {
  return (
    <Link href={`/sports/${idOf(sport)}`} className="card">
      <Media item={sport} />
      <div className="body">
        {categoryOf(sport) && <span className="tag">{categoryOf(sport)}</span>}
        <h3>{sport.name}</h3>
        <p className="clamp">{sport.description}</p>
      </div>
    </Link>
  );
}
export function EventCard({ event }) {
  return (
    <Link href={`/events/${idOf(event)}`} className="card">
      <Media item={event} />
      <div className="body">
        {categoryOf(event) && <span className="tag">{categoryOf(event)}</span>}
        <h3>{event.name}</h3>
        <p className="clamp">{event.description}</p>
        {(event.locationName || event.latitude != null) && (
          <p className="meta">📍 {event.locationName}{event.latitude != null && ` · ${event.latitude}, ${event.longitude}`}</p>
        )}
      </div>
    </Link>
  );
}
export function CategoryCard({ category }) {
  return (
    <Link href={`/sports?category=${encodeURIComponent(category.name)}`} className="card cat">
      <div className="body">
        <h3>{category.name}</h3>
        <p className="clamp">{category.description}</p>
        <span className="meta">Browse sports →</span>
      </div>
    </Link>
  );
}
