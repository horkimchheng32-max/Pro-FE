"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useFetch } from "@/hooks/useFetch";
import { getSportById, getSports } from "@/api/sportApi";
import { Skeletons, ErrorBox } from "@/components/States";
import { SportCard } from "@/components/Cards";
import FavoriteButton from "@/components/FavoriteButton";
import { imagesOf, categoryOf, idOf } from "@/utils/normalize";

export default function SportDetail() {
  const { uuid } = useParams();
  const s = useFetch(() => getSportById(uuid), [uuid]);
  const all = useFetch(getSports);
  if (s.loading) return <div className="wrap page"><Skeletons n={1} /></div>;
  if (s.error) return <div className="wrap page"><ErrorBox error={s.error} onRetry={s.reload} /></div>;
  const sport = s.data;
  const imgs = imagesOf(sport);
  const related = (all.data || []).filter((x) => idOf(x) !== uuid && categoryOf(x) && categoryOf(x) === categoryOf(sport)).slice(0, 4);
  return (
    <article className="wrap page detail">
      <Link href="/sports" className="link">← All sports</Link>
      <div className="detail-grid">
        <div className="gallery">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {imgs[0] ? <img className="hero-img" src={imgs[0]} alt={sport.name} /> : <div className="hero-img ph" />}
          {imgs.length > 1 && <div className="thumbs">{imgs.slice(1).map((u) => /* eslint-disable-next-line @next/next/no-img-element */ <img key={u} src={u} alt="" />)}</div>}
        </div>
        <div>
          {categoryOf(sport) && <span className="tag">{categoryOf(sport)}</span>}
          <h1>{sport.name}</h1>
          <p className="lead">{sport.description}</p>
          <FavoriteButton kind="sport" uuid={uuid} />
        </div>
      </div>
      {related.length > 0 && (
        <section className="section"><h2>More in {categoryOf(sport)}</h2>
          <div className="grid">{related.map((r) => <SportCard key={idOf(r)} sport={r} />)}</div>
        </section>
      )}
    </article>
  );
}
