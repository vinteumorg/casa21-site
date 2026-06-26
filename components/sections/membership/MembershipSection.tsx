"use client";

import Image from "next/image";
import { useLang } from "@/lib/LanguageContext";
import { useClipPath } from "@/hooks/useClipPath";
import { generateMembershipImageClip } from "@/lib/clipPaths/membership";

export default function MembershipSection() {
  const { t } = useLang();
  const imageRef = useClipPath<HTMLDivElement>(generateMembershipImageClip);

  return (
    <section id="member-card" className="relative w-full pt-16 pb-20 md:pt-[clamp(60px,7vw,120px)] md:pb-[clamp(60px,7vw,120px)]">

      {/* Background rings — full viewport width, centred behind the card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/member/background.svg"
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-auto"
          style={{ width: "100vw", minWidth: "100%" }}
        />
      </div>

      {/* Section title + subtitle */}
      <div className="relative z-10 px-6 md:px-site text-center mb-10 md:mb-20">
        <h2
          className="font-heading"
          style={{
            fontWeight: 500,
            fontSize: "clamp(24px,2.64vw,38px)",
            color: "#1B1A1A",
            lineHeight: 1.15,
          }}
        >
          {t.memberCard.title}
        </h2>
        <p
          className="font-sans mt-4 mx-auto"
          style={{
            fontWeight: 400,
            fontSize: "clamp(15px,1.25vw,18px)",
            color: "#555555",
            lineHeight: 1.65,
            maxWidth: "600px",
          }}
        >
          {t.memberCard.subtitle}
        </p>
      </div>

      {/* Card */}
      <div className="relative z-10 px-6 md:px-site">
        <div className="rounded-2xl bg-[#030303] flex flex-col md:flex-row overflow-hidden md:h-[588px]">

          {/* Left — logo + title + description, vertically centred */}
          <div className="flex flex-col justify-center gap-8 p-8 md:p-12 md:w-[42%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home/icon.svg"
              alt="Casa21"
              className="w-[100px] md:w-[193px]"
              style={{ height: "auto" }}
            />
            <div>
              <h3
                className="font-heading"
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(20px,1.94vw,28px)",
                  color: "#FFFFFF",
                  lineHeight: 1.2,
                }}
              >
                {t.memberCard.cardTitle}
              </h3>
              <p
                className="font-sans mt-3"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(14px,1.11vw,16px)",
                  color: "#F8F8F8",
                  lineHeight: 1.65,
                }}
              >
                {t.memberCard.cardDesc}
              </p>
            </div>
          </div>

          {/* Right — clipped photo with gap from card edges */}
          <div className="flex-1 p-3 md:p-[50px]">
            <div
              ref={imageRef}
              className="member-card-image relative w-full md:h-full"
              style={{ aspectRatio: "600 / 460" }}
            >
              <Image
                src="/member/image.png"
                alt={t.memberCard.cardTitle}
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
