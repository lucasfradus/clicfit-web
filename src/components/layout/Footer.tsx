import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/content/site";
import { sedes } from "@/lib/content/sedes";
import { ClaseGratisTrigger } from "@/components/ui/ClaseGratisModal";

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink py-12">
      <div className="container-clic">
        <div className="mb-8 grid grid-cols-2 gap-7 md:mb-12 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-6">
          <div className="col-span-full md:col-span-1">
            <Image
              src={siteConfig.logoUrl}
              alt="CLIC FIT"
              width={120}
              height={36}
              sizes="120px"
              className="mb-4 h-9 w-auto"
            />
            <p className="max-w-xs text-sm leading-relaxed text-cream/60">
              {siteConfig.tagline}. Entrenamiento y nutrición en zona norte.
            </p>
          </div>

          <FooterColumn title="Sedes">
            {sedes.map((sede) => (
              <Link key={sede.slug} href={`/sedes/${sede.slug}`}>
                {sede.name}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Explorar">
            <Link href="/#disciplinas">Disciplinas</Link>
            <Link href="/#nutricion">Nutrición</Link>
            <Link href="/franquicias">Franquicias</Link>
          </FooterColumn>

          <FooterColumn title="Contacto">
            <ClaseGratisTrigger className="text-left">
              WhatsApp
            </ClaseGratisTrigger>
            <a href={`mailto:${siteConfig.email}`}>Email</a>
            <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={siteConfig.tiktok} target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-2 border-t border-cream/10 pt-5 text-xs text-cream/40 sm:flex-row sm:justify-between">
          <div>© {new Date().getFullYear()} CLICFIT</div>
          <div>Todos los derechos reservados</div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3.5 text-[10px] uppercase tracking-[0.2em] text-cream/40">
        {title}
      </div>
      <div className="flex flex-col gap-2 text-sm text-cream/80 [&>a]:transition-colors [&>a]:hover:text-yellow [&>button]:transition-colors [&>button]:hover:text-yellow">
        {children}
      </div>
    </div>
  );
}
