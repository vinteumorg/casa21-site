"use client";

import { useRef, useLayoutEffect } from "react";
import { useLang } from "@/lib/LanguageContext";
import { useInView } from "@/hooks/useInView";
import { MEMBERS, type MemberItem } from "@/data/members";
import { generateMemberCardClip, generateMembersDesktopClip, generateMembersMobileClip, generateMembersTabletClip } from "@/lib/clipPaths/members";

export default function MembersSection() {
    const { t } = useLang();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const animRef = useInView<HTMLDivElement>(0.05);

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        function update() {
            if (!el) return;
            const { width: W, height: H } = el.getBoundingClientRect();
            const w = window.innerWidth;

            if (w < 768) {
                el.style.clipPath = `path('${generateMembersMobileClip(W, H)}')`;
            } else if (w < 1200) {
                el.style.clipPath = `path('${generateMembersTabletClip(W, H)}')`;
            } else {
                el.style.clipPath = `path('${generateMembersDesktopClip(W, H)}')`;
            }
            el.style.borderRadius = "0";
            el.style.overflow = "visible";

            const photos = el.querySelectorAll<HTMLElement>(".members-photo");
            photos.forEach((photo) => {
                if (w < 768) {
                    photo.style.clipPath = "";
                    photo.style.borderRadius = "";
                    photo.style.overflow = "";
                } else {
                    const { width: pW, height: pH } = photo.getBoundingClientRect();
                    photo.style.clipPath = `path('${generateMemberCardClip(pW, pH)}')`;
                    photo.style.borderRadius = "0";
                    photo.style.overflow = "hidden";
                }
            });
        }

        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        window.addEventListener("resize", update);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
        };
    }, []);

    return (
        <section id="members" className="w-full px-6 md:px-site py-16">
            <div
                ref={containerRef}
                className="members-container bg-[#1B1A1A] w-full p-8 md:p-12 lg:p-16"
            >
                {/* Members grid: 2 cols on mobile/tablet, 3 cols on desktop */}
                <div ref={animRef} className="anim-wrap grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 lg:gap-8">
                    {MEMBERS.map((member: MemberItem, i: number) => (
                        <div
                            key={i}
                            className="anim-fade-up flex flex-col items-center gap-3"
                            style={{ transitionDelay: `${i * 55}ms` }}
                        >
                            {/* Photo — circular on mobile, rounded rect on tablet/desktop */}
                            <div className="members-photo w-full aspect-square bg-[#2E2E2E]">
                                {member.image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-center"
                                    />
                                )}
                            </div>

                            {/* Name + role */}
                            <div className="text-center">
                                <p
                                    className="text-white leading-snug"
                                    style={{
                                        fontFamily: "var(--font-schibsted)",
                                        fontWeight: 500,
                                        fontSize: 16,
                                    }}
                                >
                                    {member.name}
                                </p>
                                {member.role && (
                                    <p
                                        className="text-[#6B6B6B] mt-0.5 leading-snug"
                                        style={{
                                            fontFamily: "var(--font-schibsted)",
                                            fontWeight: 500,
                                            fontSize: 14,
                                        }}
                                    >
                                        {member.role}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Become a Member button — centered on mobile, right-aligned on desktop */}
                <div className="flex justify-center md:justify-end mt-10">
                    <a
                        href="#member-card"
                        className="inline-flex items-center gap-2.5 rounded-full bg-[#25A273] hover:bg-[#1e9062] active:bg-[#187a53] text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25A273] focus-visible:ring-offset-2"
                        style={{
                            fontFamily: "var(--font-dm-sans)",
                            fontWeight: 700,
                            fontSize: 14,
                            paddingTop: 12,
                            paddingBottom: 12,
                            paddingLeft: 28,
                            paddingRight: 28,
                        }}
                    >
                        {t.nav.membership}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                            <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
