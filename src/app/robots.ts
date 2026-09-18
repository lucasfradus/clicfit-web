import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // /q/ son los links de QR: cada visita cuenta como escaneo, así que no
      // queremos que los buscadores los pidan. /qr/ es el panel de métricas.
      disallow: ["/api/", "/q/", "/qr/"],
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
