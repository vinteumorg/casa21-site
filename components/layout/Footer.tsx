"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LanguageContext";
import { SOCIAL_LINKS } from "@/data/social";
import {
  generateFooterDesktopClipPath,
  generateFooterUltraWideClipPath,
  generateFooterMobileClipPath,
  generateFooterTabletClipPath,
} from "@/lib/clipPaths/footer";
import type { GhostNewsletter } from "@/lib/ghost/types";

const TABLET_BP = 600;
const DESKTOP_BP = 970;
const ULTRA_WIDE_BP = 1800;
const NOTCH_PAD = 8;

const socialLinks = SOCIAL_LINKS;

function SocialIcons() {
    return (
        <>
            {socialLinks.map(({ href, src, label }) => (
                <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-red"
                >
                    <Image src={src} width={34} height={34} alt={label} />
                </a>
            ))}
        </>
    );
}

type Step = "email" | "newsletters" | "success" | "error";

interface FooterProps {
    newsletters: GhostNewsletter[];
}

export default function Footer({ newsletters }: FooterProps) {
    const { t } = useLang();
    const clipRef = useRef<HTMLDivElement | null>(null);
    const iconsRef = useRef<HTMLDivElement | null>(null);
    const poweredByRef = useRef<HTMLDivElement | null>(null);
    const year = new Date().getFullYear();

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const isValidEmail = (value: string) =>
        /^[^\s@,]+@[^\s@,]+\.[a-zA-Z]{2,}$/.test(value.trim());

    useLayoutEffect(() => {
        const clip = clipRef.current;
        if (!clip) return;

        function update() {
            if (!clip) return;
            const clipRect = clip.getBoundingClientRect();
            const W = clipRect.width;
            const H = clipRect.height;

            const icons = iconsRef.current;
            if (!icons) return;
            const iconsRect = icons.getBoundingClientRect();
            const padding = 15;
            const sl = iconsRect.left - clipRect.left - padding;
            const st = iconsRect.top - clipRect.top - padding;

            const badge = poweredByRef.current;
            let nl = W / 2 - 90;
            let nr = W / 2 + 90;
            let nd = 40;
            if (badge) {
                const badgeRect = badge.getBoundingClientRect();
                nl = badgeRect.left - clipRect.left - NOTCH_PAD;
                nr = badgeRect.right - clipRect.left + NOTCH_PAD;
                nd = Math.max(badgeRect.bottom - clipRect.top + NOTCH_PAD, 28);
            }

            if (window.innerWidth >= ULTRA_WIDE_BP) {
                clip.style.clipPath = `path('${generateFooterUltraWideClipPath(W, H, sl, st, nl, nr, nd)}')`;
            } else if (window.innerWidth >= DESKTOP_BP) {
                clip.style.clipPath = `path('${generateFooterDesktopClipPath(W, H, sl, st, nl, nr, nd)}')`;
            } else if (window.innerWidth >= TABLET_BP) {
                clip.style.clipPath = `path('${generateFooterTabletClipPath(W, H, sl, st, nl, nr, nd)}')`;
            } else {
                clip.style.clipPath = `path('${generateFooterMobileClipPath(W, H, sl, st, nl, nr, nd)}')`;
            }

            clip.style.borderRadius = "0";
            clip.style.overflow = "visible";
        }

        update();
        const ro = new ResizeObserver(update);
        ro.observe(clip);
        if (iconsRef.current) ro.observe(iconsRef.current);
        if (poweredByRef.current) ro.observe(poweredByRef.current);
        window.addEventListener("resize", update);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
        };
    }, [step]); // re-run when step changes so clip path adjusts to new height

    function handleEmailSubmit() {
        if (!isValidEmail(email)) {
            setEmailError(t.footer.stayUpdated.emailInvalid);
            return;
        }
        setEmailError("");
        setSelected(newsletters.map((nl) => nl.id));
        setStep("newsletters");
    }

    function toggleNewsletter(id: string) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    }

    async function handleSubscribe() {
        if (selected.length === 0) return;
        setLoading(true);
        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newsletters: selected }),
            });
            setStep(res.ok ? "success" : "error");
        } catch {
            setStep("error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <footer className="relative mx-4 my-8">
            <div
                ref={poweredByRef}
                className="absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 py-1 px-2"
            >
                <Image
                    src="/footer/powered-by.svg"
                    width={123}
                    height={35}
                    alt="Powered by Vinteum"
                />
            </div>

            <div ref={clipRef} className="footer-clip w-full bg-[#1B1A1A] pb-16 md:pb-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 px-6 md:px-site pt-14 md:pt-[clamp(48px,5.5vw,80px)] pb-10 md:pb-14">

                    {/* Col 1 — Stay Updated */}
                    <div className="flex flex-col gap-5">
                        <h3 className="font-sans font-bold text-white text-lg leading-snug">
                            {t.footer.stayUpdated.title}
                        </h3>
                        <p className="font-sans text-sm text-white/60 leading-relaxed">
                            {t.footer.stayUpdated.subtitle}
                        </p>

                        {step === "email" && (
                            <>
                                <div className={`flex items-center rounded-xl bg-[#282828] border pl-4 pr-1.5 py-1.5 gap-2 transition-colors ${emailError ? "border-red-400/60" : "border-[#4C4C4C]"}`}>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                                        onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                                        placeholder={t.footer.stayUpdated.placeholder}
                                        className={`flex-1 min-w-0 bg-transparent text-white text-sm placeholder:text-white/40 outline-none font-sans py-1 ${emailError ? "placeholder:text-red-400/60" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleEmailSubmit}
                                        aria-label="Next"
                                        className="w-[46px] h-[32px] rounded-[20px] bg-[#25A273] flex items-center justify-center flex-shrink-0 hover:bg-[#1e9062] active:bg-[#187a53] transition-colors cursor-pointer"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                                            <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                {emailError
                                    ? <p className="font-sans text-xs text-red-400">{emailError}</p>
                                    : <p className="font-sans text-xs text-white/30">{t.footer.stayUpdated.finePrint}</p>
                                }
                            </>
                        )}

                        {step === "newsletters" && newsletters.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <p className="font-sans text-xs text-white/40 truncate">{email}</p>
                                    <button
                                        type="button"
                                        onClick={() => setStep("email")}
                                        aria-label="Edit email"
                                        className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="font-sans text-xs text-white/50">
                                    {t.footer.stayUpdated.chooseLabel}
                                </p>
                                <div className="flex flex-col gap-2">
                                    {newsletters.map((nl) => (
                                        <label key={nl.id} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(nl.id)}
                                                onChange={() => toggleNewsletter(nl.id)}
                                                className="accent-[#25A273] w-4 h-4 cursor-pointer"
                                            />
                                            <span className="font-sans text-sm text-white/70 group-hover:text-white transition-colors">
                                                {nl.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSubscribe}
                                    disabled={loading || selected.length === 0}
                                    className="mt-1 w-full rounded-xl bg-[#25A273] text-white text-sm font-sans font-semibold py-2.5 hover:bg-[#1e9062] active:bg-[#187a53] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "…" : t.footer.stayUpdated.subscribeBtn}
                                </button>
                            </div>
                        )}

                        {step === "newsletters" && newsletters.length === 0 && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <p className="font-sans text-xs text-white/40 truncate">{email}</p>
                                    <button
                                        type="button"
                                        onClick={() => setStep("email")}
                                        aria-label="Edit email"
                                        className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSubscribe}
                                    disabled={loading}
                                    className="w-full rounded-xl bg-[#25A273] text-white text-sm font-sans font-semibold py-2.5 hover:bg-[#1e9062] transition-colors disabled:opacity-50"
                                >
                                    {loading ? "…" : t.footer.stayUpdated.subscribeBtn}
                                </button>
                            </div>
                        )}

                        {step === "success" && (
                            <div className="flex items-center gap-3 rounded-xl bg-[#25A273]/15 border border-[#25A273]/30 px-4 py-3">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                                    <path d="M3 9l4 4 8-8" stroke="#25A273" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="font-sans text-sm text-white/80">
                                    {t.footer.stayUpdated.success}
                                </span>
                            </div>
                        )}

                        {step === "error" && (
                            <div className="flex flex-col gap-3">
                                <p className="font-sans text-sm text-red-400">
                                    {t.footer.stayUpdated.error}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setStep("email")}
                                    className="font-sans text-xs text-white/40 underline text-left"
                                >
                                    Try again
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Col 2 — No Coins Here */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-sans font-bold text-white text-lg leading-snug">
                            {t.footer.noCoinsHere.title}
                        </h3>
                        <div className="flex flex-col gap-3">
                            <p className="font-sans text-sm text-white/60 leading-relaxed">{t.footer.noCoinsHere.p1}</p>
                            <p className="font-sans text-sm text-white/60 leading-relaxed">{t.footer.noCoinsHere.p2}</p>
                            <p className="font-sans text-sm text-white/60 leading-relaxed">{t.footer.noCoinsHere.p3}</p>
                            <p className="font-sans text-sm text-white/60 leading-relaxed">
                                {t.footer.noCoinsHere.p4}<br />{t.footer.noCoinsHere.p5}
                            </p>
                            <p className="font-sans text-sm text-white/60 leading-relaxed">{t.footer.noCoinsHere.p6}</p>
                        </div>
                    </div>

                    {/* Col 3 — Quick Contact */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-sans font-bold text-white text-lg leading-snug">
                            {t.footer.quickContact.title}
                        </h3>
                        <p className="font-sans text-sm text-white/60 leading-relaxed">
                            {t.footer.quickContact.address}
                        </p>
                        <a
                            href={`mailto:${t.footer.quickContact.email}`}
                            className="font-sans text-sm text-brand-yellow hover:text-brand-yellow/80 transition-colors"
                        >
                            {t.footer.quickContact.email}
                        </a>
                        <div className="flex justify-end mt-auto pt-6">
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                aria-label="Scroll to top"
                                className="flex items-center justify-center flex-shrink-0 w-[43px] h-[63px] rounded-[100px] bg-[linear-gradient(to_top_right,#25A273_0%,#FFAA00_79%)]"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                                    <path d="M10 16V4M4 10l6-6 6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="py-5 mb-6 px-6 md:px-site text-center">
                    <p className="font-sans text-xs text-white/30">
                        ©{year} All Rights Reserved.
                    </p>
                </div>
            </div>

            <div ref={iconsRef} className="flex absolute gap-3 items-center bottom-3 right-4">
                <SocialIcons />
            </div>
        </footer>
    );
}
