"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useAnimation,
} from "framer-motion";

interface CollapsibleSectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({
        boxShadow: [
          "0 0 0px 0px var(--color-accent)",
          "0 0 20px 5px var(--color-accent)",
          "0 0 0px 0px var(--color-accent)",
        ],
        transition: {
          duration: 1.5,
          repeat: 1,
          repeatType: "mirror",
          ease: "easeInOut",
        },
      });
    }
  }, [inView, controls]);

  return (
    <div ref={ref} className="relative">
      <motion.div
        className="absolute -inset-2 rounded-full"
        animate={controls}
      />
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-6 w-6 text-[--color-label] transition-colors"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <path
          fillRule="evenodd"
          d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
          clipRule="evenodd"
        />
      </motion.svg>
    </div>
  );
};

export default function CollapsibleSectionCard({
  title,
  subtitle,
  children,
}: CollapsibleSectionCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative rounded-xl border border-[--color-border] bg-[--color-card] mt-12">
      <header
        className="flex justify-between items-center p-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h2 className="text-4xl font-bold text-[--color-title]">{title}</h2>
          {subtitle && (
            <p className="text-sm text-[--color-text] mt-1">{subtitle}</p>
          )}
        </div>
        <ChevronIcon isOpen={isOpen} />
      </header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.1 }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}