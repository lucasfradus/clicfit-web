import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El contador de QR en modo prueba escribe un JSON con `fs`, y una ruta de
  // archivo armada en runtime hace que el tracer meta el proyecto entero —
  // incluidas las fotos de `public/`, casi 80 MB — adentro de la función
  // serverless. Esto lo acota a lo que la ruta realmente necesita.
  // Cuando el contador pase a Upstash (ver docs/qr.md) ya no hace falta.
  // Los corchetes van escapados: las claves se matchean con picomatch, donde
  // `[slug]` sería una clase de caracteres y no el literal del segmento.
  outputFileTracingExcludes: {
    "/q/\\[slug\\]": ["public/**/*"],
    "/qr/\\[slug\\]": ["public/**/*"],
  },

  async redirects() {
    return [
      {
        source: "/sedes/",
        destination: "/sedes",
        permanent: true,
      },
      {
        source: "/franquicias/",
        destination: "/franquicias",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/",
        permanent: true,
      },
      {
        source: "/faq/",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clicfit.ar",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "app.clicpilates.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
