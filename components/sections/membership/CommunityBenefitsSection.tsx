"use client";

import { useLang } from "@/lib/LanguageContext";
import { useInView } from "@/hooks/useInView";
import { useClipPath } from "@/hooks/useClipPath";
import { generateCBClipPath } from "@/lib/clipPaths/communityBenefits";


export default function CommunityBenefitsSection() {
  const { t } = useLang();
  const cardRef = useClipPath<HTMLDivElement>(generateCBClipPath);
  const animRef = useInView<HTMLDivElement>(0.05);

  const items = t.communityBenefits.items;

  return (
    <section className="relative w-full px-6 md:px-site">
      {/* Dark card — clip applied here, width = CoworkingSection content width */}
      <div
        ref={cardRef}
        className="community-benefits-section bg-[#000000]"
      >
        <div
          ref={animRef}
          className="anim-wrap px-6 md:px-[clamp(40px,4vw,60px)] pt-[clamp(48px,7vw,96px)] pb-[clamp(48px,7vw,96px)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(40px,6vw,96px)] gap-y-10 md:gap-y-12">
            {items.map((item, i) => (
              <div
                key={i}
                className="anim-fade-up"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl leading-none select-none" aria-hidden>
                    {item.icon}
                  </span>
                  <h3
                    className="font-heading"
                    style={{
                      fontWeight: 500,
                      fontSize: "clamp(16px,1.39vw,20px)",
                      color: "#FFFFFF",
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>
                </div>
                <p
                  className="font-sans"
                  style={{
                    fontWeight: 400,
                    fontSize: "clamp(14px,1.11vw,16px)",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.65,
                    paddingLeft: "2.75rem",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
