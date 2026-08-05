import { Container } from "@/components/layout/container";
import { ArrowUpRight } from "@/components/ui/icons";
import { HeroScene } from "@/components/three/hero-scene";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-140 pt-[clamp(3rem,12vh,7rem)] pb-[clamp(4rem,10vh,7rem)] sm:min-h-155 md:flex md:min-h-170 md:items-center"
    >
      {/* Full-bleed: the glow needs to reach every edge of the hero, not just
          a boxed-off panel, so this sits behind everything at the section's
          own bounds rather than inside Container. */}
      <HeroScene className="absolute inset-0" />

      <Container className="relative z-10 w-full">
        <div className="pt-44 sm:pt-52 md:max-w-lg md:pt-0">
          {/* The <h1> is the LCP element: it animates first, with no delay and a
              shorter duration than the lines that follow it. */}
          <div className="reveal-mask">
            <h1 className="reveal-lcp text-text font-serif text-[clamp(2.75rem,8.5vw,5.25rem)] leading-[0.95] tracking-[-0.03em]">
              {site.name}
            </h1>
          </div>

          <div className="reveal-mask mt-6">
            <p className="reveal text-text max-w-lg text-lg leading-snug [animation-delay:120ms] md:text-xl">
              {site.role}
            </p>
          </div>

          <p className="reveal-soft text-muted mt-5 max-w-136 text-[0.9375rem] leading-relaxed [animation-delay:190ms] sm:text-base">
            {site.subtext}
          </p>

          <div className="reveal-soft mt-10 flex flex-wrap items-center gap-3 [animation-delay:260ms]">
            <a
              href="#projects"
              className="bg-accent text-bg rounded-full px-5 py-2.5 text-sm font-medium transition-opacity duration-150 hover:opacity-85"
            >
              View projects
            </a>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="border-line text-text hover:border-line-strong hover:bg-surface inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm transition-colors duration-150"
            >
              LinkedIn
              <ArrowUpRight className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
