import type { CSSProperties } from "react";
/* Упрощённые планировки объектов. Линии «прорисовываются», когда карточка появляется. */
const PLANS: Record<string, { walls: string; doors: string; labels: [number, number, string][] }> = {
  two: {
    walls: "M10 10 H310 V190 H10 Z M170 10 V120 M10 120 H120 M170 120 H310 M240 120 V190",
    doors: "M120 120 a20 20 0 0 1 20 -20 M170 140 a20 20 0 0 0 20 20 M240 150 a18 18 0 0 1 18 18",
    labels: [[85, 65, "спальня"], [240, 65, "гостиная"], [100, 160, "кухня"], [275, 160, "с/у"]],
  },
  studio: {
    walls: "M10 10 H310 V190 H10 Z M220 120 V190 M220 120 H310",
    doors: "M220 150 a20 20 0 0 0 -20 20",
    labels: [[110, 95, "кухня-гостиная"], [265, 160, "с/у"], [265, 60, "лоджия"]],
  },
  three: {
    walls: "M10 10 H310 V190 H10 Z M110 10 V110 M210 10 V110 M10 110 H310 M150 110 V190 M240 110 V190",
    doors: "M110 80 a18 18 0 0 1 18 18 M210 80 a18 18 0 0 0 -18 18 M150 140 a18 18 0 0 1 18 18",
    labels: [[60, 60, "детская"], [160, 60, "спальня"], [260, 60, "кабинет"], [80, 155, "гостиная"], [195, 155, "кухня"], [275, 155, "с/у"]],
  },
};

export function Plan({ name }: { name: string }) {
  const p = PLANS[name];
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" aria-hidden="true">
      <path className="draw" pathLength={1} d={p.walls} fill="none" stroke="#1c1d1c" strokeWidth="5" strokeLinejoin="round" />
      <path className="draw" pathLength={1} d={p.doors} fill="none" stroke="#2850c8" strokeWidth="2" style={{ "--d": "0.5s" } as CSSProperties} />
      <g fill="#55574f" fontFamily="var(--font-roboto-mono)" fontSize="11" textAnchor="middle">
        {p.labels.map(([x, y, t]) => (
          <text key={t} x={x} y={y}>
            {t}
          </text>
        ))}
      </g>
    </svg>
  );
}
