"use client";

import { useEffect, useRef, useState } from "react";

/* Сравнение «до / после»: одна и та же комната — голый бетон и готовый интерьер.
   Ползунок тянется мышью и пальцем, стрелками с клавиатуры (это обычный range),
   а при первом показе сам проезжает туда-обратно, чтобы было понятно, что его можно двигать. */

const ROOM = {
  ceiling: "0,0 800,0 680,60 120,60",
  left: "0,0 120,60 120,420 0,600",
  right: "800,0 680,60 680,420 800,600",
  back: "120,60 680,60 680,420 120,420",
  floor: "0,600 120,420 680,420 800,600",
};

function After() {
  return (
    <svg viewBox="0 0 800 600" className="absolute inset-0 size-full" aria-hidden="true">
      <polygon points={ROOM.ceiling} fill="#f5f0e7" />
      <polygon points={ROOM.left} fill="#e2d3bf" />
      <polygon points={ROOM.right} fill="#dccbb5" />
      <polygon points={ROOM.back} fill="#ebdfcd" />
      <polygon points={ROOM.floor} fill="#b98656" />
      {/* доски пола */}
      <g stroke="#a3734a" strokeWidth="2">
        {[-260, -150, -40, 70, 180, 290].map((d) => (
          <line key={d} x1={400 + d * 0.43} y1="420" x2={400 + d * 1.25} y2="600" />
        ))}
      </g>
      <line x1="120" y1="412" x2="680" y2="412" stroke="#fff" strokeWidth="6" />
      {/* окно со шторами */}
      <rect x="430" y="120" width="170" height="210" fill="#cfe3f2" />
      <rect x="430" y="120" width="170" height="210" fill="none" stroke="#fff" strokeWidth="10" />
      <line x1="515" y1="120" x2="515" y2="330" stroke="#fff" strokeWidth="6" />
      <path d="M415 105 h18 v240 q-20 -60 -18 -240Z M597 105 h18 q2 180 -18 240Z" fill="#8fa889" />
      <rect x="405" y="98" width="220" height="8" rx="4" fill="#5f5a50" />
      {/* картина */}
      <rect x="175" y="140" width="150" height="105" fill="#fff" stroke="#3b3a36" strokeWidth="5" />
      <circle cx="225" cy="190" r="26" fill="#ff6a1a" />
      <rect x="250" y="175" width="55" height="52" fill="#2850c8" opacity=".85" />
      {/* подвесной светильник */}
      <line x1="300" y1="0" x2="300" y2="70" stroke="#3b3a36" strokeWidth="3" />
      <path d="M270 70 h60 l14 30 h-88Z" fill="#3b3a36" />
      <circle cx="300" cy="112" r="40" fill="#ffd98a" opacity=".35" />
      {/* ковёр, диван, подушки */}
      <ellipse cx="300" cy="500" rx="190" ry="45" fill="#e9d8c0" />
      <rect x="160" y="325" width="250" height="95" rx="18" fill="#4f6b8a" />
      <rect x="150" y="355" width="270" height="70" rx="16" fill="#5b7a9c" />
      <rect x="185" y="335" width="70" height="45" rx="12" fill="#f2c27d" />
      <rect x="320" y="338" width="62" height="42" rx="12" fill="#e9dccb" />
      <rect x="165" y="420" width="12" height="22" fill="#3b3a36" />
      <rect x="393" y="420" width="12" height="22" fill="#3b3a36" />
      {/* растение */}
      <path d="M612 330 q-40 -60 -6 -120 q10 50 6 120Z M616 330 q30 -70 64 -90 q-16 60 -64 90Z M610 330 q-60 -20 -80 -70 q50 10 80 70Z" fill="#5e8a5a" />
      <path d="M588 330 h52 l-8 68 h-36Z" fill="#c9734a" />
    </svg>
  );
}

