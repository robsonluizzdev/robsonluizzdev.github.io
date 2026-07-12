import { Reveal } from "@/components/motion/reveal";
import AnimatedCounter from "@/components/animated-counter";
import { stats } from "@/lib/data";

export default function Stats() {
  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-card p-8 md:grid-cols-4 md:p-12">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} variant="scale">
              <div className="text-center">
                <p className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
