"use client";

import { useId, useState, type CSSProperties } from "react";

/* Вопросы и ответы: ответ плавно раскрывается по высоте (сетка 0fr → 1fr),
   текст проявляется и чуть выезжает, плюс поворачивается в крестик. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f, i) => {
        const isOpen = open === i;
        const panelId = `${uid}-panel-${i}`;
        const btnId = `${uid}-btn-${i}`;
        return (
          <div key={f.q} className="reveal" style={{ "--d": `${i * 0.07}s` } as CSSProperties}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold tracking-tight transition-colors duration-300 hover:text-blue"
              >
                {f.q}
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white text-xl leading-none text-orange transition-[transform,background-color] duration-500 ease-soft group-hover:bg-paper-2 ${isOpen ? "rotate-45" : ""}`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`grid transition-[grid-template-rows] duration-500 ease-soft ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p
                  className={`max-w-xl pb-6 leading-relaxed text-graphite transition-[opacity,translate] duration-500 ease-soft ${isOpen ? "translate-y-0 opacity-100 delay-100" : "-translate-y-2 opacity-0"}`}
                >
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
