/**
 * ========================================
 * NovaHost - Script Principal (Premium)
 * ========================================
 * Interactions avancées, animations fluides, micro-interactions
 */

(function () {
  'use strict';

  // ========================================
  // CONSTANTES & CONFIGURATION
  // ========================================
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const config = {
    animDuration: 600,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  };

  // ========================================
  // UTILITAIRES AVANCÉS
  // ========================================

  function animateNumber(el, to, duration = config.animDuration) {
    if (!el) return;

    const currentText = (el.textContent || '').toString();
 const startNum = parseInt(currentText.replace(/[^0-9]/g, ''), 10) || 0;
 const target = parseInt(to, 10) || 0;

 if (prefersReduced) {
 el.textContent = '€' + target;
 return;
 }

 const startTime = performance.now();
 function step(now) {
 const t = Math.min(1, (now - startTime) / duration);
 const eased = config.easing(t);
 const current = Math.round(startNum + (target - startNum) * eased);
 el.textContent = '€' + current;
 if (t < 1) requestAnimationFrame(step);
 }
 requestAnimationFrame(step);
 }

 function animateAmount(el) {
 if (!el) return;
 el.classList.add('pulse');
 el.classList.add('glow');
 setTimeout(() => el.classList.remove('glow'), 1500);
 el.addEventListener('animationend', function handler() {
 el.classList.remove('pulse');
 el.removeEventListener('animationend', handler);
 });
 }

 function addGlowEffect(el) {
 if (prefersReduced) return;
 el.classList.add('glow');
 setTimeout(() => el.classList.remove('glow'), 1500);
 }

 function initSmoothScroll() {
 document.querySelectorAll('a[href^="#"]').forEach((link) => {
 link.addEventListener('click', (e) => {
 const href = link.getAttribute('href');
 const target = document.querySelector(href);
 if (target && href !== '#') {
 e.preventDefault();
 target.scrollIntoView({ behavior: 'smooth', block: 'start' });
 }
 });
 });
 }

 // ========================================
 // 1. ANNÉE DYNAMIQUE
 // ========================================
 const yearEl = document.getElementById('year');
 if (yearEl) yearEl.textContent = new Date().getFullYear();

 // ========================================
 // 2. THÈME AVEC TRANSITION
 // ========================================
 const body = document.body;
 const themeToggle = document.getElementById('themeToggle');

 const savedTheme = localStorage.getItem('theme');
 if (savedTheme === 'light') {
 body.classList.add('light');
 } else {
 body.classList.remove('light');
 localStorage.setItem('theme', 'dark');
 }

 if (themeToggle) {
 const updateToggle = () => {
 const isLight = body.classList.contains('light');
 themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
 };

 themeToggle.addEventListener('click', () => {
 if (!prefersReduced) {
 themeToggle.style.transform = 'rotate(180deg)';
 setTimeout(() => {
 themeToggle.style.transform = '';
 }, 300);
 }
 body.classList.toggle('light');
 const isLight = body.classList.contains('light');
 localStorage.setItem('theme', isLight ? 'light' : 'dark');
 updateToggle();
 addGlowEffect(themeToggle);
 });

 updateToggle();
 }

 // ========================================
 // 3. NAVIGATION MOBILE & FOCUS TRAP
 // ========================================
 const navToggle = document.getElementById('navToggle');
 const mainNav = document.getElementById('mainNav');
 let previouslyFocused = null;
 let focusTrapHandler = null;

 function enableFocusTrap(container) {
 const focusable = Array.from(
 container.querySelectorAll(
 'a, button, input, [tabindex]:not([tabindex="-1"])'
 )
 ).filter((n) => !n.disabled && n.offsetParent !== null);

 if (!focusable.length) return;

 previouslyFocused = document.activeElement;
 focusable[0].focus();

 focusTrapHandler = function (e) {
 if (e.key !== 'Tab') return;
 const idx = focusable.indexOf(document.activeElement);
 const next = e.shiftKey ? idx - 1 : idx + 1;
 focusable[next < 0 ? focusable.length - 1 : next % focusable.length].focus();
 };

 container.addEventListener('keydown', focusTrapHandler);
 }

 function disableFocusTrap(container) {
 if (focusTrapHandler) {
 container.removeEventListener('keydown', focusTrapHandler);
 focusTrapHandler = null;
 }
 if (previouslyFocused) {
 previouslyFocused.focus();
 previouslyFocused = null;
 }
 }

 function closeNav() {
 mainNav.classList.remove('open');
 mainNav.setAttribute('data-open', 'false');
 navToggle.setAttribute('aria-expanded', 'false');
 disableFocusTrap(mainNav);
 }

 function openNav() {
 mainNav.classList.add('open');
 mainNav.setAttribute('data-open', 'true');
 navToggle.setAttribute('aria-expanded', 'true');
 enableFocusTrap(mainNav);
 }

 if (navToggle) {
 navToggle.addEventListener('click', () => {
 const isOpen = mainNav.getAttribute('data-open') === 'true';
 if (isOpen) {
 closeNav();
 } else {
 openNav();
 }
 });

 document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape' && mainNav.getAttribute('data-open') === 'true') {
 closeNav();
 }
 });

 document.addEventListener('click', (e) => {
 if (
 window.innerWidth <= 900 &&
 mainNav.classList.contains('open')
 ) {
 if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
 closeNav();
 }
 }
 });

 window.addEventListener('resize', () => {
 if (window.innerWidth > 900 && mainNav.classList.contains('open')) {
 closeNav();
 }
 });
 }

 // ========================================
 // 4. EFFET RIPPLE SUR BOUTONS
 // ========================================
 function attachRipples() {
 document.querySelectorAll('.btn').forEach((btn) => {
 btn.style.position = btn.style.position || 'relative';

 btn.addEventListener('click', function (e) {
 const rect = btn.getBoundingClientRect();
 const r = document.createElement('span');
 r.className = 'ripple';

 const size = Math.max(rect.width, rect.height) * 1.2;
 r.style.width = r.style.height = size + 'px';
 r.style.left = e.clientX - rect.left - size / 2 + 'px';
 r.style.top = e.clientY - rect.top - size / 2 + 'px';

 btn.appendChild(r);
 addGlowEffect(btn);
 setTimeout(() => r.remove(), 600);
 });
 });
 }

 attachRipples();

 // ========================================
 // 5. MICRO-INTERACTIONS 3D AVANCÉES
 // ========================================
 if (!prefersReduced) {
 document.querySelectorAll('.card').forEach((card) => {
 card.style.transformStyle = 'preserve-3d';
 let animId = null;

 const updateRotation = (x, y) => {
 const rect = card.getBoundingClientRect();
 const cx = rect.width / 2;
 const cy = rect.height / 2;
 const rx = (y - cy) / cy;
 const ry = (x - cx) / cx;
 const rotX = (-rx * 8).toFixed(2);
 const rotY = (ry * 8).toFixed(2);

 card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
 };

 card.addEventListener('mousemove', (e) => {
 if (animId) cancelAnimationFrame(animId);
 animId = requestAnimationFrame(() => {
 const rect = card.getBoundingClientRect();
 updateRotation(e.clientX - rect.left, e.clientY - rect.top);
 });
 });

 card.addEventListener('mouseleave', () => {
 if (animId) cancelAnimationFrame(animId);
 card.style.transform = '';
 });

 card.addEventListener('mouseenter', () => {
 addGlowEffect(card);
 });
 });
 }

 // ========================================
 // 6. TARIFICATION - BASCULER MENSUEL/ANNUEL
 // ========================================
 const billingToggle = document.getElementById('billingToggle');

 const updatePrices = (yearly) => {
 document.querySelectorAll('.card').forEach((card) => {
 const amtEl = card.querySelector('.amount');
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
 billingToggle.addEventListener('change', (e) => {
 updatePrices(e.target.checked);

 if (
 typeof toggleBillingSmall !== 'undefined' &&
 toggleBillingSmall
 ) {
 toggleBillingSmall.setAttribute(
 'aria-pressed',
 e.target.checked ? 'true' : 'false'
 );
 }

 computeEstimate();
 });
 }

 // ========================================
 // 7. CALCULATEUR DE RESSOURCES
 // ========================================
 const cpuRange = document.getElementById('cpuRange');
 const ramRange = document.getElementById('ramRange');
 const diskRange = document.getElementById('diskRange');
 const cpuVal = document.getElementById('cpuVal');
 const ramVal = document.getElementById('ramVal');
 const diskVal = document.getElementById('diskVal');
 const calcPrice = document.getElementById('calcPrice');

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
 el.addEventListener('input', () => {
 computeResourceCost();
 computeEstimate();
 });

 el.addEventListener('change', () => {
 addGlowEffect(el);
 });
 }
 });

 computeResourceCost();

 // ========================================
 // 8. SÉLECTION DES PLANS & ESTIMATION
 // ========================================
 let selectedPlan = null;
 const estPlan = document.getElementById('estPlan');
 const estResources = document.getElementById('estResources');
 const estPrice = document.getElementById('estPrice');
 const estPeriod = document.getElementById('estPeriod');
 const addToCart = document.getElementById('addToCart');
 const toggleBillingSmall = document.getElementById('toggleBillingSmall');

 const selectPlanElement = (card, btn) => {
 document
 .querySelectorAll('.card')
 .forEach((c) => {
 c.classList.remove('selected');
 c.setAttribute('aria-pressed', 'false');
 });

 document.querySelectorAll('.select-plan').forEach((b) => {
 b.setAttribute('aria-pressed', 'false');
 });

 if (!card) return;

 card.classList.add('selected');
 card.setAttribute('aria-pressed', 'true');
 addGlowEffect(card);

 if (btn) {
 btn.setAttribute('aria-pressed', 'true');
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

 document.querySelectorAll('.select-plan').forEach((btn) => {
 btn.addEventListener('click', (e) => {
 const card = btn.closest('.card');
 selectPlanElement(card, btn);
 btn.focus();
 });

 btn.addEventListener('keydown', (e) => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 btn.click();
 }
 });
 });

 document.querySelectorAll('.card').forEach((card) => {
 card.addEventListener('click', () => {
 const btn = card.querySelector('.select-plan');
 if (btn) {
 selectPlanElement(card, btn);
 btn.focus();
 }
 });

 card.addEventListener('keydown', (e) => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 const btn = card.querySelector('.select-plan');
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
 if (estPrice) estPrice.textContent = '€0';
 if (addToCart) addToCart.disabled = true;
 if (estResources)
 estResources.textContent = cpu + ' vCPU / ' + ram + 'GB / ' + disk + 'GB';
 return;
 }

 if (estResources) {
 estResources.textContent = cpu + ' vCPU / ' + ram + 'GB / ' + disk + 'GB';
 }

 if (periodYearly) {
 if (estPrice) animateNumber(estPrice, totalAnnual);
 if (estPeriod) estPeriod.textContent = '/an';
 } else {
 if (estPrice) animateNumber(estPrice, totalMonthly);
 if (estPeriod) estPeriod.textContent = '/mois';
 }

 if (addToCart) {
 addToCart.disabled = false;
 animateAmount(estPrice);
 }
 };

 if (toggleBillingSmall) {
 toggleBillingSmall.setAttribute('aria-controls', 'billingToggle');

 if (billingToggle) {
 toggleBillingSmall.setAttribute(
 'aria-pressed',
 billingToggle.checked ? 'true' : 'false'
 );
 }

 toggleBillingSmall.addEventListener('click', () => {
 const isYear =
 toggleBillingSmall.getAttribute('aria-pressed') === 'true';
 toggleBillingSmall.setAttribute('aria-pressed', (!isYear).toString());

 if (billingToggle) {
 billingToggle.checked = !isYear;
 billingToggle.dispatchEvent(new Event('change'));
 }

 computeEstimate();
 });
 }

 if (addToCart) {
 addToCart.addEventListener('click', () => {
 addGlowEffect(addToCart);
 showToast('Plan ajouté à l\'estimation.');
 addToCart.disabled = true;
 setTimeout(() => {
 addToCart.disabled = false;
 }, 1200);
 });
 }

 const preSel = document.querySelector('.card.selected');
 if (preSel) selectPlanElement(preSel, preSel.querySelector('.select-plan'));

 // ========================================
 // 9. TOAST / NOTIFICATIONS AMÉLIORÉES
 // ========================================
 const toast = document.getElementById('toast');
 const toastMsg = toast ? toast.querySelector('.toast-msg') : null;
 const toastClose = toast ? toast.querySelector('.toast-close') : null;
 let toastTimer = null;

 const showToast = (msg, timeout = 3500) => {
 if (!toast) return alert(msg);

 if (toastMsg) toastMsg.textContent = msg;
 toast.hidden = false;
 toast.classList.add('show');

 if (toastClose) toastClose.focus();

 if (toastTimer) clearTimeout(toastTimer);
 toastTimer = setTimeout(() => {
 hideToast();
 }, timeout);
 };

 const hideToast = () => {
 if (!toast) return;
 toast.classList.remove('show');
 clearTimeout(toastTimer);

 setTimeout(() => {
 toast.hidden = true;
 }, 250);
 };

 if (toastClose) toastClose.addEventListener('click', hideToast);

 document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape' && toast && toast.classList.contains('show')) {
 hideToast();
 }
 });

 // ========================================
 // 10. FORMULAIRE CONTACT AVEC VALIDATION
 // ========================================
 const form = document.getElementById('contactForm');

 if (form) {
 const setInvalid = (el, msg) => {
 el.setAttribute('aria-invalid', 'true');
 el.style.borderColor = 'var(--error)';
 addGlowEffect(el);
 showToast(msg);
 };

 const clearInvalid = (el) => {
 el.removeAttribute('aria-invalid');
 el.style.borderColor = '';
 };

 form.addEventListener('submit', (e) => {
 e.preventDefault();

 const fd = new FormData(form);
 const name = (fd.get('name') || '').trim();
 const email = (fd.get('email') || '').trim();
 const message = (fd.get('message') || '').trim();

 let ok = true;
 const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 if (name.length < 2) {
 setInvalid(form.querySelector('[name="name"]'), 'Nom trop court');
 ok = false;
 } else {
 clearInvalid(form.querySelector('[name="name"]'));
 }

 if (!emailRe.test(email)) {
 setInvalid(form.querySelector('[name="email"]'), 'Email invalide');
 ok = false;
 } else {
 clearInvalid(form.querySelector('[name="email"]'));
 }

 if (message.length < 6) {
 setInvalid(
 form.querySelector('[name="message"]'),
 'Message trop court'
 );
 ok = false;
 } else {
 clearInvalid(form.querySelector('[name="message"]'));
 }

 if (!ok) return;

 addGlowEffect(form.querySelector('button'));
 showToast(
 'Merci ! Message envoyé - notre équipe revient vers vous sous 24h.'
 );
 form.reset();
 });
 }

 // ========================================
 // 11. FORMULAIRE NEWSLETTER
 // ========================================
 const newsletterForm = document.getElementById('newsletterForm');

 if (newsletterForm) {
 newsletterForm.addEventListener('submit', (e) => {
 e.preventDefault();

 const email = (
 newsletterForm.querySelector('[name="email"]').value || ''
 ).trim();
 const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 if (!emailRe.test(email)) {
 showToast('Email invalide pour l\'inscription.');
 return;
 }

 addGlowEffect(newsletterForm.querySelector('button'));
 showToast('Merci ! Abonnement confirmé.');
 newsletterForm.reset();
 });
 }

 // ========================================
 // 12. ANIMATIONS D'APPARITION (REVEAL)
 // ========================================
 const revealEls = document.querySelectorAll('.reveal');

 if (IntersectionObserver in window && !prefersReduced) {
 const obs = new IntersectionObserver(
 (entries) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 const items = Array.from(
 entry.target.querySelectorAll('[data-reveal-el]')
 );

 if (items.length) {
 items.forEach((it, i) => {
 it.style.setProperty('--delay', i * 80 + 'ms');
 });
 }

 entry.target.classList.add('in-view');
 obs.unobserve(entry.target);
 }
 });
 },
 { threshold: 0.12 }
 );

 revealEls.forEach((el) => obs.observe(el));
 } else {
 revealEls.forEach((el) => el.classList.add('in-view'));
 }

 // ========================================
 // 13. PARALLAX & SMOOTH SCROLL
 // ========================================
 initSmoothScroll();

 if (!prefersReduced) {
 window.addEventListener('scroll', () => {
 const parallaxEls = document.querySelectorAll('[data-parallax]');
 parallaxEls.forEach((el) => {
 const speed = parseFloat(el.dataset.parallax) || 0.5;
 el.style.transform = `translateY(${window.pageYOffset * speed}px)`;
 });
 });
 }

 // ========================================
 // 14. OBSERVER DES MUTATIONS
 // ========================================
 if ('MutationObserver' in window) {
 const observer = new MutationObserver(() => {
 attachRipples();
 });

 observer.observe(document.body, {
 childList: true,
 subtree: true,
 });
 }
})();
