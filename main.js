/**
 * ========================================
 * NovaHost - Script Principal
 * ========================================
 * Gère : thème, navigation, tarification, animations
 */

(function () {
  "use strict";

  // ========================================
  // UTILITAIRES
  // ========================================

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateNumber(el, to, duration = 600) {
    if (!el) return;
    
    const currentText = (el.textContent || "").toString();
    const startNum = parseInt(currentText.replace(/[^0-9]/g, "")) || 0;
    const target = parseInt(to, 10) || 0;

    if (prefersReduced) {
      el.textContent = "€" + target;
      return;
    }

    const startTime = performance.now();
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(startNum + (target - startNum) * eased);
      el.textContent = "€" + current;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function animateAmount(el) {
    if (!el) return;
    el.classList.add("pulse");
    el.addEventListener("animationend", function handler() {
      el.classList.remove("pulse");
      el.removeEventListener("animationend", handler);
    });
  }

  // ========================================
  // 1. ANNÉE DYNAMIQUE
  // ========================================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ========================================
  // 2. THÈME (MODE CLAIR / SOMBRE)
  // ========================================
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");

  if (localStorage.theme === "light") {
    body.classList.add("light");
  }

  if (themeToggle) {
    const updateToggle = () => {
      const pressed = body.classList.contains("light");
      themeToggle.setAttribute("aria-pressed", pressed ? "true" : "false");
    };

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("light");
      localStorage.theme = body.classList.contains("light") ? "light" : "dark";
      updateToggle();
    });

    updateToggle();
  }

  // ========================================
  // 3. NAVIGATION MOBILE & FOCUS TRAP
  // ========================================
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  let previouslyFocused = null;
  let focusTrapHandler = null;

  function enableFocusTrap(container) {
    const focusable = Array.from(
      container.querySelectorAll(
        "a, button, input, [tabindex]:not([tabindex=\"-1\"])"
      )
    ).filter((n) => !n.disabled && n.offsetParent !== null);

    if (!focusable.length) return;

    previouslyFocused = document.activeElement;
    focusable[0].focus();

    focusTrapHandler = function (e) {
      if (e.key === "Tab") {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      } else if (e.key === "Escape") {
        closeNav();
      }
    };

    document.addEventListener("keydown", focusTrapHandler);
  }

  function disableFocusTrap() {
    if (focusTrapHandler) {
      document.removeEventListener("keydown", focusTrapHandler);
    }
    focusTrapHandler = null;

    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
    }
    previouslyFocused = null;
  }

  const closeNav = () => {
    if (!mainNav) return;
    mainNav.classList.remove("open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    mainNav.setAttribute("data-open", "false");
    disableFocusTrap();
  };

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", (e) => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      mainNav.setAttribute("data-open", isOpen ? "true" : "false");

      if (isOpen) {
        enableFocusTrap(mainNav);
      } else {
        disableFocusTrap();
      }
    });

    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 900 &&
        mainNav.classList.contains("open")
      ) {
        if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
          closeNav();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && mainNav.classList.contains("open")) {
        closeNav();
      }
    });
  }

  // ========================================
  // 4. EFFET RIPPLE SUR BOUTONS
  // ========================================
  function attachRipples() {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.style.position = btn.style.position || "relative";

      btn.addEventListener("click", function (e) {
        const rect = btn.getBoundingClientRect();
        const r = document.createElement("span");
        r.className = "ripple";

        const size = Math.max(rect.width, rect.height) * 1.2;
        r.style.width = r.style.height = size + "px";
        r.style.left = e.clientX - rect.left - size / 2 + "px";
        r.style.top = e.clientY - rect.top - size / 2 + "px";

        btn.appendChild(r);
        setTimeout(() => r.remove(), 600);
      });
    });
  }

  attachRipples();

  // ========================================
  // 5. MICRO-INTERACTION 3D SUR CARTES
  // ========================================
  if (!prefersReduced) {
    document.querySelectorAll('''.card[role="button"]''').forEach((card) => {
      card.style.transformStyle = "preserve-3d";

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = (y - cy) / cy;
        const ry = (x - cx) / cx;
        const rotX = (-rx * 6).toFixed(2);
        const rotY = (ry * 6).toFixed(2);

        card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // ========================================
  // 6. TARIFICATION - BASCULER MENSUEL/ANNUEL
  // ========================================
  const billingToggle = document.getElementById("billingToggle");

  const updatePrices = (yearly) => {
    document.querySelectorAll(".card").forEach((card) => {
      const amtEl = card.querySelector(".amount");
      const baseMonthly =
        parseFloat(card.dataset.monthly) ||
        parseFloat(amtEl.dataset.base) ||
        0;
      const value = yearly
        ? parseFloat(card.dataset.annual) ||
          Math.round(baseMonthly * 12 * 0.9)
        : baseMonthly;

      if (amtEl) {
        animateNumber(amtEl, value);
        animateAmount(amtEl);
      }
    });
  };

  updatePrices(false);

  if (billingToggle) {
    billingToggle.addEventListener("change", (e) => {
      updatePrices(e.target.checked);

      if (
        typeof toggleBillingSmall !== "undefined" &&
        toggleBillingSmall
      ) {
        toggleBillingSmall.setAttribute(
          "aria-pressed",
          e.target.checked ? "true" : "false"
        );
      }

      computeEstimate();
    });
  }

  // ========================================
  // 7. CALCULATEUR DE RESSOURCES
  // ========================================
  const cpuRange = document.getElementById("cpuRange");
  const ramRange = document.getElementById("ramRange");
  const diskRange = document.getElementById("diskRange");
  const cpuVal = document.getElementById("cpuVal");
  const ramVal = document.getElementById("ramVal");
  const diskVal = document.getElementById("diskVal");
  const calcPrice = document.getElementById("calcPrice");

  const computeResourceCost = () => {
    const cpu = cpuRange ? parseInt(cpuRange.value, 10) : 2;
    const ram = ramRange ? parseInt(ramRange.value, 10) : 4;
    const disk = diskRange ? parseInt(diskRange.value, 10) : 100;
    const resourceCost = Math.max(0, Math.round(cpu * 3 + ram * 0.5 + disk * 0.02));

    if (calcPrice) {
      animateNumber(calcPrice, resourceCost);
      animateAmount(calcPrice);
    }

    if (cpuVal) cpuVal.textContent = cpu;
    if (ramVal) ramVal.textContent = ram;
    if (diskVal) diskVal.textContent = disk;

    return { resourceCost, cpu, ram, disk };
  };

  [cpuRange, ramRange, diskRange].forEach((el) => {
    if (el) {
      el.addEventListener("input", () => {
        computeResourceCost();
        computeEstimate();
      });
    }
  });

  computeResourceCost();

  // ========================================
  // 8. SÉLECTION DES PLANS & ESTIMATION
  // ========================================
  let selectedPlan = null;
  const estPlan = document.getElementById("estPlan");
  const estResources = document.getElementById("estResources");
  const estPrice = document.getElementById("estPrice");
  const estPeriod = document.getElementById("estPeriod");
  const addToCart = document.getElementById("addToCart");
  const toggleBillingSmall = document.getElementById("toggleBillingSmall");

  const selectPlanElement = (card, btn) => {
    document
      .querySelectorAll(".card")
      .forEach((c) => {
        c.classList.remove("selected");
        c.setAttribute("aria-pressed", "false");
      });

    document.querySelectorAll(".select-plan").forEach((b) => {
      b.setAttribute("aria-pressed", "false");
    });

    if (!card) return;

    card.classList.add("selected");
    card.setAttribute("aria-pressed", "true");

    if (btn) {
      btn.setAttribute("aria-pressed", "true");
    }

    selectedPlan = {
      id: card.dataset.plan,
      monthly: parseFloat(card.dataset.monthly || 0),
      annual: parseFloat(card.dataset.annual || 0),
      el: card,
    };

    if (estPlan) {
      estPlan.textContent = selectedPlan.id;
    }

    computeEstimate();
  };

  document.querySelectorAll(".select-plan").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = btn.closest(".card");
      selectPlanElement(card, btn);
      btn.focus();
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  document.querySelectorAll('''.card[role="button"]''').forEach((card) => {
    card.addEventListener("click", () => {
      const btn = card.querySelector(".select-plan");
      if (btn) {
        selectPlanElement(card, btn);
        btn.focus();
      }
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const btn = card.querySelector(".select-plan");
        if (btn) {
          selectPlanElement(card, btn);
          btn.focus();
        }
      }
    });
  });

  const computeEstimate = () => {
    const { resourceCost, cpu, ram, disk } = computeResourceCost();
    const periodYearly = billingToggle ? billingToggle.checked : false;

    let planBaseMonthly = selectedPlan ? selectedPlan.monthly : 0;
    let planBaseAnnual = selectedPlan ? selectedPlan.annual : 0;
    let totalMonthly = planBaseMonthly + resourceCost;
    let totalAnnual = planBaseAnnual + Math.round(resourceCost * 12 * 0.9);

    if (!selectedPlan) {
      if (estPrice) estPrice.textContent = "€0";
      if (addToCart) addToCart.disabled = true;
      if (estResources)
        estResources.textContent = cpu + " vCPU / " + ram + "GB / " + disk + "GB";
      return;
    }

    if (estResources) {
      estResources.textContent = cpu + " vCPU / " + ram + "GB / " + disk + "GB";
    }

    if (periodYearly) {
      if (estPrice) animateNumber(estPrice, totalAnnual);
      if (estPeriod) estPeriod.textContent = "an";
    } else {
      if (estPrice) animateNumber(estPrice, totalMonthly);
      if (estPeriod) estPeriod.textContent = "mois";
    }

    if (addToCart) {
      addToCart.disabled = false;
      animateAmount(estPrice);
    }
  };

  if (toggleBillingSmall) {
    toggleBillingSmall.setAttribute("aria-controls", "billingToggle");

    if (billingToggle) {
      toggleBillingSmall.setAttribute(
        "aria-pressed",
        billingToggle.checked ? "true" : "false"
      );
    }

    toggleBillingSmall.addEventListener("click", () => {
      const isYear =
        toggleBillingSmall.getAttribute("aria-pressed") === "true";
      toggleBillingSmall.setAttribute("aria-pressed", (!isYear).toString());

      if (billingToggle) {
        billingToggle.checked = !isYear;
        billingToggle.dispatchEvent(new Event("change"));
      }

      computeEstimate();
    });
  }

  if (addToCart) {
    addToCart.addEventListener("click", () => {
      showToast("Plan ajouté à l''estimation.");
      addToCart.disabled = true;
      setTimeout(() => {
        addToCart.disabled = false;
      }, 1200);
    });
  }

  const preSel = document.querySelector(".card.selected");
  if (preSel) selectPlanElement(preSel, preSel.querySelector(".select-plan"));

  // ========================================
  // 9. TOAST / NOTIFICATIONS
  // ========================================
  const toast = document.getElementById("toast");
  const toastMsg = toast ? toast.querySelector(".toast-msg") : null;
  const toastClose = toast ? toast.querySelector(".toast-close") : null;
  let toastTimer = null;

  const showToast = (msg, timeout = 3500) => {
    if (!toast) return alert(msg);

    if (toastMsg) toastMsg.textContent = msg;
    toast.hidden = false;
    toast.classList.add("show");

    if (toastClose) toastClose.focus();

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      hideToast();
    }, timeout);
  };

  const hideToast = () => {
    if (!toast) return;
    toast.classList.remove("show");
    clearTimeout(toastTimer);

    setTimeout(() => {
      toast.hidden = true;
    }, 250);
  };

  if (toastClose) toastClose.addEventListener("click", hideToast);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toast && toast.classList.contains("show")) {
      hideToast();
    }
  });

  // ========================================
  // 10. FORMULAIRE CONTACT
  // ========================================
  const form = document.getElementById("contactForm");

  if (form) {
    const setInvalid = (el, msg) => {
      el.setAttribute("aria-invalid", "true");
      showToast(msg);
    };

    const clearInvalid = (el) => {
      el.removeAttribute("aria-invalid");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = (fd.get("name") || "").trim();
      const email = (fd.get("email") || "").trim();
      const message = (fd.get("message") || "").trim();

      let ok = true;
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (name.length < 2) {
        setInvalid(form.querySelector(''[name="name"]''), "Nom trop court");
        ok = false;
      } else {
        clearInvalid(form.querySelector(''[name="name"]''));
      }

      if (!emailRe.test(email)) {
        setInvalid(form.querySelector(''[name="email"]''), "Email invalide");
        ok = false;
      } else {
        clearInvalid(form.querySelector(''[name="email"]''));
      }

      if (message.length < 6) {
        setInvalid(
          form.querySelector(''[name="message"]''),
          "Message trop court"
        );
        ok = false;
      } else {
        clearInvalid(form.querySelector(''[name="message"]''));
      }

      if (!ok) return;

      showToast(
        "Merci ! Message envoyé  notre équipe revient vers vous sous 24h."
      );
      form.reset();
    });
  }

  // ========================================
  // 11. FORMULAIRE NEWSLETTER
  // ========================================
  const newsletterForm = document.getElementById("newsletterForm");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = (
        newsletterForm.querySelector(''[name="email"]'').value || ""
      ).trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRe.test(email)) {
        showToast("Email invalide pour l''inscription.");
        return;
      }

      showToast("Merci ! Abonnement confirmé.");
      newsletterForm.reset();
    });
  }

  // ========================================
  // 12. ANIMATIONS D''APPARITION (REVEAL)
  // ========================================
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReduced) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = Array.from(
              entry.target.querySelectorAll("[data-reveal-el]")
            );

            if (items.length) {
              items.forEach((it, i) => {
                it.style.setProperty("--delay", i * 80 + "ms");
              });
            }

            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }
})();
