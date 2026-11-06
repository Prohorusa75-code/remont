"use client";

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { TYPES, type RepairType } from "@/lib/data";

/* Калькулятор сметы и заявка на замер — с общим состоянием:
   то, что посчитали в калькуляторе, само подставляется в заявку. */

const DESIGN_PROJECT = 25; // BYN/м²
const TRASH = 250; // BYN за весь объект
const OLD_FLAT = 0.12; // вторичка: +12% на демонтаж

type State = { area: number; type: RepairType["id"]; old: boolean; project: boolean; trash: boolean };
type Calc = State & { set: (p: Partial<State>) => void; total: number; perM2: number; weeks: number; typeTitle: string };

const Ctx = createContext<Calc | null>(null);
const useEstimate = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("EstimateProvider is missing");
  return c;
};

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>({ area: 54, type: "capital", old: true, project: false, trash: true });
  const value = useMemo<Calc>(() => {
    const t = TYPES.find((x) => x.id === s.type)!;
    const project = s.type === "design" ? 0 : s.project ? DESIGN_PROJECT : 0; // в дизайнерском проект уже включён
    let total = s.area * (t.price + project);
    if (s.old) total *= 1 + OLD_FLAT;
    if (s.trash) total += TRASH;
    const weeks = Math.max(t.minWeeks, Math.ceil((s.area / 10) * t.weeksPer10 + (s.old ? 1 : 0)));
    return {
      ...s,
      set: (p) => setS((prev) => ({ ...prev, ...p })),
      total: Math.round(total / 10) * 10,
      perM2: Math.round(total / s.area),
      weeks,
      typeTitle: t.title,
    };
  }, [s]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

const byn = (n: number) => `${Math.round(n).toLocaleString("ru-RU")} BYN`;

/* число плавно «докручивается» до нового значения */
function useTween(target: number, ms = 600) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      const next = a + (target - a) * (1 - Math.pow(1 - k, 3));
      from.current = next;
      setV(next);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Check({ checked, onChange, label, note, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; note: string; disabled?: boolean }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white/60 p-4 transition-colors hover:border-blue/40 ${disabled ? "cursor-default opacity-60" : ""}`}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-5 accent-orange" />
      <span>
        <span className="block font-semibold">{label}</span>
        <span className="font-mono text-xs text-graphite">{note}</span>
      </span>
    </label>
  );
}

export function Calculator() {
  const c = useEstimate();
  const total = useTween(c.total);
  const weeks = useTween(c.weeks);
  const uid = useId();
  const pct = ((c.area - 20) / 180) * 100;

  return (
    <div className="reveal grid overflow-hidden rounded-[28px] border border-line bg-paper lg:grid-cols-[1.35fr_1fr]">
      <div className="flex flex-col gap-7 p-6 sm:p-9">
        <div>
          <div className="mb-3 flex items-end justify-between">
            <label htmlFor={`${uid}-area`} className="font-semibold">Площадь квартиры</label>
            <output htmlFor={`${uid}-area`} className="text-3xl font-bold tabular-nums">
              {c.area}&nbsp;<span className="text-xl">м²</span>
            </output>
          </div>
          <input
            id={`${uid}-area`}
            type="range"
            min={20}
            max={200}
            value={c.area}
            onChange={(e) => c.set({ area: Number(e.target.value) })}
            className="h-2 w-full cursor-pointer appearance-none rounded-full accent-orange"
            style={{ background: `linear-gradient(90deg, #ff6a1a ${pct}%, #1c1d1c1f ${pct}%)` }}
          />
          <div className="mt-2 flex justify-between font-mono text-xs text-graphite">
            <span>20 м²</span>
            <span>200 м²</span>
          </div>
        </div>

        <div>
          <p id={`${uid}-type`} className="mb-3 font-semibold">Тип ремонта</p>
          <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-labelledby={`${uid}-type`}>
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={c.type === t.id}
                onClick={() => c.set({ type: t.id })}
                className={`rounded-2xl border p-4 text-left transition-[background-color,border-color,color,transform] duration-300 active:scale-[0.98] ${
                  c.type === t.id ? "border-ink bg-ink text-paper" : "border-line bg-white/60 hover:border-ink/40"
                }`}
              >
                <span className="block font-semibold">{t.title}</span>
                <span className={`font-mono text-xs ${c.type === t.id ? "text-paper/70" : "text-graphite"}`}>от {t.price} BYN/м²</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p id={`${uid}-flat`} className="mb-3 font-semibold">Жильё</p>
          <div className="inline-flex rounded-full border border-line bg-white/60 p-1" role="radiogroup" aria-labelledby={`${uid}-flat`}>
            {[
              [false, "Новостройка"],
              [true, "Вторичка"],
            ].map(([v, label]) => (
              <button
                key={String(label)}
                type="button"
                role="radio"
                aria-checked={c.old === v}
                onClick={() => c.set({ old: v as boolean })}
                className={`rounded-full px-5 py-2 font-semibold transition-colors duration-300 ${c.old === v ? "bg-blue text-white" : "text-graphite hover:text-ink"}`}
              >
                {label as string}
              </button>
            ))}
          </div>
          <p className="mt-2 font-mono text-xs text-graphite">Во вторичке добавляется демонтаж старой отделки (+12%).</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Check
            checked={c.type === "design" || c.project}
            disabled={c.type === "design"}
            onChange={(v) => c.set({ project: v })}
            label="Дизайн-проект"
            note={c.type === "design" ? "уже входит в дизайнерский" : `+${DESIGN_PROJECT} BYN/м²`}
          />
          <Check checked={c.trash} onChange={(v) => c.set({ trash: v })} label="Вывоз мусора" note={`+${TRASH} BYN за объект`} />
        </div>
      </div>

      {/* итог — «технический штамп» чертежа */}
      <div className="flex flex-col justify-between gap-8 bg-ink p-6 text-paper sm:p-9">
        <div>
          <p className="font-mono text-xs tracking-widest text-paper/60 uppercase">Предварительная смета</p>
          <p className="mt-3 text-[clamp(40px,5vw,60px)] leading-none font-bold tracking-tight tabular-nums" aria-live="polite">
            {byn(total)}
          </p>
          <p className="mt-2 font-mono text-sm text-paper/70">≈ {c.perM2} BYN за м² · работа и черновые материалы</p>
        </div>
        <dl className="grid grid-cols-[auto_1fr] border-t border-paper/15 font-mono text-sm">
          <div className="border-r border-paper/15 py-4 pr-4">
            <dt className="text-paper/60">Срок</dt>
            <dd className="mt-1 text-xl font-medium text-paper tabular-nums sm:text-2xl">~{Math.round(weeks)} нед.</dd>
          </div>
          <div className="py-4 pl-4">
            <dt className="text-paper/60">Тип</dt>
            <dd className="mt-1 text-lg font-medium break-words text-paper sm:text-2xl">{c.typeTitle}</dd>
          </div>
        </dl>
        <div>
          <a
            href="#order"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-orange px-6 py-3 text-center leading-tight font-semibold text-ink transition-[transform,background-color] duration-300 ease-soft hover:-translate-y-0.5 hover:bg-orange-light"
          >
            Зафиксировать цену на замере →
          </a>
          <p className="mt-3 font-mono text-xs text-paper/50">Расчёт примерный: это концепт. Точную смету даём после бесплатного замера.</p>
        </div>
      </div>
    </div>
  );
}

/* Белорусский номер: +375 XX XXX-XX-XX */
function toBelarusDigits(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("80")) d = "375" + d.slice(2);
  else if (!d.startsWith("375") && d.length > 0 && !"375".startsWith(d)) d = "375" + d;
  return d.slice(0, 12);
}
function formatBelarus(raw: string) {
  const d = toBelarusDigits(raw);
  if (!d) return "";
  const r = d.slice(3);
  let out = "+" + d.slice(0, 3);
  if (r.length) out += " " + r.slice(0, 2);
  if (r.length > 2) out += " " + r.slice(2, 5);
  if (r.length > 5) out += "-" + r.slice(5, 7);
  if (r.length > 7) out += "-" + r.slice(7, 9);
  return out;
}

