"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { ComponentType } from "react";
import { useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import ProjectModal from "@/components/project-modal";
import SixGramLogo from "@/components/logos/sixgram-logo";
import FinTrackLogo from "@/components/logos/fintrack-logo";
import LexAureaLogo from "@/components/logos/lexaurea-logo";
import { projects as staticProjects } from "@/lib/data";
import { usePortfolioContext } from "@/components/portfolio-provider";

const logos: Record<string, ComponentType<{ className?: string }>> = {
  SixGram: SixGramLogo,
  "FinTrack Dashboard": FinTrackLogo,
  "LEX & AUREA Advogados": LexAureaLogo,
};

// Screenshots are static assets keyed by project name
const screenshots: Record<string, string> = {
  SixGram: "/projects/sixgram/screenshot.png",
  "FinTrack Dashboard": "/projects/fintrack/screenshot.png",
  "LEX & AUREA Advogados": "/projects/lexaurea/screenshot.png",
};

type ProjectItem = {
  name: string;
  description: string;
  tech: string[];
  demoUrl?: string;
  screenshot?: string;
};

export default function Projects() {
  const { data } = usePortfolioContext();
  const projects: ProjectItem[] = data?.projects?.length
    ? data.projects.map((p: ProjectItem) => ({
        ...p,
        // Prefer uploaded screenshot; fall back to bundled asset by name
        screenshot: p.screenshot || screenshots[p.name],
      }))
    : staticProjects;

  const [activeProject, setActiveProject] = useState<number | null>(null);
  const active = activeProject !== null ? projects[activeProject] : null;

  return (
    <section id="projetos" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7CFF3B]" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground">
              Portfólio
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Projetos em Destaque
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.name} delay={(i % 3) * 0.08} variant="up">
              <motion.div
                whileHover="hover"
                initial="rest"
                className="group relative overflow-hidden rounded-3xl border border-border bg-card"
              >
                <motion.div
                  variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.04 },
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-[#111111] to-[#2a2a2a]"
                >
                  {project.screenshot ? (
                    <>
                      <Image
                        src={project.screenshot}
                        alt={`Screenshot do projeto ${project.name}`}
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                        className="object-cover object-top opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                      {logos[project.name] ? (
                        (() => {
                          const Logo = logos[project.name];
                          return <Logo className="relative z-10" />;
                        })()
                      ) : (
                        <span className="font-heading relative z-10 text-2xl font-semibold text-white/90">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <motion.div
                        variants={{
                          rest: { opacity: 0.25, scale: 1 },
                          hover: { opacity: 0.5, scale: 1.3 },
                        }}
                        transition={{ duration: 0.6 }}
                        className="absolute h-32 w-32 rounded-full bg-[#7CFF3B] blur-3xl"
                      />
                      <span className="font-heading relative z-10 text-2xl font-semibold text-white/90">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </>
                  )}
                </motion.div>

                <div className="p-7">
                  <h3 className="font-heading text-xl font-semibold tracking-tight">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {project.demoUrl ? (
                    <button
                      type="button"
                      data-cursor-hover
                      onClick={() => setActiveProject(i)}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors"
                    >
                      Ver Projeto
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </button>
                  ) : (
                    <a
                      href="#"
                      data-cursor-hover
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors"
                    >
                      Ver Projeto
                      <ArrowUpRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  )}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>

      {active?.demoUrl && (
        <ProjectModal
          open={activeProject !== null}
          onClose={() => setActiveProject(null)}
          title={active.name}
          demoUrl={active.demoUrl}
        />
      )}
    </section>
  );
}
