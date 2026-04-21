import { waLinkClaseGratis } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

export function WhatsAppFloat() {
  return (
    <a
      href={waLinkClaseGratis()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Reservar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-float transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
