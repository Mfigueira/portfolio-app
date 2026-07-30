import { Section } from "@/components/layout/section";
import { ProjectCard } from "@/components/ui/project-card";
import { projects } from "@/content/projects";

export function Work() {
  return (
    <Section id="projects" heading="Projects">
      <ul className="flex flex-col gap-4">
        {projects.map((project, index) => (
          <li key={project.title}>
            <ProjectCard project={project} index={index} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
