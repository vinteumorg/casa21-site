"use client";

import { useRef, useLayoutEffect, RefObject } from "react";

type Generator = (W: number, H: number) => string;

export function useClipPath<T extends HTMLElement>(
  generator: Generator,
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const { width: W, height: H } = el.getBoundingClientRect();
      el.style.clipPath = `path('${generator(W, H)}')`;
      el.style.borderRadius = "0";
      el.style.overflow = "visible";
    }

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [generator]);

  return ref;
}
