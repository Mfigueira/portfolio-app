"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Reports pointer position into CSS custom properties. It renders no visuals of
 * its own — the lighting lives in `.spotlight` in globals.css.
 *
 * Three things this deliberately does not do:
 *   - hold React state, so a pointer move never triggers a re-render;
 *   - attach listeners on touch or under reduced motion;
 *   - read layout outside a frame callback.
 *
 * Children are server-rendered and passed through, so wrapping a card in this
 * does not pull the card's markup into the client bundle.
 */
export function Spotlight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let frame = 0;
    let clientX = 0;
    let clientY = 0;

    const paint = () => {
      frame = 0;
      // Layout read happens inside the frame, batched with the write that
      // follows it, so pointer movement never forces a synchronous reflow.
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      clientX = event.clientX;
      clientY = event.clientY;
      // Multiple pointer events within one frame collapse into a single update.
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onEnter = () => el.style.setProperty("--glow", "1");
    const onLeave = () => el.style.setProperty("--glow", "0");

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={cn("spotlight", className)}>
      {children}
    </div>
  );
}