function Before() {
  return (
    <svg viewBox="0 0 800 600" className="absolute inset-0 size-full" aria-hidden="true">
      <polygon points={ROOM.ceiling} fill="#cbc8c1" />
      <polygon points={ROOM.left} fill="#a9a59e" />
      <polygon points={ROOM.right} fill="#a29e96" />
      <polygon points={ROOM.back} fill="#bcb9b2" />
      <polygon points={ROOM.floor} fill="#8f8b84" />
      {/* пятна штукатурки и трещины */}
      <g fill="#a7a39c">
        <rect x="160" y="90" width="120" height="60" />
        <rect x="300" y="260" width="90" height="110" />
        <rect x="610" y="350" width="60" height="50" />
      </g>
      <path d="M200 260 l20 30 l-8 25 l25 40 M640 80 l-15 40 l10 20 l-20 50" stroke="#7d7a73" strokeWidth="3" fill="none" />
      <ellipse cx="520" cy="530" rx="110" ry="22" fill="#837f78" />
      <ellipse cx="220" cy="470" rx="60" ry="12" fill="#9b978f" />
      {/* оконный проём с плёнкой */}
      <rect x="430" y="120" width="170" height="210" fill="#d8dde1" />
      <path d="M430 120 L600 330 M600 120 L430 330" stroke="#c4c9cd" strokeWidth="6" />
      <rect x="430" y="120" width="170" height="210" fill="none" stroke="#8a867f" strokeWidth="6" />
      {/* провода и голая лампочка */}
      <path d="M150 110 q20 40 -10 70 q-25 25 5 55" stroke="#3b3a36" strokeWidth="4" fill="none" />
      <path d="M660 300 q-20 30 0 60" stroke="#c0392b" strokeWidth="4" fill="none" />
      <line x1="300" y1="0" x2="300" y2="95" stroke="#3b3a36" strokeWidth="3" />
      <g className="flicker">
        <circle cx="300" cy="110" r="45" fill="#fff6c8" opacity=".35" />
        <circle cx="300" cy="108" r="13" fill="#fff3b0" />
      </g>
      {/* стремянка, ведро, мешки */}
      <path d="M210 520 L265 300 L320 520 M228 450 h74 M243 390 h44" stroke="#d2a04a" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M560 470 h70 l-10 70 h-50Z" fill="#e2e0db" stroke="#9b978f" strokeWidth="3" />
      <ellipse cx="595" cy="470" rx="35" ry="8" fill="#cfccc6" />
      <rect x="420" y="480" width="90" height="55" rx="8" fill="#d6cdb8" />
      <rect x="440" y="455" width="80" height="45" rx="8" fill="#cdc3ac" />
    </svg>
  );
}

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const touched = useRef(false);
  const box = useRef<HTMLDivElement>(null);

  // при первом появлении на экране — один раз показываем, как работает слайдер
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const frames: [number, number][] = [[0, 50], [700, 78], [1500, 24], [2300, 50]];
      const t0 = performance.now();
      const ease = (k: number) => 1 - Math.pow(1 - k, 3);
      const tick = (now: number) => {
        if (touched.current) return;
        const t = now - t0;
        const i = frames.findIndex(([ft], j) => j < frames.length - 1 && t >= ft && t < frames[j + 1][0]);
        if (i === -1) return setPos(50);
        const [ta, va] = frames[i];
        const [tb, vb] = frames[i + 1];
        setPos(va + (vb - va) * ease((t - ta) / (tb - ta)));
        raf = requestAnimationFrame(tick);
      };
      setTimeout(() => (raf = requestAnimationFrame(tick)), 600);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={box} className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-line bg-paper-2 select-none">
      <After />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Before />
      </div>
      <span className="absolute top-4 left-4 rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-wider text-paper uppercase">До</span>
      <span className="absolute top-4 right-4 rounded-full bg-orange px-3 py-1 font-mono text-xs tracking-wider text-ink uppercase">После</span>
      {/* линия и ручка */}
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_#1c1d1c33]" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 grid size-12 -translate-1/2 place-items-center rounded-full bg-white font-mono text-lg text-ink shadow-[0_8px_24px_-6px_#1c1d1c66]">
          ⇆
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={0.5}
        value={pos}
        onChange={(e) => {
          touched.current = true;
          setPos(Number(e.target.value));
        }}
        onPointerDown={() => (touched.current = true)}
        aria-label="Сравнить квартиру до и после ремонта"
        aria-valuetext={`До ремонта — ${Math.round(pos)}% картинки`}
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
