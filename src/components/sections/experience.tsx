"use client";

import { Reveal } from "@/components/motion/reveal";
import { experience as staticExperience } from "@/lib/data";
import { usePortfolioContext } from "@/components/portfolio-provider";

export default function Experience() {
  const { data } = usePortfolioContext();
  const experience: { company: string; role: string; items: string[] }[] =
    data?.experiences?.length ? data.experiences : staticExperience;

  return (
    <section id="experiencia" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7CFF3B]" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground">
              Trajetória
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Experiência
          </h2>
        </Reveal>

        <div className="relative mt-16 pl-8">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#7CFF3B] via-border to-transparent" />

          <div className="flex flex-col gap-14">
            {experience.map((exp, i) => (
              <Reveal key={exp.company} delay={i * 0.08} variant="left">
                <div className="relative">
                  <span className="absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[#7CFF3B] bg-card" />
                  <p className="text-xs font-medium tracking-wide text-muted-foreground">
                    {exp.role}
                  </p>
                  <h3 className="font-heading mt-1 text-2xl font-semibold tracking-tight">
                    {exp.company}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {exp.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-foreground/70"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
