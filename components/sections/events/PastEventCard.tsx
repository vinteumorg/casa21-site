"use client";

import Image from "next/image";
import type { EventItem } from "@/types/events";

interface PastEventCardProps extends EventItem {
  goToLabel: string;
}

export default function PastEventCard({
  title,
  location,
  date,
  image,
  href,
  goToLabel,
}: PastEventCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} — ${goToLabel}`}
      className="group flex gap-4 bg-white rounded-2xl p-3 transition-shadow hover:shadow-md"
      style={{ boxShadow: "0 2px 8px rgba(27,26,26,0.08)" }}
    >
      <div className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <p className="text-[#1A1A1A] text-sm font-medium leading-snug line-clamp-2"
          style={{ fontFamily: "var(--font-schibsted)" }}>
          {title}
        </p>
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="text-[#6B6B6B] text-xs truncate"
            style={{ fontFamily: "var(--font-dm-sans)" }}>
            {date}{location ? ` · ${location}` : ""}
          </span>
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#25A273] group-hover:bg-[#1e9062] flex items-center justify-center transition-colors">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="white" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}
