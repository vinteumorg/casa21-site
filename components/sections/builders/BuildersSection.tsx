"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LanguageContext";
import Button from "@/components/ui/Button";
import { useInView } from "@/hooks/useInView";
import {
  generateBuildersDesktopClipPath,
  generateBuildersMobileClipPath,
} from "@/lib/clipPaths/builders";

const BG_ASPECT = 1757 / 1593;
const MOBILE_BREAKPOINT = 768;

export default function BuildersSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLImageElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const animRef = useInView<HTMLDivElement>(0.1);

  useLayoutEffect(() => {
    const container = imageRef.current;
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!container) return;

    function update() {
      if (!container) return;

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      container.style.aspectRatio = isMobile ? "398 / 480" : "1280 / 680";

      const { width: W, height: H } = container.getBoundingClientRect();
      container.style.clipPath = isMobile
        ? `path('${generateBuildersMobileClipPath(W, H)}')`
        : `path('${generateBuildersDesktopClipPath(W, H)}')`;
      container.style.borderRadius = "0";
      container.style.overflow = "visible";

      if (bg && section) {
        const sectionRect = section.getBoundingClientRect();
        const bgWidth = bg.offsetWidth;
        const bgH = bgWidth * BG_ASPECT;
        bg.style.top = `${(sectionRect.height - bgH) / 2}px`;
      }
    }

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    if (section) ro.observe(section);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="builders"
      className="relative w-full bg-white overflow-hidden pt-20 md:pt-[clamp(60px,7vw,120px)] pb-0"
    >
      {/* Background decoration — left-0, vertical position driven by JS to track image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={bgRef}
        src="/meet-builders/background.svg"
        alt=""
        aria-hidden
        className="absolute left-0 w-full h-auto pointer-events-none select-none"
        style={{ zIndex: 0, top: 0 }}
      />

      {/* ── Title (row 1) + Subtitle (row 2) + Image ── */}
      <div
        ref={animRef}
        className="anim-wrap relative z-10 flex flex-col px-6 md:px-site"
      >
        {/* Row 1 — title, left-aligned */}
        <div>
          <h2
            className="font-heading text-foreground font-normal leading-[1.05]"
            style={{ fontSize: "clamp(2.5rem,8.89vw,8rem)" }}
          >
            <span className="anim-fade-up block">{t.meetBuilders.titleLine1}</span>
            <span className="anim-fade-up anim-d1 block md:pl-[1.5em]">{t.meetBuilders.titleLine2}</span>
          </h2>
        </div>

        {/* Row 2 — subtitle + CTA: left on mobile/tablet, right-aligned on desktop */}
        <div className="mt-4 md:mt-6 self-start md:self-end md:max-w-[480px] flex flex-col gap-6">
          <p
            className="anim-fade-up anim-d2 font-sans text-foreground/70 leading-relaxed font-medium"
            style={{ fontSize: "clamp(0.9rem,1.25vw,1.125rem)" }}
          >
            {t.meetBuilders.subtitle}
          </p>

          <div className="anim-fade-up anim-d3">
            <Button variant="primary" href="#members" showArrow>
              {t.meetBuilders.cta}
            </Button>
          </div>
        </div>

        {/* ── Image area ── */}
        <div className="anim-fade-up anim-d3 mt-10 md:mt-16">
          <div className="relative">
            <div
              ref={imageRef}
              className="meet-builders-image relative w-full"
              style={{ aspectRatio: "1280 / 680" }}
            >
              <Image
                src="/meet-builders/image.png"
                alt="Casa21 builders event"
                fill
                className="object-cover object-center"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
