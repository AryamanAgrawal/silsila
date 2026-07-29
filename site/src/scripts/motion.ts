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

/* ── 08 Bio disclosures: animate the height instead of snapping ─── */
function disclosures() {
  document.querySelectorAll<HTMLDetailsElement>("details.bio").forEach((d) => {
    const summary = d.querySelector("summary");
    const body = d.querySelector<HTMLElement>(".b-body");
    if (!summary || !body) return;
    let animating = false;

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (animating) return;
      animating = true;
      const done = () => {
        gsap.set(body, { clearProps: "height,opacity,overflow" });
        animating = false;
      };

      if (d.open) {
        gsap.to(body, {
          height: 0,
          opacity: 0,
          overflow: "hidden",
          duration: 0.34,
          ease: "power2.inOut",
          onComplete: () => {
            d.open = false;
            done();
          },
        });
      } else {
        d.open = true;
        gsap.fromTo(
          body,
          { height: 0, opacity: 0, overflow: "hidden" },
          { height: "auto", opacity: 1, duration: 0.42, ease: "power2.out", onComplete: done },
        );
      }
    });
  });
}

/* ── boot ────────────────────────────────────────────────── */
function boot() {
  if (reduced) {
    // Everything is already in its resting state; only the marquees are
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
  disclosures();
}

if (document.fonts?.ready) {
  document.fonts.ready.then(boot);
} else {
  boot();
}
