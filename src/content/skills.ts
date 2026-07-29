import type { SkillGroup } from "@/types/content";

// Order is deliberate. Frontend leads and is the most granular group; the
// client-state and data-fetching tools sit here rather than in a separate
// bucket, so depth in this layer is implied by the shape of the list.
export const skillGroups: readonly SkillGroup[] = [
  {
    title: "Frontend & UI",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "TanStack Query",
      "SWR",
      "Redux Toolkit",
    ],
  },
  {
    title: "Backend & Systems",
    items: [
      "Node.js",
      "Express",
      "REST APIs",
      "GraphQL",
      "PostgreSQL",
      "MongoDB",
      "Prisma",
      "Redis",
    ],
  },
  {
    title: "Tooling & Delivery",
    items: [
      "Git",
      "GitHub Actions",
      "Docker",
      "Vite",
      "Vitest",
      "Vercel",
      "AWS",
    ],
  },
  {
    title: "Web3",
    items: ["Ethers.js", "Wagmi", "Viem", "WalletConnect", "Smart Contracts"],
  },
];
