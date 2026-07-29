import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";

/**
 * Every section shares the same vertical rhythm and the same two-column
 * arrangement: the heading hangs in a narrow left column on desktop and stacks
 * above the content on mobile. Consistency here is what makes a long scroll
 * feel composed rather than assembled.
 */
export function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="border-t border-line py-[clamp(5rem,12vh,9rem)]"
    >
      <Container>
        <div className="grid gap-8 md:grid-cols-[11rem_1fr] md:gap-16">
          <h2
            id={headingId}
            className="font-serif text-[clamp(1.75rem,4vw,2.25rem)] leading-none tracking-[-0.02em] text-text md:pt-1"
          >
            {heading}
          </h2>
          <div>{children}</div>
        </div>
      </Container>
    </section>
  );
}
