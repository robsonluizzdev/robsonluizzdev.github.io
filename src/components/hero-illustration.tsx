"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroIllustration() {
  return (
    <div className="relative mx-auto flex h-[440px] w-full max-w-[420px] items-center justify-center md:h-[560px] md:max-w-[480px]">
      {/* glow backdrop */}
      <div className="absolute h-72 w-72 rounded-full bg-[#7CFF3B]/30 blur-[100px] md:h-96 md:w-96" />

      {/* holographic rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#7CFF3B]/30"
          style={{
            width: `${240 + i * 80}px`,
            height: `${240 + i * 80}px`,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 18 + i * 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            className="absolute h-2.5 w-2.5 rounded-full bg-[#7CFF3B]"
            style={{ top: -5, left: "50%" }}
          />
        </motion.div>
      ))}

      {/* photo card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 h-72 w-60 overflow-hidden rounded-[2.5rem] border border-white/60 shadow-2xl md:h-96 md:w-80"
      >
        <Image
          src="/images/robson-luiz.png"
          alt="Robson Luiz"
          fill
          priority
          sizes="(min-width: 768px) 320px, 240px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#7CFF3B]/15 via-transparent to-transparent" />
      </motion.div>

      {/* floating chips — always on top, kept within bounds so nothing clips */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="glass glow-shadow absolute left-0 top-10 z-20 rounded-2xl px-4 py-3 text-xs font-medium shadow-lg md:left-2"
      >
        {"</>"} Clean Code
      </motion.div>

      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="glass glow-shadow absolute right-0 top-1/3 z-20 rounded-2xl px-4 py-3 text-xs font-medium shadow-lg md:right-2"
      >
        ⬡ Infraestrutura
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="glass glow-shadow absolute bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-2xl px-4 py-3 text-xs font-medium shadow-lg"
      >
        ⚡ 99% Uptime
      </motion.div>
    </div>
  );
}
