"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm({ mode }) {
  const isUp = mode === "signup";
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (isUp) {
      if (f.name.trim().length < 2) return setError("Please enter your name.");
      if (f.password.length < 8) return setError("Password must be at least 8 characters.");
      if (f.password !== f.confirm) return setError("Passwords do not match.");
    }
    setBusy(true);
    try {
      await (isUp ? signUp(f) : signIn(f));
      router.push("/");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <section className="wrap page auth-page">
      <form className="panel auth-card form" onSubmit={submit} noValidate>
        <p className="kicker">{isUp ? "Join the team" : "Welcome back"}</p>
        <h1 className="auth-title">{isUp ? <>Create <em>account</em></> : <>Sign <em>in</em></>}</h1>

        {isUp && (
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" autoComplete="name" value={f.name} onChange={set("name")} required />
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" value={f.email} onChange={set("email")} required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete={isUp ? "new-password" : "current-password"} value={f.password} onChange={set("password")} required />
        </div>
        {isUp && (
          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" type="password" autoComplete="new-password" value={f.confirm} onChange={set("confirm")} required />
          </div>
        )}

        {error && <p className="error-text" role="alert">{error}</p>}

        <button className="btn" disabled={busy}>{busy ? "Please wait…" : isUp ? "Sign up" : "Sign in"}</button>
        <p className="hint">
          {isUp ? "Already have an account? " : "New to Sporty? "}
          <Link href={isUp ? "/signin" : "/signup"} className="link">{isUp ? "Sign in" : "Sign up"}</Link>
        </p>
      </form>
    </section>
  );
}
