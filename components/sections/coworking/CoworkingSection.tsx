"use client";

import { useLang } from "@/lib/LanguageContext";
import { useInView } from "@/hooks/useInView";
import { useClipPath } from "@/hooks/useClipPath";
import { generateCoworkingCardClipPath } from "@/lib/clipPaths/coworking";

export default function CoworkingSection() {
  const { t } = useLang();
  const card1Ref = useClipPath<HTMLDivElement>(generateCoworkingCardClipPath);
  const card2Ref = useClipPath<HTMLDivElement>(generateCoworkingCardClipPath);
  const card3Ref = useClipPath<HTMLDivElement>(generateCoworkingCardClipPath);
  const animRef = useInView<HTMLDivElement>(0.1);

  return (
    <section id="coworking" className="relative w-full bg-white pt-16 pb-20 md:pt-[clamp(60px,7vw,120px)] md:pb-[clamp(60px,7vw,120px)]">
      <div ref={animRef} className="anim-wrap px-6 md:px-site">

        {/* Title */}
        <h2
          className="anim-fade-up font-heading"
          style={{
            fontWeight: 400,
            fontSize: "clamp(1.75rem,3.33vw,48px)",
            color: "#1B1A1A",
            lineHeight: 1.1,
          }}
        >
          {t.workCasa21.title}
        </h2>

        {/* Subtitle block */}
        <div className="anim-fade-up anim-d1 mt-8">
          <p
            className="font-sans"
            style={{
              fontWeight: 500,
              fontSize: "18px",
              color: "#282828",
              lineHeight: 1.6,
            }}
          >
            {t.workCasa21.subtitle1}
            <br />
            {t.workCasa21.subtitle2}
          </p>
        </div>

        <p
          className="anim-fade-up anim-d2 mt-6"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 500,
            fontSize: "18px",
            color: "#282828",
            lineHeight: 1.6,
          }}
        >
          {t.workCasa21.subtitle3}
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Dark card */}
          <div
            ref={card1Ref}
            className="anim-fade-up anim-d3 work-casa21-card bg-[#1B1A1A] flex flex-col gap-16 p-10"
            style={{ minHeight: "340px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/work-casa21/check.svg"
              alt=""
              aria-hidden
              width={56}
              height={56}
            />
            <p
              className="font-heading"
              style={{
                fontWeight: 500,
                fontSize: "clamp(18px,1.67vw,24px)",
                color: "#FFFFFF",
                lineHeight: 1.3,
              }}
            >
              {t.workCasa21.card1}
            </p>
          </div>

          {/* Light card 2 */}
          <div
            ref={card2Ref}
            className="anim-fade-up anim-d4 work-casa21-card bg-[#F3F3F3] flex flex-col gap-16 p-10"
            style={{ minHeight: "340px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/work-casa21/check.svg"
              alt=""
              aria-hidden
              width={56}
              height={56}
            />
            <p
              className="font-heading"
              style={{
                fontWeight: 500,
                fontSize: "clamp(18px,1.67vw,24px)",
                color: "#1B1A1A",
                lineHeight: 1.3,
              }}
            >
              {t.workCasa21.card2}
            </p>
          </div>

          {/* Light card 3 */}
          <div
            ref={card3Ref}
            className="anim-fade-up anim-d5 work-casa21-card bg-[#F3F3F3] flex flex-col gap-16 p-10"
            style={{ minHeight: "340px" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/work-casa21/check.svg"
              alt=""
              aria-hidden
              width={56}
              height={56}
            />
            <p
              className="font-heading"
              style={{
                fontWeight: 500,
                fontSize: "clamp(18px,1.67vw,24px)",
                color: "#1B1A1A",
                lineHeight: 1.3,
              }}
            >
              {t.workCasa21.card3}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className="font-sans anim-fade-up anim-d5 mt-12 text-center mx-auto"
          style={{
            fontWeight: 400,
            fontSize: "16px",
            color: "#282828",
            maxWidth: "640px",
            lineHeight: 1.6,
          }}
        >
          {t.workCasa21.footerText}{" "}
        </p>
      </div>
    </section>
  );
}
