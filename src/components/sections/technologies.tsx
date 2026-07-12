"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { technologies as staticTechnologies } from "@/lib/data";
import { usePortfolioContext } from "@/components/portfolio-provider";

export default function Technologies() {
  const { data } = usePortfolioContext();
  const technologies: string[] =
    data?.technologies?.length ? data.technologies : staticTechnologies;

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7CFF3B]" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground">
              Stack
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Tecnologias
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {technologies.map((tech, i) => (
            <Reveal key={tech} delay={(i % 10) * 0.04} variant="scale">
              <motion.div
                whileHover={{ scale: 1.05, borderColor: "#7CFF3B" }}
                transition={{ duration: 0.25 }}
                className="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card text-center"
              >
                <span className="text-sm font-medium text-foreground">
                  {tech}
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
