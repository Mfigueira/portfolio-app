"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/container";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const links = [
  { href: "#projects", label: "Projects" },
  // { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // An IntersectionObserver on a sentinel at the top of the document, rather
  // than a scroll listener: the callback fires twice per page rather than on
  // every frame of every scroll.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry?.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-px" />
      <header
        className={cn(
          "sticky top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-line bg-bg/70 supports-[not(backdrop-filter:blur(0))]:bg-bg border-b backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        <Container>
          <nav aria-label="Primary" className="flex h-16 items-center justify-between">
            <a
              href="#top"
              className="text-text hover:text-accent font-serif text-xl leading-none tracking-tight transition-colors duration-150"
            >
              <span aria-hidden>{site.initials}</span>
              <span className="sr-only">{site.name} — back to top</span>
            </a>

            <ul className="flex items-center gap-6 sm:gap-8">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="link-underline text-muted hover:text-text font-mono text-xs tracking-[0.08em] transition-colors duration-150 sm:text-[0.8125rem]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </header>
    </>
  );
}
