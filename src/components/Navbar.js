"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const links = [["/", "Home"], ["/sports", "Sports"], ["/events", "Events"], ["/categories", "Categories"], ["/favorites", "Favorites"], ["/about", "About"], ["/admin", "Admin"]];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { user, ready, signOut } = useAuth();
  const active = (h) => (h === "/" ? path === "/" : path.startsWith(h));
  const close = () => setOpen(false);
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link href="/" className="logo" onClick={close}>SPORT<span>Y</span></Link>
        <nav id="menu" className={open ? "open" : ""} aria-label="Main">
          {links.map(([h, l]) => (
            <Link key={h} href={h} className={active(h) ? "active" : ""} onClick={close}>{l}</Link>
          ))}
          <div className="nav-auth">
            {ready && (user ? (
              <>
                <span className="nav-user" title={user.email}>Hi, {user.name.split(" ")[0]}</span>
                <button className="btn ghost sm" onClick={() => { signOut(); close(); }}>Sign out</button>
              </>
            ) : (
              <>
                <Link href="/signin" className={`btn ghost sm${path === "/signin" ? " on-page" : ""}`} onClick={close}>Sign in</Link>
                <Link href="/signup" className="btn sm" onClick={close}>Sign up</Link>
              </>
            ))}
          </div>
        </nav>
        <div className="nav-tools">
          <ThemeToggle />
          <button className="burger" aria-expanded={open} aria-controls="menu" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            <i /><i /><i />
          </button>
        </div>
      </div>
    </header>
  );
}
