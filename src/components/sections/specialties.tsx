"use client";

import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { specialties } from "@/lib/data";

export default function Specialties() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7CFF3B]" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground">
              O que eu faço
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Especialidades
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08} variant="scale">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#7CFF3B]/0 blur-2xl transition-all duration-500 group-hover:bg-[#7CFF3B]/25" />
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-sm font-semibold text-secondary-foreground">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-heading text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
