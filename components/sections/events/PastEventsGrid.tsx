"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/LanguageContext";
import type { ApiEventItem } from "@/app/api/events/route";
import type { EventItem } from "@/types/events";
import PastEventCard from "@/components/sections/events/PastEventCard";
import Button from "@/components/ui/Button";

const LIMIT = 10;

function formatDate(isoDate: string | null, lang: "en" | "br"): string {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const day = d.toLocaleDateString("en-US", { day: "2-digit", timeZone: "America/Sao_Paulo" });
  const month = d.toLocaleDateString("en-US", { month: "short", timeZone: "America/Sao_Paulo" });
  const year = d.getFullYear();
  return lang === "br" ? `${day} ${month} ${year}` : `${month} ${day}, ${year}`;
}

function toEventItem(ev: ApiEventItem, lang: "en" | "br"): EventItem {
  return { ...ev, date: formatDate(ev.start_date, lang) };
}

export default function PastEventsGrid() {
  const { t, lang } = useLang();
  const [items, setItems] = useState<ApiEventItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(LIMIT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events?type=past&offset=0&limit=${LIMIT}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function loadMore() {
    setLoading(true);
    fetch(`/api/events?type=past&offset=${offset}&limit=${LIMIT}`)
      .then((r) => r.json())
      .then((data) => {
        setItems((prev) => [...prev, ...(data.items ?? [])]);
        setOffset((o) => o + LIMIT);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  const hasMore = items.length < total;

  return (
    <div className="px-6 md:px-site mt-14">
      <div className="w-full h-px bg-[#E8E8E8] mb-12" />

      <h3
        className="text-[#1A1A1A] font-normal mb-8"
        style={{
          fontFamily: "var(--font-schibsted)",
          fontSize: "clamp(1.5rem,2.5vw,2rem)",
        }}
      >
        {t.events.pastTitle}
      </h3>

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[104px] rounded-2xl bg-[#F5F5F5] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((ev) => (
            <PastEventCard
              key={ev.href}
              {...toEventItem(ev, lang)}
              goToLabel={t.events.goToEvent}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button variant="secondary" onClick={loadMore} showArrow>
            {loading ? "..." : t.events.loadMore}
          </Button>
        </div>
      )}
    </div>
  );
}
