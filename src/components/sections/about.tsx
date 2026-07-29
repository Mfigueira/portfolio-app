import { Section } from "@/components/layout/section";
import { about } from "@/content/about";

export function About() {
  return (
    <Section id="about" heading="About">
      <div className="max-w-152 space-y-5">
        {about.paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="text-[0.9375rem] leading-relaxed text-muted sm:text-base"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <p className="mt-8 font-mono text-xs tracking-[0.04em] text-faint">
        {about.languages}
      </p>
    </Section>
  );
}
