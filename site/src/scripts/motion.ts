import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The house curve: a plucked string. Overshoot, then decay. */
const PLUCK = "elastic.out(1, 0.45)";
const SETTLE = "power3.out";

/* ── 01 Sam: the headline rises out of a baseline mask ────── */
function heroEntrance() {
  const title = document.querySelector<HTMLElement>('[data-anim="sam"]');
  const script = document.querySelector<HTMLElement>('[data-anim="script"]');
  if (!title) return;

  const split = new SplitText(title, { type: "chars", mask: "chars" });
  const tl = gsap.timeline();
  tl.from(split.chars, {
    yPercent: 115,
    duration: 0.9,
    ease: SETTLE,
    stagger: 0.042,
  });
  if (script) {
    tl.from(
      script,
      { clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "power2.inOut" },
      "-=0.4",
    );
  }
  return tl;
}

/* ── 02 Sympathetic strings ──────────────────────────────── */
function strings() {
  const svg = document.querySelector<SVGElement>("[data-strings]");
  if (!svg) return;
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>(".string"));
  if (!paths.length) return;

  const mainIndex = Math.floor(paths.length / 2);

  const ring = (
    path: SVGPathElement,
    amp: number,
    dur: number,
    delay: number,
  ) => {
    const base = Number(path.dataset.base);
    const d = path.getAttribute("d") ?? "";
    return gsap.to(
      { v: 0 },
      {
        v: 1,
        duration: dur,
        delay,
        ease: "none",
        onUpdate() {
          const t = this.progress();
          const y = amp * Math.sin(t * Math.PI * 7) * Math.exp(-4.2 * t);
          path.setAttribute("d", d.replace(/Q(\S+) (\S+)/, `Q$1 ${base + y}`));
        },
      },
    );
  };

  const pluck = () => {
    const tl = gsap.timeline();
    paths.forEach((p, i) => {
      const dist = Math.abs(i - mainIndex);
      const amp = dist === 0 ? 22 : 9 / (1 + dist * 0.45);
      tl.add(ring(p, amp, dist === 0 ? 2.4 : 2, dist * 0.05), 0);
    });
    return tl;
  };

  pluck();
  document
    .querySelector(".hero")
    ?.addEventListener("pointerenter", () => pluck());
}

/* ── 03 Statement: line reveal ───────────────────────────── */
function lineReveal() {
  const blocks = gsap.utils.toArray<HTMLElement>('[data-anim="lines"]');
  blocks.forEach((block) => {
    const split = new SplitText(block, { type: "lines", mask: "lines" });
    gsap.from(split.lines, {
      yPercent: 105,
      duration: 0.85,
      ease: SETTLE,
      stagger: 0.08,
      scrollTrigger: { trigger: block, start: "top 80%", once: true },
    });
  });
}

/* ── 04 Run of show: slots settle in ─────────────────────── */
function slots() {
  gsap.utils.toArray<HTMLElement>('[data-anim="slot"]').forEach((slot) => {
    gsap.from(slot, {
      y: 26,
      opacity: 0,
      duration: 0.7,
      ease: SETTLE,
      scrollTrigger: { trigger: slot, start: "top 88%", once: true },
    });
  });
}

/* ── 05 Pinned to the wall: photograph, then tape ────────── */
function polaroids() {
  gsap.utils.toArray<HTMLElement>('[data-anim="polaroid"]').forEach((card) => {
    const tape = card.querySelector<HTMLElement>('[data-anim="tape"]');
    const rest = getComputedStyle(card).getPropertyValue("--tilt");

    const tl = gsap.timeline({
      scrollTrigger: { trigger: card, start: "top 86%", once: true },
    });
    tl.from(card, {
      y: 44,
      rotation: (Number.parseFloat(rest) || 0) - 6,
      opacity: 0,
      duration: 1.05,
      ease: PLUCK,
    });
    if (tape) {
      tl.from(
        tape,
        {
          scaleY: 0,
          opacity: 0,
          transformOrigin: "top center",
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.45",
      );
    }
  });
}

/* ── 06 Marquees, with a scroll-velocity term ────────────── */
function marquees() {
  document.querySelectorAll<HTMLElement>("[data-marquee]").forEach((el) => {
    const track = el.querySelector<HTMLElement>("[data-marquee-track]");
    if (!track) return;

    track.innerHTML += track.innerHTML;
    const half = track.scrollWidth / 2;
    if (!half) return;

    const speed = Number(el.dataset.marquee) || 40;
    const tween = gsap.to(track, {
      x: -half,
      duration: half / speed,
      ease: "none",
      repeat: -1,
    });

    el.addEventListener("pointerenter", () =>
      gsap.to(tween, { timeScale: 0.15, duration: 0.4 }),
    );
    el.addEventListener("pointerleave", () =>
      gsap.to(tween, { timeScale: 1, duration: 0.6 }),
    );

    ScrollTrigger.create({
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 1400, 3);
        gsap.to(tween, { timeScale: boost, duration: 0.25, overwrite: true });
        gsap.to(tween, {
          timeScale: 1,
          duration: 0.9,
          delay: 0.25,
          overwrite: false,
        });
      },
    });
  });
}

