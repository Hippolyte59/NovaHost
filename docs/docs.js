"use strict";

(() => {
  const tabGroups = document.querySelectorAll("[data-tab-group]");
  const copyButtons = document.querySelectorAll(".copy-btn");
  const animatedBlocks = document.querySelectorAll("[data-animate]");

  tabGroups.forEach((group) => {
    const tabs = group.querySelectorAll(".docs-tab");
    const panels = group.querySelectorAll("[data-tab-panel]");

    const setActive = (lang) => {
      tabs.forEach((tab) => {
        const selected = tab.getAttribute("data-tab") === lang;
        tab.setAttribute("aria-selected", String(selected));
      });

      panels.forEach((panel) => {
        const show = panel.getAttribute("data-tab-panel") === lang;
        panel.classList.toggle("docs-hidden", !show);
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => setActive(tab.getAttribute("data-tab")));
    });

    const initial = tabs[0]?.getAttribute("data-tab");
    if (initial) setActive(initial);
  });

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const target = button.getAttribute("data-copy-target");
      const code = target ? document.getElementById(target) : null;
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code.textContent || "");
        const initial = button.textContent;
        button.textContent = "Copie";
        setTimeout(() => {
          button.textContent = initial || "Copier";
        }, 1200);
      } catch {
        button.textContent = "Impossible";
      }
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    animatedBlocks.forEach((item) => observer.observe(item));
  } else {
    animatedBlocks.forEach((item) => item.classList.add("is-visible"));
  }
})();
