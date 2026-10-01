"use client";
import { useFetch } from "@/hooks/useFetch";
import { getCategories } from "@/api/categoryApi";
import { Async } from "@/components/States";
import { CategoryCard } from "@/components/Cards";
export default function CategoriesPage() {
  const state = useFetch(getCategories);
  return (
    <section className="wrap page">
      <h1>Categories</h1>
      <p className="lead">Pick a category to filter sports. Events can be filtered on their page.</p>
      <Async state={state} empty="No categories yet.">
        {(l) => <div className="grid">{l.map((c) => <CategoryCard key={c.uuid || c.name} category={c} />)}</div>}
      </Async>
    </section>
  );
}
