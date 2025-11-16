"use client";

import { motion } from "framer-motion";

interface ExplanationBoxProps {
  title: string;
  children: React.ReactNode;
}

export default function ExplanationBox({
  title,
  children,
}: ExplanationBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full lg:w-[40%] p-4 rounded-lg bg-[--color-card] border border-[--color-border]"
    >
      <h4 className="text-lg font-semibold text-[--color-label] mb-2">
        {title}
      </h4>
      <div className="text-sm text-[--color-text] space-y-2">{children}</div>
    </motion.div>
  );
}