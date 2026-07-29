import { Spotlight } from "@/components/ui/spotlight";
import { ArrowUpRight } from "@/components/ui/icons";
import type { Project } from "@/types/content";

/**
 * The card is an <article>, not one giant anchor. The primary link lives on the
 * title and an inset pseudo-element extends its hit area across the whole card,
 * which keeps one tab stop for the primary action and separate ones for
 * secondary links. A card with no links renders as plain content — never as a
 * dead or disabled button.
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const primaryUrl = project.liveUrl ?? project.repoUrl;
  // Only surface a secondary link when it is not the one the card already points at.
  const secondaryUrl = project.liveUrl ? project.repoUrl : undefined;

  return (
    <Spotlight className="group rounded-xl border border-line bg-surface transition-colors duration-150 hover:border-line-strong hover:bg-surface-raised">
      <article className="relative z-10 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs tabular-nums text-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.context ? (
            <span className="font-mono text-xs text-faint">{project.context}</span>
          ) : null}
        </div>

        <h3 className="mt-5 font-serif text-[clamp(1.5rem,3vw,1.875rem)] leading-tight tracking-[-0.01em]">
          {primaryUrl ? (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1.5 text-text transition-colors duration-150 after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
            >
              {project.title}
              <ArrowUpRight className="size-4 shrink-0 translate-y-px transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            project.title
          )}
        </h3>

        <p className="mt-3 max-w-184 text-[0.9375rem] leading-relaxed text-muted sm:text-base">
          {project.pitch}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <ul className="flex flex-wrap gap-x-3 gap-y-2" aria-label="Tech stack">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="font-mono text-[0.6875rem] tracking-[0.04em] text-faint transition-colors duration-150 group-hover:text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>

          {secondaryUrl ? (
            <a
              href={secondaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline relative z-20 ml-auto font-mono text-xs text-muted transition-colors duration-150 hover:text-accent"
            >
              Source
              <span className="sr-only"> code for {project.title} (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </article>
    </Spotlight>
  );
}
