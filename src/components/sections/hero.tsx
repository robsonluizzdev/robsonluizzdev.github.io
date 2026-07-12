"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Mail } from "lucide-react";
import { heroBadges } from "@/lib/data";
import HeroIllustration from "@/components/hero-illustration";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center pt-28 pb-16 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-[#7CFF3B]/20 blur-[120px]" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-secondary/60 blur-[100px]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:px-10">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 text-sm font-medium tracking-wide text-muted-foreground"
          >
            Olá, eu sou
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-3xl font-semibold tracking-tight md:text-4xl"
          >
            ROBSON LUIZ
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading mt-3 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            CONSTRUINDO
            <br />
            O <span className="text-[#7CFF3B] text-glow">FUTURO</span>
            <br />
            COM TECNOLOGIA.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Desenvolvedor Full Stack especializado em criar aplicações
            modernas, sistemas inteligentes, infraestrutura corporativa e
            soluções escaláveis utilizando as melhores tecnologias do
            mercado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-nowrap items-center gap-1 overflow-x-auto no-scrollbar xl:gap-3"
          >
            <a
              href="#projetos"
              data-cursor-hover
              className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-foreground px-3 py-2.5 text-xs font-medium text-background transition-all hover:bg-[#7CFF3B] hover:text-[#111111] xl:gap-2 xl:px-5 xl:py-3.5 xl:text-sm"
            >
              Ver Projetos
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href="#contato"
              data-cursor-hover
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3 py-2.5 text-xs font-medium text-foreground transition-all hover:border-[#7CFF3B] hover:shadow-[0_0_0_4px_rgba(124,255,59,0.15)] xl:gap-2 xl:px-5 xl:py-3.5 xl:text-sm"
            >
              <Mail size={16} />
              <span className="xl:hidden">Contato</span>
              <span className="hidden xl:inline">Entrar em Contato</span>
            </a>
            <a
              href="/curriculo-robson-luiz.pdf"
              download
              data-cursor-hover
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3 py-2.5 text-xs font-medium text-foreground transition-all hover:border-[#7CFF3B] hover:shadow-[0_0_0_4px_rgba(124,255,59,0.15)] xl:gap-2 xl:px-5 xl:py-3.5 xl:text-sm"
            >
              <Download size={16} />
              <span className="xl:hidden">Currículo</span>
              <span className="hidden xl:inline">Baixar Currículo</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap gap-2.5"
          >
            {heroBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground/70"
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}
