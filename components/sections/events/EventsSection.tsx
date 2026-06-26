"use client";

import { useRef, useState, useEffect } from "react";
import { useLang } from "@/lib/LanguageContext";
import EventCard from "@/components/sections/events/EventCard";
import PastEventsGrid from "@/components/sections/events/PastEventsGrid";
import Button from "@/components/ui/Button";
import { useInView } from "@/hooks/useInView";
import type { ApiEventItem } from "@/app/api/events/route";
import type { EventItem } from "@/types/events";

const DESKTOP_BP = 970;
const WIDE_BP = 1500;
const GAP_DESKTOP = 24;
const GAP_MOBILE = 16;

function formatDate(isoDate: string | null, lang: "en" | "br", fallback: string): string {
  if (!isoDate) return fallback;
  const locale = lang === "br" ? "pt-BR" : "en-US";
  const d = new Date(isoDate);
  const opts = { timeZone: "America/Sao_Paulo" } as const;
  const day = d.toLocaleDateString(locale, { day: "2-digit", ...opts });
  const month = d.toLocaleDateString(locale, { month: "short", ...opts });
  const year = d.toLocaleDateString(locale, { year: "numeric", ...opts });
  return lang === "br" ? `${day} ${month} ${year}` : `${month} ${day}, ${year}`;
}

function toEventItem(ev: ApiEventItem, lang: "en" | "br", dateUnknown: string): EventItem {
  return { ...ev, date: formatDate(ev.start_date, lang, dateUnknown) };
}

function CarouselSkeleton() {
  return (
    <div className="overflow-x-hidden md:px-site">
      <div className="flex gap-4 md:gap-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[calc(100vw-80px)] md:w-[calc((100%-48px)/3)] min-[1500px]:w-[calc((100%-72px)/4)] max-w-[360px] animate-pulse"
          >
            <div className="w-full rounded-2xl bg-[#F0F0F0]" style={{ aspectRatio: "1/1" }} />
            <div className="bg-[#F5F5F5] rounded-2xl mt-1 p-6 flex flex-col gap-3 h-[200px]">
              <div className="h-5 bg-[#E8E8E8] rounded-full w-3/4" />
              <div className="h-3 bg-[#E8E8E8] rounded-full w-full" />
              <div className="h-3 bg-[#E8E8E8] rounded-full w-5/6" />
              <div className="h-3 bg-[#E8E8E8] rounded-full mt-auto w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoUpcomingEvents({ text, buttonLabel, onSeeAll }: {
  text: string;
  buttonLabel: string;
  onSeeAll: () => void;
}) {
  return (
    <div className="px-6 md:px-site py-16 flex flex-col items-center gap-5 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
          <rect x="3" y="6" width="22" height="19" rx="3" stroke="#B0B0B0" strokeWidth="1.5" />
          <path d="M3 11h22" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9 3v4M19 3v4" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="14" cy="18" r="1.5" fill="#B0B0B0" />
        </svg>
      </div>
      <p className="text-[#6B6B6B] text-base max-w-xs" style={{ fontFamily: "var(--font-dm-sans)" }}>
        {text}
      </p>
      <Button variant="primary" onClick={onSeeAll} showArrow>
        {buttonLabel}
      </Button>
    </div>
  );
}

