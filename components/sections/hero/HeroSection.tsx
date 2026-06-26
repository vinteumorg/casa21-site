"use client";

import { useRef, useLayoutEffect, type RefObject } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LanguageContext";
import { generateHeroClipPath, generateHeroMobileClipPath } from "@/lib/clipPaths/hero";

const DESKTOP_BP = 970;

interface HeroSectionProps {
  pillRef: RefObject<HTMLElement | null>;
}

export default function HeroSection({ pillRef }: HeroSectionProps) {
  const { t } = useLang();
  const heroRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const pill = pillRef.current;
    if (!hero) return;

    function update() {
      if (!hero) return;
      const hR = hero.getBoundingClientRect();
      const W = hR.width;
      const H = hR.height;

      if (window.innerWidth >= DESKTOP_BP && pill) {
        // Desktop: full notch clip driven by pill position
        const pR = pill.getBoundingClientRect();
        hero.style.clipPath = `path('${generateHeroClipPath(
          W, H,
          pR.left - hR.left,
          pR.right - hR.left,
          pR.bottom - hR.top,
        )}')`;
      } else {
        hero.style.clipPath = `path('${generateHeroMobileClipPath(W, H)}')`;
      }
      hero.style.borderRadius = "0";
      hero.style.overflow = "visible";
    }

    update();

    const ro = new ResizeObserver(update);
    ro.observe(hero);
    if (pill) ro.observe(pill);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [pillRef]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero-section relative w-full h-auto md:h-[98vh] m-2 md:mt-0 max-w-[calc(100%-1rem)]"
    >
      {/* Background image — anchored to top */}
      <div className="absolute inset-0">
        <Image
          src="/home/image.png"
          alt="Casa21 building in São Paulo"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="hero-content mt-2 relative z-10 flex flex-col md:h-full px-6 md:px-site pt-[88px] md:pt-[clamp(200px,20vh,350px)] pb-28 md:pb-[clamp(40px,6vh,80px)] max-w-[clamp(720px,66%,1400px)]">
        <h1
          className="hero-title-text hero-enter text-white text-[clamp(2.25rem,5.5vw,4.5rem)] font-normal leading-[1.1] mb-5"
          style={{ fontFamily: "var(--font-schibsted)" }}
        >
          {t.hero.title}
        </h1>

        <p
          className="hero-subtitle-text hero-enter hero-enter-d1 text-white/80 text-[clamp(0.875rem,1.25vw,1.125rem)] font-medium leading-relaxed mb-8 max-w-[520px]"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {t.hero.subtitle}
        </p>

        <div className="hero-enter hero-enter-d2">
          <a
            href="#builders"
            className="inline-flex items-center gap-2.5 bg-[#25A273] hover:bg-[#1e9062] active:bg-[#187a53] text-white font-bold text-sm px-7 py-4 rounded-full transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {t.hero.cta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Scroll indicator — mobile: arrow-only circle ── */}
      <div className="hero-enter hero-enter-d3 absolute bottom-8 right-6 z-10 md:hidden">
        <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center">
          <span className="scroll-bounce inline-flex">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 3v10M4 9l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Scroll indicator — desktop: Scroll circle + overlapping arrow circle ── */}
      <div className="hero-enter hero-enter-d3 absolute bottom-10 right-10 z-10 hidden md:flex flex-col items-center">
        <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center shadow-sm">
          <span
            className="text-black font-bold text-lg tracking-wide select-none"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {t.hero.scroll}
          </span>
        </div>
        <div className="w-[120px] h-[120px] rounded-full border border-white/55 flex items-center justify-center -mt-[52px]">
          <span className="scroll-bounce inline-flex">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path d="M11 4v14M5 12l6 6 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
