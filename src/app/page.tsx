import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
// import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      {/* <About /> */}
      <Skills />
    </>
  );
}
