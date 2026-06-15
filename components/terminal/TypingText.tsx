
'use client';

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function TypingText({
  text,
  speed = 28,
  startDelay = 0,
  className,
  onDone,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  onDone?: () => void;
}) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(reduce ? text : "");

  useEffect(() => {
    if (reduce) {
      setOut(text);
      onDone?.();
      return;
    }
    setOut("");
    let i = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          onDone?.();
        }
      }, speed);
    }, startDelay);
    return () => clearTimeout(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className={className}>
      {out}
      <span className="caret-blink ml-0.5 inline-block h-[1em] w-[0.55ch] -translate-y-[2px] bg-primary align-middle" />
    </span>
  );
}
