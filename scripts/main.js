const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function createToast() {
  const toast = $("#toast");
  if (!toast) return { show: () => {} };

  let timeoutId = null;
  const show = (message) => {
    toast.textContent = message;
    toast.classList.add("is-open");
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      toast.classList.remove("is-open");
    }, 2400);
  };

  return { show };
}

const toast = createToast();

function initMobileNav() {
  const toggle = $(".nav-toggle");
  const menu = $("#nav-menu");
  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };
  const close = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  const isOpen = () => menu.classList.contains("is-open");

  toggle.addEventListener("click", () => {
    if (isOpen()) close();
    else open();
  });

  $all(".nav-link", menu).forEach((link) => {
    link.addEventListener("click", () => close());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  document.addEventListener("click", (event) => {
    if (!isOpen()) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest(".navbar")) return;
    close();
  });
}

function initScrollSpy() {
  const links = $all(".nav-link");
  if (links.length === 0) return;

  const byId = new Map();
  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    const id = href.slice(1);
    if (!id) return;
    byId.set(id, link);
  });

  const sections = $all("main section[id]").filter((section) => byId.has(section.id));
  if (sections.length === 0) return;

  const setActive = (id) => {
    links.forEach((l) => l.classList.remove("is-active"));
    const active = byId.get(id);
    if (active) active.classList.add("is-active");
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (visible) setActive(visible.target.id);
    },
    { root: null, threshold: [0.2, 0.35, 0.5], rootMargin: "-20% 0px -65% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

function initComposition() {
  const composition = $("#hero-composition");
  if (!composition) return;

  const shapes = $all(".shape", composition);
  if (shapes.length === 0) return;

  const setActive = (shape) => {
    shapes.forEach((s) => s.classList.remove("is-active"));
    shape.classList.add("is-active");
  };

  shapes.forEach((shape) => {
    shape.addEventListener("click", (event) => {
      event.stopPropagation();
      setActive(shape);
    });
  });

  composition.addEventListener("click", () => {
    const currentIndex = shapes.findIndex((s) => s.classList.contains("is-active"));
    const next = shapes[(currentIndex + 1) % shapes.length] || shapes[0];
    setActive(next);
  });

  if (prefersReducedMotion.matches) return;

  let pending = false;
  let px = 0;
  let py = 0;

  const update = () => {
    pending = false;
    composition.style.setProperty("--px", String(px));
    composition.style.setProperty("--py", String(py));
  };

  const onMove = (event) => {
    const rect = composition.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dx = (x / rect.width - 0.5) * 2;
    const dy = (y / rect.height - 0.5) * 2;
    px = Math.round(dx * 18);
    py = Math.round(dy * 18);

    if (!pending) {
      pending = true;
      window.requestAnimationFrame(update);
    }
  };

  composition.addEventListener("pointermove", onMove);
  composition.addEventListener("pointerleave", () => {
    px = 0;
    py = 0;
    if (!pending) {
      pending = true;
      window.requestAnimationFrame(update);
    }
  });
}

function initCopyButtons() {
  const buttons = $all("[data-copy]");
  if (buttons.length === 0) return;

  const fallbackCopy = (value) => {
    const input = document.createElement("input");
    input.value = value;
    input.setAttribute("readonly", "true");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      input.remove();
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || "";
      if (!value) return;

      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          await navigator.clipboard.writeText(value);
          toast.show("Copied to clipboard");
          return;
        }
      } catch {
        // ignore and fallback
      }

      const ok = fallbackCopy(value);
      toast.show(ok ? "Copied to clipboard" : "Copy failed");
    });
  });
}

function initModal() {
  const openBtn = $("#gpt-details-btn");
  const overlay = $("#gpt-modal");
  if (!openBtn || !overlay) return;

  const dialog = $(".modal-content", overlay);
  const closeBtn = $(".modal-close", overlay);
  const title = $("#gpt-modal-title", overlay);

  if (!dialog || !closeBtn) return;

  let lastFocused = null;

  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, details summary, [tabindex]:not([tabindex="-1"])';

  const getFocusable = () =>
    $all(focusableSelector, dialog).filter((el) => el instanceof HTMLElement && !el.hasAttribute("disabled"));

  const trapFocus = (event) => {
    if (event.key !== "Tab") return;
    const items = getFocusable();
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || active === dialog) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const open = () => {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown, true);
    dialog.addEventListener("keydown", trapFocus);
    window.setTimeout(() => {
      if (title instanceof HTMLElement) {
        title.setAttribute("tabindex", "-1");
        title.focus();
      } else {
        closeBtn.focus();
      }
    }, 0);
  };

  const close = () => {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeyDown, true);
    dialog.removeEventListener("keydown", trapFocus);
    if (lastFocused) lastFocused.focus();
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") close();
  };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollSpy();
  initComposition();
  initCopyButtons();
  initModal();
});

