"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

/** The muted half of a two-tone heading darkens as it scrolls up the screen, word by word, to a softer tone than the lead (owner,
    2026-10-31). Words start at 35% ink and each reaches 62% in turn between the heading
    entering the lower part of the screen and passing the middle. Opacity only; reduced motion shows the settled tone. */
// 35% ink is the old muted grey; it settles at 62% ink so the lead stays the only full-ink part and still reads as
// the main message (owner, 2026-10-31: "not total black, a little faded")
const FROM = 0.6; // unfilled words still read at 4.5:1 (body-size words too); 0.35 was 2.3:1 (a11y pass, 2026-11-03)
const TO = 0.62;

export function ScrollFill({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.45"] });
  const words = text.split(" ");
  return (
    <span ref={ref} className="text-ink">
      {words.map((w, i) => (
        <Word key={i} p={scrollYProgress} from={i / words.length} to={(i + 1) / words.length} still={!!reduce}>
          {w}{i < words.length - 1 ? " " : ""}
        </Word>
      ))}
    </span>
  );
}

function Word({ p, from, to, still, children }: { p: MotionValue<number>; from: number; to: number; still: boolean; children: ReactNode }) {
  const opacity = useTransform(p, [from, to], [FROM, TO]);
  return <motion.span style={{ opacity: still ? TO : opacity }}>{children}</motion.span>;
}
