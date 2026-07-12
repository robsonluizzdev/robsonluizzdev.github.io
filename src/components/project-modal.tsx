"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Laptop, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

type ProjectModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  demoUrl: string;
};

export default function ProjectModal({
  open,
  onClose,
  title,
  demoUrl,
}: ProjectModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-4">
              <h3 className="font-heading truncate text-base font-semibold text-foreground sm:text-lg">
                {title}
              </h3>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {isMobile ? <Smartphone size={14} /> : <Laptop size={14} />}
                  <span className="hidden sm:inline">
                    {isMobile ? "Visualizando em Mobile" : "Visualizando em Desktop"}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-[#7CFF3B]"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-auto bg-[#0a0b0d] p-0 sm:p-6">
              <div className="h-full w-full overflow-hidden sm:rounded-2xl sm:border sm:border-zinc-800">
                <iframe
                  src={demoUrl}
                  title={title}
                  className="h-full w-full border-0 bg-white"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
