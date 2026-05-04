import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/effects/ScrollReveal";
import type { ContactLink } from "@/data/types";

interface ContactProps {
  links: ContactLink[];
}

export default function Contact({ links }: ContactProps) {
  return (
    <section id="contact" className="bg-surface py-32 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <SectionHeader number="06" title="CONTACT" center />
        </ScrollReveal>
        <ScrollReveal>
          <div className="max-w-[680px] mx-auto text-center">
            <div className="font-sans text-[1.2rem] font-extrabold text-white tracking-[3px] mb-10">
              PING ME
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="text-[0.63rem] py-3 px-7 border border-border-2 text-text-muted no-underline tracking-[2px] transition-all duration-200 hover:border-green hover:text-green"
                  data-hover
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
