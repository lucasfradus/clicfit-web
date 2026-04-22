import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ClaseGratisTrigger } from "@/components/ui/ClaseGratisModal";

export function WhatsAppFloat() {
  return (
    <ClaseGratisTrigger
      aria-label="Reservar clase gratis por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-float transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="size-7" />
    </ClaseGratisTrigger>
  );
}
