import SectionWrapper from '../layout/SectionWrapper';
import Button from '../ui/Button';
import SectionHeading from '../ui/SectionHeading';

const socialLinks = [
  {
    label: 'Email',
    href: 'mailto:iles.erdeni@gmail.com',
    value: 'iles.erdeni@gmail.com',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/erdeni-iles-674a17272/',
    value: 'linkedin.com/in/erdeni-iles-674a17272',
  },
];

export default function Contact() {
  return (
    <SectionWrapper id="contact" className="border-t border-border-subtle py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading label="05 — Contact" title="Let's connect" />

        <div className="grid gap-8 lg:grid-cols-2">
          <p className="max-w-md text-base leading-relaxed text-muted">
            I'm open to internship opportunities, research collaborations, and
            conversations about mechanical design and hardware. Reach out — I'd
            love to hear from you.
          </p>

          <div className="flex flex-col gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label === 'Email' ? undefined : '_blank'}
                rel={link.label === 'Email' ? undefined : 'noopener noreferrer'}
                className="group flex items-center justify-between rounded-xl border border-border bg-surface-raised px-5 py-4 transition-all hover:border-accent/30"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-zinc-600">
                    {link.label}
                  </p>
                  <p className="mt-1 text-sm text-zinc-300 transition-colors group-hover:text-accent">
                    {link.value}
                  </p>
                </div>
                <span className="text-zinc-600 transition-colors group-hover:text-accent">
                  →
                </span>
              </a>
            ))}

            <Button
              href="/Erdeni%20Iles-Resume%20v29.pdf"
              variant="secondary"
              className="mt-2 w-full justify-center"
            >
              Download Resume
            </Button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