export function OrderForm() {
  const c = useEstimate();
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const uid = useId();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name") || "").trim();
    const next: typeof errors = {};
    if (name.length < 2) next.name = "Напишите, как к вам обращаться";
    if (toBelarusDigits(phone).length !== 12) next.phone = "Проверьте номер: например, +375 29 123-45-67";
    setErrors(next);
    if (Object.keys(next).length) {
      e.currentTarget.querySelector<HTMLInputElement>(next.name ? "[name=name]" : "[name=phone]")?.focus();
      return;
    }
    setState("sending");
    window.setTimeout(() => setState("done"), 900);
  }

  if (state === "done") {
    return (
      <div role="status" className="flex flex-col justify-center gap-3">
        <p className="text-3xl font-bold">Заявка принята.</p>
        <p className="text-paper/70">Это концепт для портфолио: заявка никуда не ушла, и прораб не приедет. Но смета на {c.area} м² уже ждала бы вас.</p>
        <button type="button" onClick={() => setState("idle")} className="self-start font-semibold text-orange underline underline-offset-4">
          Заполнить ещё раз
        </button>
      </div>
    );
  }

  const field = "h-14 w-full rounded-2xl border border-paper/20 bg-paper/5 px-4 text-paper placeholder:text-paper/40 transition-colors focus:border-orange";
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-n`} className="mb-1.5 block font-mono text-xs tracking-wider text-paper/60 uppercase">Имя</label>
          <input id={`${uid}-n`} name="name" autoComplete="given-name" placeholder="Анна" className={field}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-ne` : undefined} />
          {errors.name && <p id={`${uid}-ne`} className="mt-1.5 text-sm text-orange">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor={`${uid}-p`} className="mb-1.5 block font-mono text-xs tracking-wider text-paper/60 uppercase">Телефон</label>
          <input id={`${uid}-p`} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+375 29 123-45-67" className={field}
            value={phone}
            onChange={(e) => { setPhone(formatBelarus(e.target.value)); if (errors.phone) setErrors((er) => ({ ...er, phone: undefined })); }}
            onFocus={() => !phone && setPhone("+375 ")}
            onBlur={() => phone.replace(/\D/g, "") === "375" && setPhone("")}
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${uid}-pe` : undefined} />
          {errors.phone && <p id={`${uid}-pe`} className="mt-1.5 text-sm text-orange">{errors.phone}</p>}
        </div>
      </div>
      <div className="rounded-2xl border border-dashed border-paper/25 px-4 py-3 font-mono text-sm text-paper/70" aria-live="polite">
        Из калькулятора: <span className="text-paper">{c.typeTitle.toLowerCase()} ремонт, {c.area} м², {c.old ? "вторичка" : "новостройка"}</span> · ≈ {byn(c.total)}
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className="h-14 rounded-full bg-orange font-semibold text-ink transition-[transform,background-color] duration-300 ease-soft hover:-translate-y-0.5 hover:bg-orange-light disabled:cursor-wait disabled:opacity-80"
      >
        {state === "sending" ? "Отправляем…" : "Вызвать замерщика бесплатно"}
      </button>
      <p className="font-mono text-xs text-paper/45">Демо-форма: данные никуда не отправляются и не сохраняются.</p>
    </form>
  );
}
