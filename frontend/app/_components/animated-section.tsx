"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  type?: "scroll" | "initial";
  className?: string;
}

export default function AnimatedSection({
  children,
  delay = 0,
  direction = "up",
  type = "scroll",
  className = "",
}: AnimatedSectionProps) {
  // Define direction-based animations
  const getDirectionAnimation = () => {
    switch (direction) {
      case "up":
        return { y: 50 };
      case "down":
        return { y: -50 };
      case "left":
        return { x: 50 };
      case "right":
        return { x: -50 };
      default:
        return { y: 50 };
    }
  };

  // Common animation settings
  const initial = { opacity: 0, ...getDirectionAnimation() };
  const animate = { opacity: 1, y: 0, x: 0 };
  const transition = { duration: 0.8, delay };

  // For scroll animations vs initial load animations
  const animationProps = type === "scroll"
    ? {
        initial,
        whileInView: animate,
        viewport: { once: true },
        transition,
      }
    : {
        initial,
        animate,
        transition,
      };

  return (
    <motion.div className={className} {...animationProps}>
      {children}
    </motion.div>
  );
}