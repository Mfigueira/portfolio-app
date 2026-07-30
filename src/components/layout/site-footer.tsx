import { Container } from "@/components/layout/container";
import { ArrowUpRight, GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { CurrentYear } from "@/components/ui/current-year";
import { site } from "@/content/site";

// Evaluated once, when this static page is built.
const BUILD_YEAR = new Date().getFullYear();

const channels = [
  { label: "LinkedIn", href: site.social.linkedin, Icon: LinkedInIcon },
  { label: "GitHub", href: site.social.github, Icon: GitHubIcon },
];

/**
 * Contact and footer are the same thing. Splitting them would give the page two
 * closing moments; merged, it ends once and decisively.
 */
export function SiteFooter() {
  return (
    <footer
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-line py-[clamp(5rem,12vh,9rem)]"
    >
      <Container>
        <div className="grid gap-8 md:grid-cols-[11rem_1fr] md:gap-16">
          <h2
            id="contact-heading"
            className="font-serif text-[clamp(1.75rem,4vw,2.25rem)] leading-none tracking-[-0.02em] md:pt-1"
          >
            Contact
          </h2>

          <div>
            <p className="max-w-120 font-serif text-[clamp(1.5rem,3.5vw,2rem)] leading-tight tracking-[-0.01em] text-text">
              {site.closingLine}
            </p>

            <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              {channels.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 text-lg text-text transition-colors duration-150 hover:text-accent"
                  >
                    <Icon className="size-4 text-faint transition-colors duration-150 group-hover:text-accent" />
                    <span className="link-underline">{label}</span>
                    <ArrowUpRight className="size-3.5 text-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-20 font-mono text-[0.6875rem] tracking-[0.04em] text-faint">
              © <CurrentYear fallback={BUILD_YEAR} /> {site.name}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
