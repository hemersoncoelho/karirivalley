"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Continuously tracks viewport intersection, unlike useInView (which fires once
 * and disconnects). Used to pause running animations while scrolled off-screen.
 */
export function useVisible<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}
