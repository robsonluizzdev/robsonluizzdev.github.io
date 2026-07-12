"use client";

import { Reveal } from "@/components/motion/reveal";
import { usePortfolioContext } from "@/components/portfolio-provider";

const staticBio =
  "Sou profissional da área de Tecnologia da Informação com experiência em desenvolvimento de software, infraestrutura, suporte corporativo, automação de processos e criação de soluções digitais. Tenho experiência em Python, Java, JavaScript, PHP, Linux, Windows Server, Redes, Banco de Dados, APIs, Desenvolvimento Web e Infraestrutura. Busco desenvolver sistemas modernos que entreguem desempenho, qualidade e ótima experiência ao usuário.";

export default function About() {
  const { data } = usePortfolioContext();
  const bio: string = data?.about?.bio?.trim() ? data.about.bio : staticBio;

  return (
    <section id="sobre" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7CFF3B]" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground">
              Sobre mim
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Quem Sou
          </h2>
        </Reveal>

        <div className="mt-10 max-w-3xl">
          <Reveal delay={0.1} variant="blur">
            <p className="text-lg leading-relaxed text-foreground/85 whitespace-pre-line">
              {bio}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
