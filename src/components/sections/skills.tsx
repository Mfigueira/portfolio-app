import { Section } from "@/components/layout/section";
import { skillGroups } from "@/content/skills";

export function Skills() {
  return (
    <Section id="skills" heading="Skills">
      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <section key={group.title} aria-labelledby={`skills-${group.title}`}>
            <h3
              id={`skills-${group.title}`}
              className="text-sm font-medium tracking-[-0.01em] text-text"
            >
              {group.title}
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="font-mono text-[0.8125rem] tracking-[0.02em] text-faint"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  );
}
