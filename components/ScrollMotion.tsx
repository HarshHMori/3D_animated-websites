"use client";

import { useEffect } from "react";

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

export default function ScrollMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const staggerGroups = Array.from(
      document.querySelectorAll<HTMLElement>("[data-stagger]"),
    );

    staggerGroups.forEach((group) => {
      const revealType = group.dataset.stagger || "fade-up";
      const step = Number(group.dataset.staggerStep || 85);
      Array.from(group.children).forEach((child, index) => {
        if (!(child instanceof HTMLElement)) return;
        child.dataset.reveal ||= revealType;
        child.style.setProperty("--reveal-delay", `${Math.min(index * step, 420)}ms`);
      });
    });

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-scene]"),
    );
    const parallaxElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]"),
    );
    const fadeElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-fade]"),
    );

    if (prefersReducedMotion.matches) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      root.classList.add("motion-ready");
      return;
    }

    revealElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
        element.classList.add("is-visible");
      }
    });
    root.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );
    revealElements.forEach((element) => {
      if (!element.classList.contains("is-visible")) observer.observe(element);
    });

    let frame = 0;
    const updateMotion = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const mobileMultiplier = window.innerWidth < 768 ? 0.48 : 1;

      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const progress = clamp(
          (viewportHeight - rect.top) / (viewportHeight + rect.height),
        );
        scene.style.setProperty("--scene-progress", progress.toFixed(4));
      });

      parallaxElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -150 || rect.top > viewportHeight + 150) return;
        const speed = Number(element.dataset.parallax || 0.12);
        const offset =
          (rect.top + rect.height / 2 - viewportHeight / 2) *
          speed *
          mobileMultiplier;
        element.style.setProperty("--motion-y", `${offset.toFixed(2)}px`);
      });

      fadeElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const centerDistance = Math.abs(
          rect.top + rect.height / 2 - viewportHeight / 2,
        );
        const visibility = clamp(
          1 - centerDistance / ((viewportHeight + rect.height) * 0.58),
          0.16,
          1,
        );
        element.style.setProperty("--scroll-presence", visibility.toFixed(3));
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateMotion);
    };

    updateMotion();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
