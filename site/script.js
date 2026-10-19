// Count-up stats + scroll reveal
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add("in");
    if (e.target.classList.contains("stats")) {
      e.target.querySelectorAll("[data-count]").forEach(animateCount);
    }
    io.unobserve(e.target);
  }
}, { threshold: 0.2 });

document.querySelectorAll(".reveal, .stats").forEach((el) => io.observe(el));

function animateCount(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const t0 = performance.now();
  const dur = 1200;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

document.getElementById("year").textContent = new Date().getFullYear();
