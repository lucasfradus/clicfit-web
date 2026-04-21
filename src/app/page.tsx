import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Disciplinas } from "@/components/sections/Disciplinas";
import { Sedes } from "@/components/sections/Sedes";
import { Nutricion } from "@/components/sections/Nutricion";
import { Franquicias } from "@/components/sections/Franquicias";
import { CtaFinal } from "@/components/sections/CtaFinal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Disciplinas />
      <Sedes />
      <Nutricion />
      <Franquicias />
      <CtaFinal />
    </>
  );
}
