export function bindSlides() {
  const link = document.getElementById("slides-link");
  const sections = () => [...document.querySelectorAll("section.slide")];

  function apply() {
    const on = location.hash === "#slides";
    document.body.classList.toggle("slides-on", on);
    link.textContent = on ? "Exit present" : "Present";
    link.href = on ? "#verdict" : "#slides";
  }

  link.addEventListener("click", (e) => {
    if (location.hash === "#slides") {
      e.preventDefault();
      history.pushState(null, "", "#verdict");
      apply();
    }
  });

  window.addEventListener("hashchange", apply);
  window.addEventListener("keydown", (e) => {
    if (location.hash !== "#slides") return;
    const list = sections();
    const i = list.findIndex((s) => {
      const r = s.getBoundingClientRect();
      return r.top >= -40 && r.top < window.innerHeight / 2;
    });
    const cur = i < 0 ? 0 : i;
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      list[Math.min(cur + 1, list.length - 1)]?.scrollIntoView({ behavior: "smooth" });
    }
    if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      list[Math.max(cur - 1, 0)]?.scrollIntoView({ behavior: "smooth" });
    }
  });
  apply();
}
