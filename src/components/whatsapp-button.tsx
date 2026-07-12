"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappNumber } from "@/lib/data";

export default function WhatsappButton() {
  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      data-cursor-hover
      aria-label="Conversar no WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="glow-shadow fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#7CFF3B] text-[#111111] shadow-lg md:bottom-8 md:right-8"
    >
      <MessageCircle size={26} strokeWidth={2.2} />
    </motion.a>
  );
}
