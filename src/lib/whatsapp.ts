import { siteConfig } from "./content/site";

export function waLink(
  message: string,
  phone: string = siteConfig.whatsappNumber,
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function waLinkSede(sedeName: string, phone?: string): string {
  return waLink(
    `Hola Clic! Quiero reservar una clase en la sede ${sedeName}.`,
    phone,
  );
}

export function waLinkClaseGratis(): string {
  return waLink(
    "Hola Clic! Me interesa probar una clase gratis. ¿Me pasan info?",
  );
}

export function waLinkFranquicia(): string {
  return waLink(
    "Hola Clic! Me interesa información sobre franquicias. ¿Pueden contactarme?",
  );
}
