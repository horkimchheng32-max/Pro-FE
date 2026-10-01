"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { getEventById } from "@/api/eventApi";
import { Skeletons, ErrorBox } from "@/components/States";
import Comments from "@/components/Comments";
import FavoriteButton from "@/components/FavoriteButton";
import { imagesOf, categoryOf } from "@/utils/normalize";

export default function EventDetail() {
  const { uuid } = useParams();
  const s = useFetch(() => getEventById(uuid), [uuid]);
  if (s.loading) return <div className="wrap page"><Skeletons n={1} /></div>;
  if (s.error) return <div className="wrap page"><ErrorBox error={s.error} onRetry={s.reload} /></div>;
  const ev = s.data;
  const img = imagesOf(ev)[0];
  const lat = Number(ev.latitude), lng = Number(ev.longitude);
  const hasCoords = ev.latitude != null && ev.longitude != null && !isNaN(lat) && !isNaN(lng);
  const d = 0.01;
  return (
    <article className="wrap page detail">
      <Link href="/events" className="link">← All events</Link>
      <div className="detail-grid">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {img ? <img className="hero-img" src={img} alt={ev.name} /> : <div className="hero-img ph" />}
        <div>
          {categoryOf(ev) && <span className="tag">{categoryOf(ev)}</span>}
          <h1>{ev.name}</h1>
          <p className="lead">{ev.description}</p>
          <dl className="facts">
            {ev.locationName && <><dt>Location</dt><dd>{ev.locationName}</dd></>}
            {hasCoords && <><dt>Latitude</dt><dd>{lat}</dd><dt>Longitude</dt><dd>{lng}</dd></>}
          </dl>
          <FavoriteButton kind="event" uuid={uuid} />
        </div>
      </div>
      {hasCoords && (
        <iframe className="map" title={`Map of ${ev.locationName || ev.name}`} loading="lazy"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - d},${lat - d},${lng + d},${lat + d}&marker=${lat},${lng}&layer=mapnik`} />
      )}
      <Comments eventUuid={uuid} />
    </article>
  );
}
