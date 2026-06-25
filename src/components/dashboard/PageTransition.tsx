"use client";

import { motion } from "motion/react";

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
  >
    {children}
  </motion.div>
);
