import Link from "next/link";
import { Instagram, Twitter, Facebook, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { footerNav } from "@/config/nav.config";

const socialLinks = [
  { icon: Instagram, href: siteConfig.links.instagram, label: "Instagram" },
  { icon: Twitter, href: siteConfig.links.twitter, label: "Twitter" },
  { icon: Facebook, href: siteConfig.links.facebook, label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="text-xl font-display font-bold text-gradient">
              {siteConfig.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">{siteConfig.tagline}</p>

            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-lg bg-secondary p-2 text-foreground/70 transition hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4" />
                {siteConfig.contact.email}
              </a>
              <a href={`tel:${siteConfig.contact.phone}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4" />
                {siteConfig.contact.phone}
              </a>
            </div>
          </div>

          {footerNav.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}