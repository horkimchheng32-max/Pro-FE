"use client";
export function Skeletons({ n = 6 }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Loading">
      {Array.from({ length: n }).map((_, i) => <div key={i} className="skeleton sk-card" />)}
    </div>
  );
}
export function ErrorBox({ error, onRetry }) {
  return (
    <div className="notice error" role="alert">
      <strong>Something went wrong</strong>
      <p>{error?.message || "Unexpected error."}{error?.status ? ` (HTTP ${error.status})` : ""}</p>
      {onRetry && <button className="btn ghost" onClick={onRetry}>Try again</button>}
    </div>
  );
}
export function Empty({ text = "Nothing here yet." }) {
  return <div className="notice"><strong>{text}</strong></div>;
}
// Handles loading / error / empty for any useFetch result.
export function Async({ state, empty, children }) {
  const { data, loading, error, reload } = state;
  if (loading) return <Skeletons />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  if (Array.isArray(data) && !data.length) return <Empty text={empty} />;
  return children(data);
}
