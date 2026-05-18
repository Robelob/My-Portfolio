import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── Types ───────────────────────────────────────────────────────────────── */

export interface ScrollAnimationOptions {
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  start?: string;
  toggleActions?: string;
}

export interface StaggerAnimationOptions {
  childSelector?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  stagger?: number;
  start?: string;
}

/* ─── useScrollAnimation ──────────────────────────────────────────────────── */
/**
 * Animates a single element into view when it enters the viewport.
 * Defaults to a fade-up effect. Skipped when prefers-reduced-motion is set.
 */
export function useScrollAnimation(
  ref: RefObject<Element | null>,
  options: ScrollAnimationOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0, x: 0 });
      return;
    }

    const from: gsap.TweenVars = options.from ?? { opacity: 0, y: 48 };
    const to: gsap.TweenVars = options.to ?? {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    };
    const start = options.start ?? "top 85%";
    const toggleActions = options.toggleActions ?? "play none none none";

    const ctx = gsap.context(() => {
      gsap.fromTo(el, from, {
        ...to,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions,
        },
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ─── useStaggerAnimation ─────────────────────────────────────────────────── */
/**
 * Animates a list of children inside `containerRef` with a staggered fade-up.
 * `childSelector` defaults to all direct children (":scope > *").
 */
export function useStaggerAnimation(
  containerRef: RefObject<Element | null>,
  options: StaggerAnimationOptions = {},
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const childSelector = options.childSelector ?? ":scope > *";
    const from: gsap.TweenVars = options.from ?? { opacity: 0, y: 48 };
    const to: gsap.TweenVars = options.to ?? {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
    };
    const stagger = options.stagger ?? 0.12;
    const start = options.start ?? "top 85%";

    if (prefersReducedMotion()) {
      const children = container.querySelectorAll(childSelector);
      children.forEach((child) => gsap.set(child, { opacity: 1, y: 0, x: 0 }));
      return;
    }

    const ctx = gsap.context(() => {
      const children = container.querySelectorAll(childSelector);
      gsap.fromTo(children, from, {
        ...to,
        stagger,
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: "play none none none",
        },
      });
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