/* ── 07 Magnetic button + resonance ring ─────────────────── */
function magnetic() {
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.22,
        y: (e.clientY - r.top - r.height / 2) * 0.3,
        duration: 0.5,
        ease: "power3.out",
      });
    });
    btn.addEventListener("pointerleave", () =>
      gsap.to(btn, { x: 0, y: 0, duration: 1.1, ease: PLUCK }),
    );
    btn.addEventListener("pointerdown", (e) => {
      const r = btn.getBoundingClientRect();
      const ring = document.createElement("span");
      ring.className = "ring";
      ring.style.left = `${e.clientX - r.left - 5}px`;
      ring.style.top = `${e.clientY - r.top - 5}px`;
      btn.appendChild(ring);
      gsap.fromTo(
        ring,
        { scale: 0, opacity: 0.85 },
        {
          scale: 30,
          opacity: 0,
          duration: 1.1,
          ease: "power2.out",
          onComplete: () => ring.remove(),
        },
      );
    });
  });
}

/* ── 08 Artist carousel: strip picks the panel ───────────── */
/**
 * Runs whether or not motion is reduced — it is navigation, not decoration.
 * The server ships every panel visible; the first thing this does is hide the
 * inactive ones, so a failed boot leaves a readable page rather than an empty
 * one.
 */
function carousel() {
  const section = document.querySelector<HTMLElement>(".artists");
  const scroller = section?.querySelector<HTMLElement>("[data-strip]");
  const panels = section?.querySelector<HTMLElement>("[data-panels]");
  if (!section || !scroller || !panels) return;

  const tabs = Array.from(section.querySelectorAll<HTMLButtonElement>("[data-pick]"));
  const dots = Array.from(section.querySelectorAll<HTMLElement>("[data-dot]"));
  if (!tabs.length) return;

  let current = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
  if (current < 0) current = 0;

  const panelFor = (slug: string) =>
    panels.querySelector<HTMLElement>(`[data-panel="${slug}"]`);

  const paint = (next: number, { scroll = true, focus = false } = {}) => {
    const tab = tabs[next];
    const slug = tab.dataset.pick!;
    const panel = panelFor(slug);
    if (!panel) return;

    const outgoing = panels.querySelector<HTMLElement>('[data-panel][data-active="true"]');
    const changed = outgoing !== panel;

    tabs.forEach((t, i) => {
      t.setAttribute("aria-selected", String(i === next));
      t.tabIndex = i === next ? 0 : -1;
    });
    dots.forEach((d, i) => d.toggleAttribute("data-on", i === next));

    if (changed) {
      if (outgoing) outgoing.dataset.active = "false";
      panel.dataset.active = "true";
      if (!reduced) {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.32, ease: SETTLE },
        );
      }
    }

    if (scroll) {
      tab.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    if (focus) tab.focus({ preventScroll: true });
    current = next;
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => paint(i));
  });

  section.addEventListener("keydown", (e) => {
    const key = (e as KeyboardEvent).key;
    const delta = key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : 0;
    if (delta) {
      e.preventDefault();
      paint((current + delta + tabs.length) % tabs.length, { focus: true });
      return;
    }
    if (key === "Home" || key === "End") {
      e.preventDefault();
      paint(key === "Home" ? 0 : tabs.length - 1, { focus: true });
    }
  });

  /* A swipe should select what it lands on, without fighting the smooth
     scroll that selecting a card starts. */
  let idle: number;
  scroller.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        const mid = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
        let best = current;
        let bestDist = Infinity;
        tabs.forEach((t, i) => {
          const r = t.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        if (best !== current) paint(best, { scroll: false });
      }, 90);
    },
    { passive: true },
  );

  paint(current, { scroll: false });
}

/* ── 09 Program nav: reveal past the hero, mark the section ─ */
/**
 * Also unconditional. `hidden` comes off only here, so a page with no JS never
 * shows a bar that cannot track anything.
 */
function programNav() {
  const bar = document.querySelector<HTMLElement>("[data-nav]");
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!bar || !hero) return;

  const links = Array.from(bar.querySelectorAll<HTMLAnchorElement>("[data-nav-link]"));
  const sections = links
    .map((l) => document.getElementById(l.dataset.navLink!))
    .filter((el): el is HTMLElement => Boolean(el));

  bar.hidden = false;
  gsap.set(bar, { yPercent: -100 });

  let shown = false;
  const show = (next: boolean) => {
    if (next === shown) return;
    shown = next;
    gsap.to(bar, {
      yPercent: next ? 0 : -100,
      duration: reduced ? 0 : 0.42,
      ease: "power3.out",
    });
  };

  new IntersectionObserver(
    ([entry]) => show(!entry.isIntersecting),
    { rootMargin: "-70px 0px 0px 0px" },
  ).observe(hero);

  /* Marks the section whose top most recently passed under the bar. */
  const mark = () => {
    const line = bar.offsetHeight + 12;
    let active = -1;
    sections.forEach((sec, i) => {
      if (sec.getBoundingClientRect().top <= line) active = i;
    });
    links.forEach((l, i) => l.toggleAttribute("data-on", i === active));
  };

  mark();
  window.addEventListener("scroll", mark, { passive: true });

  /* The bar's own height is the correct scroll offset for its anchors. */
  const setPad = () =>
    document.documentElement.style.setProperty(
      "scroll-padding-top",
      `${bar.offsetHeight + 12}px`,
    );
  setPad();
  window.addEventListener("resize", setPad, { passive: true });
}

/* ── boot ────────────────────────────────────────────────── */
function boot() {
  // Navigation first, and unconditionally: the carousel and the nav are how the
  // page is read, not how it is decorated.
  carousel();
  programNav();

  if (reduced) {
    // Everything else is already in its resting state; only the marquees are
    // suppressed, so the page reads as a plain document.
    return;
  }
  heroEntrance();
  strings();
  lineReveal();
  slots();
  polaroids();
  marquees();
  magnetic();
}

if (document.fonts?.ready) {
  document.fonts.ready.then(boot);
} else {
  boot();
}
