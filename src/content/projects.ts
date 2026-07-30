import type { Project } from "@/types/content";

// Card order is array order. Swapping a placeholder for a real project is an edit
// to this file only — no component touches required.
export const projects: readonly Project[] = [
  {
    title: "ZetaHub",
    context: "ZetaChain",
    pitch:
      "ZetaHub is the Web3 dApp for the ZetaChain ecosystem—stake, vote, interact with Universal Apps, and earn XP rewards. I contributed as a core product engineer on the team building it.",
    tags: ["Next.js", "React", "Ethers.js", "TypeScript", "Node.js"],
    liveUrl: "https://hub.zetachain.com/",
  },
  {
    title: "ZetaChain Documentation",
    context: "ZetaChain",
    pitch:
      "The public documentation platform for ZetaChain, built on Next.js and Nextra. I set up the repository architecture and built the UI layer.",
    tags: ["Next.js", "React", "Nextra", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://www.zetachain.com/docs/",
    repoUrl: "https://github.com/zeta-chain/docs",
  },
  {
    // TODO: replace — placeholder for an unbuilt personal project.
    title: "Tetris.AI",
    context: "Personal project",
    pitch:
      "A classic Tetris game crafted with React, TypeScript, and Vite, featuring GSAP animations and a built-in AI that can play the game for you. I had a lot of fun building it.",
    tags: ["React", "TypeScript", "Vite", "GSAP"],
    liveUrl: "https://mfigueira.github.io/tetris-ai/",
    repoUrl: "https://github.com/Mfigueira/tetris-ai",
  },
];
