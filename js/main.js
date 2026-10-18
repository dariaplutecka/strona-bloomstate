(function () {
  const STORAGE_KEY = "bloomstate-lang";
  let currentLang = localStorage.getItem(STORAGE_KEY) || "pl";

  function getNested(obj, path) {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
  }

  function setLanguage(lang) {
    if (!window.TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    const t = window.TRANSLATIONS[lang];
    document.title = t.meta.title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = t.meta.description;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getNested(t, key);
      if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = getNested(t, key);
      if (value !== undefined) el.placeholder = value;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const value = getNested(t, key);
      if (value !== undefined) el.setAttribute("aria-label", value);
    });

    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    window.dispatchEvent(new CustomEvent("bloomstate:langchange"));
  }

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });

  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const honeypot = form.querySelector('[name="your-url"]');
      if (honeypot && honeypot.value) return;

      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();
      const subject = encodeURIComponent(`Bloomstate - ${name}`);
      const body = encodeURIComponent(`${message}\n\n---\n${name}\n${email}`);
      window.location.href = `mailto:contact@bloomstate.eu?subject=${subject}&body=${body}`;
    });
  }

  function initServicesTabs() {
    const nav = document.querySelector(".services-tabs__nav");
    const panelsWrap = document.querySelector(".services-tabs__panels");
    if (!nav || !panelsWrap) return;

    const tabs = [...nav.querySelectorAll('[role="tab"]')];
    const panels = [...panelsWrap.querySelectorAll('[role="tabpanel"]')];
    const indicator = nav.querySelector(".services-tabs__indicator");
    let activeIndex = tabs.findIndex((tab) => tab.classList.contains("is-active"));
    if (activeIndex < 0) activeIndex = 0;

    function moveIndicator(tab) {
      if (!indicator || window.matchMedia("(max-width: 980px)").matches) return;
      indicator.style.height = `${tab.offsetHeight}px`;
      indicator.style.transform = `translateY(${tab.offsetTop}px)`;
    }

    function syncMaxPanelHeight() {
      let maxHeight = 0;

      panels.forEach((panel) => {
        const isActive = panel.classList.contains("is-active");
        panel.hidden = false;
        panel.classList.add("is-measuring");
        maxHeight = Math.max(maxHeight, panel.offsetHeight);
        panel.classList.remove("is-measuring");
        if (!isActive) panel.hidden = true;
      });

      panelsWrap.style.minHeight = `${maxHeight}px`;
    }

    function activate(index, focusTab) {
      if (index === activeIndex || index < 0 || index >= tabs.length) return;

      const prevPanel = panels[activeIndex];
      const nextPanel = panels[index];
      const nextTab = tabs[index];
      const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;

      tabs[activeIndex].classList.remove("is-active");
      tabs[activeIndex].setAttribute("aria-selected", "false");

      prevPanel.classList.add("is-leaving");
      prevPanel.classList.remove("is-active");

      window.setTimeout(() => {
        prevPanel.classList.remove("is-leaving");
        prevPanel.hidden = true;

        nextPanel.hidden = false;
        nextPanel.classList.add("is-active");
        moveIndicator(nextTab);

        activeIndex = index;
        nextTab.classList.add("is-active");
        nextTab.setAttribute("aria-selected", "true");
        if (focusTab) nextTab.focus();
      }, delay);
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(index, false));
      tab.addEventListener("keydown", (event) => {
        let nextIndex = index;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          nextIndex = (index + 1) % tabs.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          nextIndex = (index - 1 + tabs.length) % tabs.length;
        } else {
          return;
        }
        event.preventDefault();
        activate(nextIndex, true);
      });
    });

    panels.forEach((panel, index) => {
      if (index !== activeIndex) panel.hidden = true;
    });

    syncMaxPanelHeight();
    moveIndicator(tabs[activeIndex]);

    window.addEventListener("resize", () => {
      syncMaxPanelHeight();
      moveIndicator(tabs[activeIndex]);
    });

    window.addEventListener("bloomstate:langchange", () => {
      window.requestAnimationFrame(() => {
        syncMaxPanelHeight();
        moveIndicator(tabs[activeIndex]);
      });
    });

  }

  setLanguage(currentLang);
  initServicesTabs();
})();
