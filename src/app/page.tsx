import type { CSSProperties, ReactNode } from "react";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Calculator, EstimateProvider, OrderForm } from "@/components/Estimate";
import { Faq } from "@/components/Faq";
import { Plan } from "@/components/Plan";
import { RevealObserver } from "@/components/Reveal";
import { Steps } from "@/components/Steps";
import { FAQ, GUARANTEES, OBJECTS, PHONE, PHONE_HREF, TYPES } from "@/lib/data";

const WRAP = "mx-auto w-full max-w-[1320px] px-5 sm:px-8";
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/* заголовок раздела в стиле чертежа: номер листа + крупный заголовок + пояснение */
function Head({ n, title, children }: { n: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="reveal mb-10 grid gap-4 border-t-2 border-ink pt-5 lg:grid-cols-[120px_1.3fr_1fr] lg:items-start lg:gap-8">
      <p className="font-mono text-sm text-blue">Лист {n}</p>
      <h2 className="text-[clamp(34px,4.6vw,64px)] leading-[1.02] font-bold tracking-[-0.035em] text-balance">{title}</h2>
      {children && <p className="max-w-md text-lg text-graphite lg:pt-2">{children}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <EstimateProvider>
      <RevealObserver />

      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className={`${WRAP} flex h-[72px] items-center justify-between gap-4`}>
          <a href="#top" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
            <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
              <rect x="1" y="1" width="30" height="30" rx="7" fill="#1c1d1c" />
              <path d="M8 22 V12 l8 -5 8 5 v10 Z" fill="none" stroke="#ff6a1a" strokeWidth="2.4" strokeLinejoin="round" />
              <path d="M13 22 v-5 h6 v5" fill="none" stroke="#f3f0e8" strokeWidth="2.4" />
            </svg>
            Чистовик
          </a>
          <nav aria-label="Разделы" className="hidden gap-7 text-[15px] font-medium text-graphite md:flex">
            {[
              ["#types", "Ремонт"],
              ["#calc", "Калькулятор"],
              ["#steps", "Этапы"],
              ["#objects", "Объекты"],
              ["#faq", "Вопросы"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="transition-colors hover:text-ink">
                {label}
              </a>
            ))}
          </nav>
          <a href="#calc" className="inline-flex h-11 items-center rounded-full bg-orange px-5 font-semibold text-ink transition-[transform,background-color] duration-300 ease-soft hover:-translate-y-0.5 hover:bg-orange-light">
            Рассчитать
          </a>
        </div>
      </header>

      <main id="top">
        {/* первый экран */}
        <section className="pt-10 pb-16 sm:pt-14">
          <div className={`${WRAP} grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]`}>
            <div className="reveal">
              <p className="font-mono text-sm text-blue">Ремонт квартир под ключ · Минск</p>
              <h1 className="mt-4 mb-6 text-[clamp(44px,6vw,86px)] leading-[0.98] font-extrabold tracking-[-0.045em]">
                Ремонт с&nbsp;ценой, которая <span className="relative inline-block text-orange-dark">не растёт
                  <svg viewBox="0 0 300 16" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-1 h-3 w-full" aria-hidden="true">
                    <path className="draw is-in" pathLength={1} d="M2 10 Q150 0 298 8" fill="none" stroke="#2850c8" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="mb-8 max-w-[520px] text-xl text-graphite">
                Фиксируем смету в договоре, отчитываемся фото каждый день и сдаём квартиру с гарантией 3 года.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#calc" className="inline-flex h-14 items-center justify-center rounded-full bg-orange px-7 font-semibold text-ink transition-[transform,background-color] duration-300 ease-soft hover:-translate-y-0.5 hover:bg-orange-light">
                  Рассчитать стоимость
                </a>
                <a href={PHONE_HREF} className="inline-flex h-14 items-center justify-center rounded-full border-2 border-ink px-7 font-semibold transition-[transform,background-color,color] duration-300 ease-soft hover:-translate-y-0.5 hover:bg-ink hover:text-paper">
                  {PHONE}
                </a>
              </div>
              <dl className="mt-10 grid max-w-[520px] grid-cols-3 border-t border-line pt-5">
                {[
                  ["240+", "квартир сдано"],
                  ["3 года", "гарантия"],
                  ["0 BYN", "сверх сметы"],
                ].map(([b, s]) => (
                  <div key={s}>
                    <dt className="text-2xl font-bold tracking-tight sm:text-3xl">{b}</dt>
                    <dd className="font-mono text-xs text-graphite">{s}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="reveal" style={delay(0.15)}>
              <BeforeAfter />
              <p className="mt-3 text-center font-mono text-xs text-graphite">← потяните ползунок →</p>
            </div>
          </div>
        </section>

        {/* бегущая строка */}
        <div className="overflow-hidden border-y-2 border-ink bg-ink py-4 text-paper" aria-hidden="true">
          <div className="marquee flex w-max gap-10 font-mono text-sm tracking-widest whitespace-nowrap uppercase">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              ["Смета в договоре", "Электрика", "Сантехника", "Штукатурка", "Плитка", "Полы", "Покраска", "Двери", "Свет", "Уборка"].map((w) => (
                <span key={`${k}-${w}`} className="flex items-center gap-10">
                  {w}
                  <span className="text-orange">■</span>
                </span>
              )),
            )}
          </div>
        </div>

        {/* типы ремонта */}
        <section id="types" className="scroll-mt-20 py-20 sm:py-24">
          <div className={WRAP}>
            <Head n="01" title="Три вида ремонта">Цена за м² с работой и черновыми материалами. Чистовые — по вашему выбору.</Head>
            <div className="grid gap-4 lg:grid-cols-3">
              {TYPES.map((t, i) => (
                <article
                  key={t.id}
                  className={`reveal flex flex-col rounded-[28px] border p-7 hover:-translate-y-1.5 ${i === 1 ? "border-ink bg-ink text-paper" : "border-line bg-white/70"}`}
                  style={delay(i * 0.08)}
                >
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <h3 className="text-2xl font-bold tracking-tight">{t.title}</h3>
                    {i === 1 && <span className="rounded-full bg-orange px-3 py-1 font-mono text-xs text-ink">чаще всего</span>}
                  </div>
                  <p className={`mb-6 ${i === 1 ? "text-paper/75" : "text-graphite"}`}>{t.text}</p>
                  <p className="mb-6 text-4xl font-bold tracking-tight">
                    от {t.price} <span className="text-lg font-medium">BYN/м²</span>
                  </p>
                  <ul className={`mt-auto grid gap-2.5 border-t pt-5 ${i === 1 ? "border-paper/15" : "border-line"}`}>
                    {t.includes.map((x) => (
                      <li key={x} className="flex gap-3">
                        <span className="text-orange" aria-hidden="true">✓</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* калькулятор */}
        <section id="calc" className="scroll-mt-20 pb-20 sm:pb-24">
          <div className={WRAP}>
            <Head n="02" title="Посчитайте свой ремонт">Двигайте ползунок и выбирайте параметры — сумма и срок пересчитываются сразу.</Head>
            <Calculator />
          </div>
        </section>

        {/* этапы */}
        <section id="steps" className="scroll-mt-20 pb-20 sm:pb-24">
          <div className={`${WRAP}`}>
            <Head n="03" title="От замера до ключей">Шесть этапов. Оплата — только за принятые.</Head>
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
              <Steps />
              <div className="reveal hidden self-start rounded-[28px] border border-line bg-white/70 p-8 lg:sticky lg:top-28 lg:block">
                <p className="font-mono text-sm text-blue">Отчёт · день 23</p>
                <p className="mt-3 text-2xl font-bold tracking-tight">«Сегодня закончили плитку в санузле, завтра — затирка и установка инсталляции.»</p>
                <p className="mt-4 text-graphite">Каждый вечер прораб присылает фото и короткий отчёт в мессенджер. Видно, за что вы платите.</p>
                <div className="mt-6 grid grid-cols-3 gap-2" aria-hidden="true">
                  {["#d9d3c6", "#c9d3e6", "#e6d1c3"].map((c, i) => (
                    <div key={c} className="aspect-square rounded-xl" style={{ background: `repeating-linear-gradient(${45 + i * 30}deg, ${c} 0 10px, #fff6 10px 20px)` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* объекты */}
        <section id="objects" className="scroll-mt-20 pb-20 sm:pb-24">
          <div className={WRAP}>
            <Head n="04" title="Недавние объекты">Площадь, срок и итоговая стоимость — как в договоре. Примеры для концепта.</Head>
            <div className="grid gap-4 md:grid-cols-3">
              {OBJECTS.map((o, i) => (
                <article key={o.name} className="reveal rounded-[28px] border border-line bg-white/70 p-6 hover:-translate-y-1.5 hover:border-ink/30" style={delay(i * 0.1)}>
                  <div className="rounded-2xl bg-blue-soft/60 p-4">
                    <Plan name={o.plan} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold tracking-tight">{o.name}</h3>
                  <p className="font-mono text-xs text-blue">{o.type} ремонт</p>
                  <dl className="mt-4 grid grid-cols-3 border-t border-line pt-4 font-mono text-sm">
                    <div><dt className="text-xs text-graphite">площадь</dt><dd className="font-medium">{o.area} м²</dd></div>
                    <div><dt className="text-xs text-graphite">срок</dt><dd className="font-medium">{o.weeks} нед.</dd></div>
                    <div><dt className="text-xs text-graphite">итог</dt><dd className="font-medium">{o.cost}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* гарантии */}
        <section className="pb-20 sm:pb-24">
          <div className={WRAP}>
            <div className="reveal grid gap-[2px] overflow-hidden rounded-[28px] border-2 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-4">
              {GUARANTEES.map((g) => (
                <div key={g.big} className="bg-paper p-7">
                  <p className="text-3xl font-bold tracking-tight text-orange-dark">{g.big}</p>
                  <p className="mt-2 text-graphite">{g.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* вопросы */}
        <section id="faq" className="scroll-mt-20 pb-20 sm:pb-24">
          <div className={WRAP}>
            <Head n="05" title="Частые вопросы" />
            <div className="lg:ml-[152px]">
              <Faq items={FAQ} />
            </div>
          </div>
        </section>

        {/* заявка */}
        <section id="order" className="scroll-mt-20 pb-20 sm:pb-24">
          <div className={WRAP}>
            <div className="reveal grid gap-10 rounded-[32px] bg-ink p-[clamp(28px,5vw,64px)] text-paper lg:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="font-mono text-sm text-orange">Лист 06</p>
                <h2 className="mt-3 text-[clamp(36px,4.6vw,60px)] leading-[1.02] font-bold tracking-[-0.035em]">Бесплатный замер — и&nbsp;смета за&nbsp;2&nbsp;дня</h2>
                <p className="mt-4 text-paper/70">Приедем в удобное время, всё измерим и пришлём смету по пунктам. Ни к чему не обязывает.</p>
              </div>
              <OrderForm />
            </div>
          </div>
        </section>
      </main>

      <footer className={`${WRAP} flex flex-col gap-3 border-t border-line py-9 font-mono text-sm text-graphite sm:flex-row sm:items-center sm:justify-between`}>
        <p className="font-sans font-bold text-ink">Чистовик — ремонт квартир под ключ</p>
        <p>Концепт для портфолио: компания, объекты и цифры вымышленные.</p>
        <a href="#top" className="hover:text-ink">Наверх ↑</a>
      </footer>
    </EstimateProvider>
  );
}
