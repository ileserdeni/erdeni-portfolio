import { Link } from 'react-router-dom';
import { nav, site } from '../../content/site';

export default function Footer() {
  return (
    <footer id="contact" className="relative mt-24 border-t border-line bg-film/60">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-24">
        <div className="lg:col-span-7">
          <p className="mono text-ice">Contact</p>
          <h2 className="display mt-5 text-[clamp(3rem,9vw,7.5rem)] text-bone">
            Write to me<span className="serif-accent text-ice">.</span>
          </h2>
          <a
            href={`mailto:${site.email}`}
            className="display-wide link-line mt-6 inline-block break-all text-[clamp(1.25rem,3.2vw,2.4rem)] text-ice-bright"
          >
            {site.email}
          </a>
          <p className="prose-body mt-6">
            Open to internships, research positions, and conversations about mechanical design, optics hardware, or robotics.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-3 lg:col-span-4 lg:col-start-9">
          <FooterLink href={site.resume.href} external>
            {site.resume.label}
          </FooterLink>
          <FooterLink href={site.linkedin} external>
            LinkedIn
          </FooterLink>
          <FooterLink href={`mailto:${site.email}`}>Email</FooterLink>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 border-t border-line px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="mono link-line text-ash hover:text-bone">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mono-sm text-ash-dim">
          © {new Date().getFullYear()} {site.name} · {site.location}
        </p>
      </div>
    </footer>
  );
}

function FooterLink({ href, external, children }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group mono flex min-h-14 items-center justify-between border-b border-line-strong text-bone hover:text-ice-bright"
    >
      {children}
      <span aria-hidden="true" className="text-ice transition-transform group-hover:translate-x-1">
        {external ? '↗' : '→'}
      </span>
    </a>
  );
}
