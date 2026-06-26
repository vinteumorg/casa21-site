"use client";

import { useState, useEffect, useRef, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/LanguageContext";
import type { Lang } from "@/lib/i18n";
import { NAV_ITEMS } from "@/data/navigation";

const NAV_KEYS = NAV_ITEMS;
const NAV_PRIMARY_KEYS = NAV_KEYS.slice(0, 5);

interface NavbarProps {
  pillRef: RefObject<HTMLElement | null>;
}

function scrollToHash(href: string) {
  document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar({ pillRef }: NavbarProps) {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const brBtnRef = useRef<HTMLButtonElement>(null);
  const enBtnRef = useRef<HTMLButtonElement>(null);

  function handleLang(next: Lang) {
    setLang(next);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    hamburgerRef.current?.setAttribute("aria-expanded", menuOpen ? "true" : "false");
    if (overlayRef.current) {
      if (menuOpen) overlayRef.current.removeAttribute("aria-hidden");
      else overlayRef.current.setAttribute("aria-hidden", "true");
    }
  }, [menuOpen]);

  useEffect(() => {
    brBtnRef.current?.setAttribute("aria-pressed", lang === "br" ? "true" : "false");
    enBtnRef.current?.setAttribute("aria-pressed", lang === "en" ? "true" : "false");
  }, [lang]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* ── Desktop ── */}
      <header className="absolute inset-x-0 top-0 z-50 h-[100px] hidden md:flex items-center px-8">
        <div className="flex items-center flex-1">
          <Link href="/" aria-label="Casa21 home">
            <Image
              src="/home/icon.svg"
              alt="Casa21"
              width={115}
              height={33}
              priority
            />
          </Link>
        </div>

        <nav
          ref={pillRef as RefObject<HTMLElement>}
          className="bg-white rounded-full px-2 py-2 flex items-center gap-1 shrink-0"
          aria-label="Main navigation"
        >
          {NAV_KEYS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              onClick={href.startsWith("#") ? (e) => { e.preventDefault(); scrollToHash(href); } : undefined}
              className="font-sans px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap text-gray-800 hover:bg-gray-100"
            >
              {t.nav[key as keyof typeof t.nav]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1.5 text-sm font-medium flex-1">
          <button
            onClick={() => handleLang("br")}
            className={`transition-all font-medium ${
              lang === "br"
                ? "font-bold text-[#FFAA00]"
                : "text-white opacity-50 hover:opacity-80"
            }`}
          >
            {t.lang.label_br}
          </button>
          <span className="text-white opacity-40">|</span>
          <button
            onClick={() => handleLang("en")}
            className={`transition-all font-medium ${
              lang === "en"
                ? "font-bold text-[#FFAA00]"
                : "text-white opacity-50 hover:opacity-80"
            }`}
          >
            {t.lang.label_en}
          </button>
        </div>
      </header>

      {/* ── Mobile header ── */}
      <header
        className="absolute inset-x-0 top-0 z-50 h-[72px] flex md:hidden items-center justify-between px-6"
        aria-label="Mobile navigation header"
      >
        <Link href="/" aria-label="Casa21 home">
          <Image
            src="/home/icon.svg"
            alt="Casa21"
            width={100}
            height={29}
            priority
            className="object-contain"
          />
        </Link>

        <button
          ref={hamburgerRef}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex flex-col justify-center items-center gap-1.5 p-2 -mr-1 min-h-[44px] min-w-[44px]"
          aria-label="Abrir menu"
          aria-expanded="false"
          aria-controls="mobile-nav"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </header>

      {/* ── Mobile nav overlay ── */}
      <div
        ref={overlayRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden="true"
        className={`mobile-nav-overlay md:hidden fixed inset-0 z-40 bg-[#111111] flex flex-col${
          menuOpen ? " open" : ""
        }`}
      >
        {/* Top spacer — same height as the mobile header sitting above (z-50) */}
        <div className="h-[72px] shrink-0" aria-hidden="true" />

        {/* Primary navigation links */}
        <nav
          className="flex-1 flex flex-col px-6 pt-2 overflow-y-auto"
          aria-label="Navegação principal"
        >
          {NAV_PRIMARY_KEYS.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={(e) => { if (href.startsWith("#")) { e.preventDefault(); scrollToHash(href); } setMenuOpen(false); }}
              className="mobile-nav-item font-sans border-b border-white/[0.08] py-[18px] text-[26px] font-semibold text-white leading-tight hover:text-[#25A273] focus:text-[#25A273] focus:outline-none transition-colors duration-200"
            >
              {t.nav[key as keyof typeof t.nav]}
            </Link>
          ))}
        </nav>

        {/* Bottom: CTA + language toggle */}
        <div className="px-6 pb-10 pt-6 shrink-0 flex flex-col gap-4">
          <Link
            href="#membership"
            tabIndex={menuOpen ? 0 : -1}
            onClick={(e) => { e.preventDefault(); scrollToHash("#membership"); setMenuOpen(false); }}
            className="mobile-nav-cta font-sans block w-full rounded-full bg-[#25A273] text-white text-center py-4 text-base font-semibold hover:bg-[#1e8f64] active:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#25A273] focus:ring-offset-2 focus:ring-offset-[#111111]"
          >
            {t.nav.membership}
          </Link>

          <div
            className="mobile-nav-lang inline-flex self-start bg-white/[0.06] rounded-full p-1 gap-1"
            role="group"
            aria-label="Selecionar idioma"
          >
            <button
              ref={brBtnRef}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => handleLang("br")}
              aria-pressed="false"
              className={`font-sans rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none ${
                lang === "br"
                  ? "bg-[#FFAE00] text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t.lang.drawer_br}
            </button>
            <button
              ref={enBtnRef}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => handleLang("en")}
              aria-pressed="false"
              className={`font-sans rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none ${
                lang === "en"
                  ? "bg-[#FFAE00] text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t.lang.drawer_en}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
