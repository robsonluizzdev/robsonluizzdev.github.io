"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { education as staticEducation } from "@/lib/data";
import { usePortfolioContext } from "@/components/portfolio-provider";

export default function Education() {
  const { data } = usePortfolioContext();
  const education: { course: string; institution: string }[] =
    data?.education?.length ? data.education : staticEducation;

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7CFF3B]" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground">
              Educação
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Formação
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {education.map((item, i) => (
            <Reveal key={item.course} delay={i * 0.08} variant="up">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-col gap-4 rounded-3xl border border-border bg-card p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold tracking-tight">
                    {item.course}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.institution}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
