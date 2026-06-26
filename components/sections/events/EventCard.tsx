"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import type { EventItem } from "@/types/events";
import { generateEventTopClip, generateEventBottomClip } from "@/lib/clipPaths/events";

const BADGE_PAD = 8;
const BTN_PAD = 21;

interface EventCardProps extends EventItem {
  goToLabel: string;
}

export default function EventCard({
  category,
  title,
  description,
  location,
  date,
  image,
  href,
  goToLabel,
}: EventCardProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const topEl = topRef.current;
    const badgeEl = badgeRef.current;
    const bottomEl = bottomRef.current;
    const buttonEl = buttonRef.current;
    if (!topEl || !badgeEl || !bottomEl || !buttonEl) return;

    function update() {
      if (!topEl || !badgeEl || !bottomEl || !buttonEl) return;

      const topRect = topEl.getBoundingClientRect();
      const badgeRect = badgeEl.getBoundingClientRect();
      const notchW = badgeRect.right - topRect.left + BADGE_PAD;
      const notchH = badgeRect.bottom - topRect.top + BADGE_PAD;
      topEl.style.clipPath = `path('${generateEventTopClip(topRect.width, topRect.height, notchW, notchH)}')`;
      topEl.style.borderRadius = "0";
      topEl.style.overflow = "visible";

      const cardRect = bottomEl.getBoundingClientRect();
      const btnRect = buttonEl.getBoundingClientRect();
      const btnNotchW = cardRect.right - btnRect.left + BTN_PAD;
      const btnNotchH = cardRect.bottom - btnRect.top + BTN_PAD;
      bottomEl.style.clipPath = `path('${generateEventBottomClip(cardRect.width, cardRect.height, btnNotchW, btnNotchH)}')`;
      bottomEl.style.borderRadius = "0";
      bottomEl.style.overflow = "visible";
    }

    update();
    const ro = new ResizeObserver(update);
    ro.observe(topEl);
    ro.observe(badgeEl);
    ro.observe(bottomEl);
    ro.observe(buttonEl);
    return () => ro.disconnect();
  }, []);

  return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block select-none"
        aria-label={title}
      >
        {/* ── Top: image with badge notch ── */}
        <div className="relative">
          <div
            ref={topRef}
            className="event-card-top relative w-full overflow-hidden"
            style={{ aspectRatio: "1 / 1" }}
          >
            <Image src={image} alt={title} fill className="object-cover" />
          </div>

          {/* Badge floats in the clip notch */}
          <div
            ref={badgeRef}
            className="font-sans absolute top-0 left-0 bg-[#1A1A1A] text-white text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap z-10"
          >
            {date}
          </div>
        </div>

        {/* ── Bottom: white card with concave corner notch ── */}
        <div className="relative">
          {/* Shadow wrapper — filter on parent so drop-shadow follows the clip shape */}
          <div style={{ filter: "drop-shadow(0 4px 12px rgba(27, 26, 26, 0.12))" }}>
            <div
              ref={bottomRef}
              className="event-card-bottom relative bg-white w-full h-[200px]"
            >
              <div className="font-sans flex flex-col gap-3 px-6 pt-6 pb-4">
                <h3 className="font-heading text-[#1A1A1A] font-medium text-lg leading-snug">
                  {title}
                </h3>
                <p className="text-[#6B6B6B] text-sm leading-relaxed line-clamp-3">
                  {description}
                </p>
              </div>
            </div>
          </div>

          <span
            ref={buttonRef}
            aria-hidden
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#25A273] flex items-center justify-center z-10"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M3 7h8M8 4l3 3-3 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </a>
  );
}
