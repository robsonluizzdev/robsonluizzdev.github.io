"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import {
  contactInfo as staticContactInfo,
  email as staticEmail,
  whatsappNumber as staticWhatsapp,
} from "@/lib/data";
import { usePortfolioContext } from "@/components/portfolio-provider";

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.37 4.25 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

const contactIcons: Record<string, ComponentType<{ size?: number }>> = {
  Email: Mail,
  Telefone: Phone,
  LinkedIn: LinkedinIcon,
  WhatsApp: MessageCircle,
};

export default function Contact() {
  const { data } = usePortfolioContext();
  const c = data?.contact;
  const email = c?.email || staticEmail;
  const whatsappNumber = c?.whatsapp || staticWhatsapp;
  const contactInfo = c
    ? [
        { label: "Email", value: c.email, href: `mailto:${c.email}` },
        {
          label: "Telefone",
          value: c.phone,
          href: `tel:+${(c.whatsapp || "").replace(/\D/g, "")}`,
        },
        {
          label: "LinkedIn",
          value: c.linkedin,
          href: c.linkedin?.startsWith("http")
            ? c.linkedin
            : `https://${c.linkedin}`,
        },
        {
          label: "WhatsApp",
          value: "Enviar mensagem",
          href: `https://wa.me/${c.whatsapp}`,
        },
      ]
    : staticContactInfo;

  return (
    <section id="contato" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#7CFF3B]/20 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 text-center md:px-10">
        <Reveal>
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7CFF3B]" />
            <span className="text-sm font-medium tracking-wide text-muted-foreground">
              Contato
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05} variant="blur">
          <h2 className="font-heading text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            VAMOS
            <br />
            CRIAR
            <br />
            ALGO <span className="text-[#7CFF3B] text-glow">INCRÍVEL?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${email}`}
              data-cursor-hover
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-all hover:bg-[#7CFF3B] hover:text-[#111111]"
            >
              Entrar em Contato
              <ArrowUpRight size={16} />
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-sm font-medium text-foreground transition-all hover:border-[#7CFF3B] hover:shadow-[0_0_0_4px_rgba(124,255,59,0.15)]"
            >
              <MessageCircle size={16} />
              Chamar no WhatsApp
            </a>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          {contactInfo.map((info, i) => {
            const Icon = contactIcons[info.label];
            return (
              <Reveal key={info.label} delay={i * 0.06} variant="up">
                <motion.a
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  data-cursor-hover
                  whileHover={{ y: -4 }}
                  className="flex h-20 items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card px-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {info.label}
                    </span>
                    <span className="block overflow-x-auto whitespace-nowrap text-sm font-medium leading-snug text-foreground no-scrollbar">
                      {info.value}
                    </span>
                  </span>
                </motion.a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
