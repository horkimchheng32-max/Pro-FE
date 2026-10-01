import Link from "next/link";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <div className="foot-brand">
          <Link href="/" className="logo">SPORT<span>Y</span></Link>
          <p>Sports, events and the people who show up.</p>
        </div>

        <nav className="foot-links" aria-label="Footer">
          <Link href="/sports">Sports</Link>
          <Link href="/events">Events</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/about">About</Link>
        </nav>

        <div className="sponsor">
          <span className="sponsor-label">Sponsored by</span>
          <a href="https://istad.co" target="_blank" rel="noopener noreferrer" className="sponsor-logo" aria-label="ISTAD – Institute of Science and Technology Advanced Development">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/istad-logo.png" alt="ISTAD" width="900" height="325" />
          </a>
        </div>
      </div>
      <div className="wrap foot-bottom">© {new Date().getFullYear()} Sporty · Powered by the Sport API</div>
    </footer>
  );
}
