import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DotField } from "@/components/DotField";
import {
  activityFor,
  ActivityStrip,
  InProgressStrip,
  LiveDot,
} from "@/components/home/Activity";
import {
  brandStyle,
  ContactLinks,
  DetailsGrid,
  ExperienceList,
  Footer,
  Kicker,
  ProductActions,
  ResumeCard,
  ResumeDownload,
  SectionHead,
  StackList,
  Tags,
} from "@/components/home/parts";
import { products } from "@/data/projects";
import { highlights, intro, profile } from "@/data/resume";
import { cn } from "@/lib/utils";

export default function Home() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const p = products[active];

  return (
    <>
      <DotField />
      <main
        id="top"
        className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-32 sm:px-6 sm:pt-40"
      >
        {/* Hero, centred */}
        <section className="animate-fade-up text-center">
          <Kicker className="uppercase tracking-[0.16em]">
            {profile.title}
            <span className="hidden sm:inline"> · {profile.location}</span>
          </Kicker>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-[2.6rem] font-light leading-[1] tracking-[-0.04em] sm:text-[4.4rem]">
            Renjith Rajendran{" "}
            <span className="text-muted-foreground">Viswalekshmi</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-[1.02rem] leading-relaxed text-foreground/85">
            {intro[0]}
          </p>
          <div className="mt-8 flex flex-col items-center gap-5">
            <ResumeDownload testId="hero-resume-download" />
            <ContactLinks className="justify-center" />
          </div>
        </section>

        {/* The shelf: every product as an app icon; picking one opens it below */}
        <section id="products" className="mt-24 scroll-mt-24">
          <p className="text-center font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
            {intro[2]}
          </p>
          <div
            role="tablist"
            aria-label="Products"
            className="mx-auto mt-6 flex w-fit max-w-full items-end gap-1 overflow-x-auto rounded-[26px] border border-border bg-card/80 px-3 pb-3 pt-4 backdrop-blur sm:gap-4 sm:px-5"
          >
            {products.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.name}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  data-testid={`shelf-${item.name.toLowerCase()}-tab`}
                  onClick={() => setActive(i)}
                  style={brandStyle(item)}
                  className="group flex w-[3.6rem] shrink-0 flex-col items-center gap-2 sm:w-20"
                >
                  <motion.span
                    whileHover={reduce ? undefined : { y: -8, scale: 1.12 }}
                    animate={{ y: on ? -6 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="relative"
                  >
                    <img
                      src={item.icon}
                      alt=""
                      className={cn(
                        "h-12 w-12 rounded-[14px] sm:h-16 sm:w-16 sm:rounded-[16px]",
                        on && "shadow-[0_14px_36px_-10px_var(--brand)]",
                      )}
                    />
                    {activityFor(item.name) ? (
                      <LiveDot />
                    ) : (
                      item.inProgress && <LiveDot tone="progress" />
                    )}
                  </motion.span>
                  <span
                    className={cn(
                      "text-[0.7rem] transition-colors",
                      on
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {item.name}
                  </span>
                  <span
                    className={cn(
                      "h-1 w-1 rounded-full transition-opacity",
                      on ? "opacity-100" : "opacity-0",
                    )}
                    style={{ background: "var(--brand)" }}
                  />
                </button>
              );
            })}
          </div>

          <div className="relative mt-6" style={brandStyle(p)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={p.name}
                role="tabpanel"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="relative grid gap-8 overflow-hidden rounded-[26px] border border-[color:color-mix(in_srgb,var(--brand)_45%,transparent)] bg-card/90 p-7 backdrop-blur sm:p-10 md:grid-cols-[1fr_15rem]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full opacity-20 blur-3xl"
                  style={{ background: "var(--brand)" }}
                />
                <div className="relative">
                  <Kicker>{p.kicker}</Kicker>
                  <h3 className="mt-2 font-display text-[2.6rem] font-light leading-none tracking-[-0.04em] sm:text-[3.4rem]">
                    {p.name}
                  </h3>
                  <p className="mt-3 text-lg text-foreground/85">{p.tagline}</p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-7">
                    <ProductActions product={p} />
                  </div>
                </div>
                <div className="relative flex flex-col items-start gap-5 md:items-end">
                  <img
                    src={p.icon}
                    alt=""
                    className="hidden h-28 w-28 rounded-[28px] md:block"
                  />
                  <Tags items={p.tags} className="md:justify-end" />
                </div>
                <div className="relative md:col-span-2 -mt-7">
                  {activityFor(p.name) ? (
                    <ActivityStrip name={p.name} />
                  ) : (
                    p.inProgress && <InProgressStrip name={p.name} />
                  )}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </section>

        <div className="mt-24 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div>
            <Kicker className="uppercase tracking-[0.16em]">
              At Rafay Systems · since 2021
            </Kicker>
            <p className="mt-2 font-display text-xl font-light tracking-tight sm:text-2xl">
              The day job: I own the frontend of the GPU PaaS console.
            </p>
          </div>
          <p className="text-sm text-muted-foreground sm:max-w-[16rem] sm:text-right">
            These numbers come from that work.
          </p>
        </div>
        <dl
          data-testid="rafay-highlights"
          className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4"
        >
          {highlights.map((h) => (
            <div key={h.label} className="bg-card/90 p-5 backdrop-blur">
              <dt className="font-display text-2xl font-light tracking-tight">
                {h.stat}
              </dt>
              <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                {h.label}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mx-auto max-w-[46rem]">
          <section id="experience" className="mt-24 scroll-mt-24">
            <SectionHead index="01" label="Experience" />
            <ExperienceList />
          </section>
          <section className="mt-24">
            <SectionHead
              index="02"
              label="Stack"
              note="at Rafay and in my own products"
            />
            <StackList />
          </section>
          <section className="mt-24">
            <SectionHead index="03" label="Details" />
            <DetailsGrid />
          </section>
          <ResumeCard className="mt-20" />
          <Footer />
        </div>
      </main>
    </>
  );
}
