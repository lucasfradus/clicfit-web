"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/content/site";
import { waLinkClaseGratis } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#disciplinas", label: "Disciplinas" },
  { href: "/sedes", label: "Sedes" },
  { href: "/#nutricion", label: "Nutrición" },
  { href: "/franquicias", label: "Franquicias" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-ink/85 py-2.5 backdrop-blur-md"
            : "bg-transparent py-4",
        )}
      >
        <div className="container-clic flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0" aria-label="CLIC FIT">
            <Image
              src={siteConfig.logoUrl}
              alt="CLIC FIT"
              width={180}
              height={36}
              priority
              className="h-7 w-auto md:h-9"
              unoptimized
            />
          </Link>

          <div className="hidden items-center gap-7 text-xs uppercase tracking-[0.2em] lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-yellow"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={waLinkClaseGratis()}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap bg-yellow px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white md:px-5 md:py-3 md:text-xs"
            >
              Clase gratis
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="-mr-2 p-2 lg:hidden"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-ink px-6 transition-transform duration-400 lg:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="display text-5xl hover:text-yellow"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
