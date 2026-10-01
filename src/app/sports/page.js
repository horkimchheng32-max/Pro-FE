"use client";
import Browse from "@/components/Browse";
import { SportCard } from "@/components/Cards";
import { getSports } from "@/api/sportApi";
export default function SportsPage() {
  return <Browse title="Sports" intro="Gear, disciplines and everything in between." fetcher={getSports} Card={SportCard} prop="sport" searchHint="Search sports…" />;
}
