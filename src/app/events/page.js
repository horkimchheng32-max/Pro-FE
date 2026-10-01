"use client";
import Browse from "@/components/Browse";
import { EventCard } from "@/components/Cards";
import { getEvents } from "@/api/eventApi";
export default function EventsPage() {
  return <Browse title="Events" intro="Courts, grounds and matches happening around you." fetcher={getEvents} Card={EventCard} prop="event" searchHint="Search by name or location…" />;
}
