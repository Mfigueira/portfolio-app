import type { Project } from "@/types/content";

// Card order is array order. Swapping a placeholder for a real project is an edit
// to this file only — no component touches required.
export const projects: readonly Project[] = [
  {
    // TODO: replace — placeholder for an unbuilt personal project.
    title: "Personal Project 01",
    pitch:
      "A full-stack web application built end to end — schema, API, and interface. Designed around a single workflow and made fast enough to feel instant.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
  },
  {
    // TODO: replace — placeholder for an unbuilt personal project.
    title: "Personal Project 02",
    pitch:
      "A focused tool that collapses a repetitive manual task into a few keystrokes. Built to be used daily, so interaction cost matters more than feature count.",
    tags: ["React", "TypeScript", "Node.js", "Redis"],
  },
  {
    title: "ZetaChain Documentation",
    context: "Open source · ZetaChain",
    pitch:
      "The public documentation platform for ZetaChain, built on Next.js and Nextra. I set up the repository architecture and hand-built the UI layer, component by component.",
    tags: ["Next.js", "React", "Nextra", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://www.zetachain.com/docs/",
    repoUrl: "https://github.com/zeta-chain/docs",
  },
];
