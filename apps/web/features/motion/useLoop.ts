"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

/** Loops only while on screen. Under reduced motion `play` stays false and the art shows its finished frame. */
export function useLoop<T extends Element>(amount = 0.35) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const reduce = useReducedMotion();
  return { ref, play: inView && !reduce };
}