export default function EventsSection() {
  const { t, lang } = useLang();
  const [apiItems, setApiItems] = useState<ApiEventItem[] | null>(null);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    fetch("/api/events?type=upcoming&limit=20")
      .then((r) => r.json())
      .then((data) => { setApiItems(data.items ?? []); })
      .catch(() => { setApiItems([]); });
  }, []);

  const isLoading = apiItems === null;
  const hasUpcoming = !isLoading && apiItems.length > 0;
  const events: EventItem[] = apiItems?.map((ev) => toEventItem(ev, lang, t.events.dateUnknown)) ?? [];

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useInView<HTMLElement>(0.1);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function update() {
      if (!el) return;
      setCanPrev(el.scrollLeft > 1);
      setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [hasUpcoming, showPast]);

  function getScrollAmount(): number {
    const el = scrollRef.current;
    if (!el) return 300;
    const style = window.getComputedStyle(el);
    const contentW = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const isWide = window.innerWidth >= WIDE_BP;
    const isDesktop = window.innerWidth >= DESKTOP_BP;
    const visible = isWide ? 4 : isDesktop ? 3 : 1;
    const gap = isDesktop ? GAP_DESKTOP : GAP_MOBILE;
    return (contentW - (visible - 1) * gap) / visible + gap;
  }
  function prev() { scrollRef.current?.scrollBy({ left: -getScrollAmount(), behavior: "smooth" }); }
  function next() { scrollRef.current?.scrollBy({ left: getScrollAmount(), behavior: "smooth" }); }

  const showToggle = hasUpcoming;
  const toggleLabel = showPast ? t.events.seeUpcoming : t.events.seeAll;

  return (
    <section ref={animRef} id="events" className="anim-wrap w-full bg-white pt-20 pb-20">
      {/* ── Header row ── */}
      <div className="px-6 md:px-site mb-10 md:mb-14">
        <div className="flex flex-col gap-6 items-center text-center md:text-left md:items-stretch md:flex-row md:items-end md:justify-between">
          <h2
            className="anim-fade-up text-[#1A1A1A] font-normal leading-[1.1] max-w-[600px]"
            style={{
              fontFamily: "var(--font-schibsted)",
              fontSize: "clamp(2rem,3.33vw,3rem)",
            }}
          >
            {t.events.sectionTitle}
          </h2>

          <div className="anim-fade-up anim-d1 flex items-center justify-center md:justify-start gap-3 flex-shrink-0">
            {showToggle && (
              <Button variant="primary" onClick={() => setShowPast((v) => !v)} showArrow>
                {toggleLabel}
              </Button>
            )}

            {!showPast && hasUpcoming && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  disabled={!canPrev}
                  aria-label={t.events.prevLabel}
                  className="hidden md:flex w-12 h-12 rounded-full border border-[#1A1A1A] items-center justify-center transition-colors hover:bg-[#F5F5F5] disabled:opacity-30 disabled:pointer-events-none"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M10 4L6 8l4 4" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={next}
                  disabled={!canNext}
                  aria-label={t.events.nextLabel}
                  className="hidden md:flex w-12 h-12 rounded-full bg-[#1A1A1A] text-white items-center justify-center transition-colors hover:bg-[#333] disabled:opacity-30 disabled:pointer-events-none"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M6 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Carousel / loading skeleton / empty state ── */}
      {!showPast && (
        <>
          {isLoading && <CarouselSkeleton />}

          {!isLoading && events.length === 0 && (
            <NoUpcomingEvents
              text={t.events.noUpcoming}
              buttonLabel={t.events.seeAll}
              onSeeAll={() => setShowPast(true)}
            />
          )}

          {!isLoading && events.length > 0 && (
            <div
              ref={scrollRef}
              className="events-carousel overflow-x-auto pb-10"
            >
              <div
                className={[
                  "flex gap-4 md:gap-6",
                  events.length === 1 ? "justify-center" : "",
                ].filter(Boolean).join(" ")}
              >
                {events.map((ev, i) => (
                  <div
                    key={i}
                    className={[
                      "anim-fade-up flex-shrink-0",
                      "w-[calc(100vw-80px)] min-[550px]:w-[calc((100vw-2*var(--site-pad)-16px)/2)] md:w-[calc((100vw-2*var(--site-pad)-48px)/3)] md:max-w-[360px] min-[1500px]:w-[calc((100vw-2*var(--site-pad)-72px)/4)]",
                      events.length > 1 && i === 0 ? "ml-6 min-[550px]:ml-[var(--site-pad)]" : "",
                    ].filter(Boolean).join(" ")}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <EventCard {...ev} goToLabel={t.events.goToEvent} />
                  </div>
                ))}
                {events.length > 1 && (
                  <div className="flex-shrink-0 w-2 min-[550px]:w-[calc(var(--site-pad)-16px)] md:w-[calc(var(--site-pad)-24px)]" aria-hidden />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Past events grid ── */}
      {showPast && <PastEventsGrid />}
    </section>
  );
}
