import { Container } from "@/components/layout/container";
import { ArrowUpRight } from "@/components/ui/icons";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section id="top" className="pb-[clamp(4rem,10vh,7rem)] pt-[clamp(3rem,12vh,7rem)]">
      <Container>
        {/* The <h1> is the LCP element: it animates first, with no delay and a
            shorter duration than the lines that follow it. */}
        <div className="reveal-mask">
          <h1 className="reveal-lcp font-serif text-[clamp(2.75rem,8.5vw,5.25rem)] leading-[0.95] tracking-[-0.03em] text-text">
            {site.name}
          </h1>
        </div>

        <div className="reveal-mask mt-6">
          <p className="reveal max-w-lg text-lg leading-snug text-text [animation-delay:120ms] md:text-xl">
            {site.role}
          </p>
        </div>

        <p className="reveal-soft mt-5 max-w-136 text-[0.9375rem] leading-relaxed text-muted [animation-delay:190ms] sm:text-base">
          {site.subtext}
        </p>

        <div className="reveal-soft mt-10 flex flex-wrap items-center gap-3 [animation-delay:260ms]">
          <a
            href="#work"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-opacity duration-150 hover:opacity-85"
          >
            View work
          </a>
          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm text-text transition-colors duration-150 hover:border-line-strong hover:bg-surface"
          >
            LinkedIn
            <ArrowUpRight className="size-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
