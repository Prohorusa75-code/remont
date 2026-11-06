"use client";

import { useEffect, useRef, useState } from "react";
import { STEPS } from "@/lib/data";

/* Этапы: линия заполняется по мере прокрутки, пройденные этапы «загораются». */
export function Steps() {
  const ref = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const probe = window.innerHeight * 0.6; // «чтение» идёт на уровне 60% экрана
      setProgress(Math.min(1, Math.max(0, (probe - r.top) / r.height)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ol ref={ref} className="relative grid gap-10 pl-14 sm:pl-20">
      <span className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-line sm:left-[27px]" aria-hidden="true" />
      <span
        className="absolute top-2 left-[19px] w-0.5 origin-top bg-orange transition-[height] duration-200 sm:left-[27px]"
        style={{ height: `calc((100% - 16px) * ${progress})` }}
        aria-hidden="true"
      />
      {STEPS.map((s, i) => {
        const on = progress >= i / STEPS.length + 0.02;
        return (
          <li key={s.title} className="relative">
            <span
              className={`absolute top-0 -left-14 grid size-10 place-items-center rounded-full border-2 font-mono text-sm font-medium transition-[background-color,border-color,color,transform] duration-500 ease-soft sm:-left-20 sm:size-14 sm:text-base ${
                on ? "scale-100 border-orange bg-orange text-ink" : "scale-90 border-line bg-paper text-graphite"
              }`}
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={`text-2xl font-bold tracking-tight transition-colors duration-500 sm:text-3xl ${on ? "text-ink" : "text-ink/65"}`}>{s.title}</h3>
            <p className={`mt-1 max-w-md transition-colors duration-500 ${on ? "text-graphite" : "text-graphite/85"}`}>{s.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
