"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [["/", "Home"], ["/sports", "Sports"], ["/events", "Events"], ["/categories", "Categories"], ["/favorites", "Favorites"], ["/admin", "Admin"]];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (h) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>SPORT<span>Y</span></Link>
        <button className="burger" aria-expanded={open} aria-controls="menu" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          <i /><i /><i />
        </button>
        <nav id="menu" className={open ? "open" : ""} aria-label="Main">
          {links.map(([h, l]) => (
            <Link key={h} href={h} className={active(h) ? "active" : ""} onClick={() => setOpen(false)}>{l}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
