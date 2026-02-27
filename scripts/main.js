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

function initTerminal() {
  const input = $("#terminal-input");
  const body = $("#terminal-body");
  const inputLine = $("#terminal-input-line");

  if (!input || !body || !inputLine) return;

  const graphragUrl =
    "https://www.luc.edu/quinlan/whyquinlan/centersandlabs/labforappliedartificialintelligence/research/2025/4thquarter2025/graphragamassiveleapinllmreal-worldintelligence/";
  const resumeUrl = "assets/resume.pdf";

  const commands = [
    "help",
    "whoami",
    "stats",
    "skills",
    "experience",
    "projects",
    "writing",
    "contact",
    "resume",
    "go",
    "open",
    "copy",
    "clear",
    "banner",
  ];

  const goTargets = {
    home: "#home",
    about: "#about",
    experience: "#experience",
    projects: "#projects",
    writing: "#writing",
    contact: "#contact",
    cta: "#cta",
  };

  const openTargets = {
    resume: resumeUrl,
    graphrag: graphragUrl,
    clipandtrim: "https://clipandtrim.io",
    gator: "https://gatorbeachvolleyball.com",
    linkedin: "https://www.linkedin.com/in/laurynaskanopka/",
    github: "https://github.com/lukaskanopka",
  };

  const history = [];
  let historyIndex = -1;

  const scrollToBottom = () => {
    body.scrollTop = body.scrollHeight;
  };

  const insertBeforeInput = (node) => {
    body.insertBefore(node, inputLine);
  };

  const addLine = (kind, text) => {
    const line = document.createElement("div");
    line.className = `terminal-line terminal-line--${kind}`;
    line.textContent = text;
    insertBeforeInput(line);
    scrollToBottom();
  };

  const addBlock = (kind, text) => {
    const block = document.createElement("div");
    block.className = `terminal-block terminal-block--${kind}`;
    block.textContent = text;
    insertBeforeInput(block);
    scrollToBottom();
  };

  const addDivider = () => {
    const hr = document.createElement("div");
    hr.className = "terminal-divider";
    insertBeforeInput(hr);
    scrollToBottom();
  };

  const computeSuggestion = (value) => {
    const v = value.trim();
    if (!v) return "";

    const [head, ...rest] = v.split(/\s+/);
    const cmd = head.toLowerCase();

    if (rest.length === 0) {
      const match = commands.find((c) => c.startsWith(cmd));
      if (match && match !== cmd) return match.slice(cmd.length);
      return "";
    }

    if (cmd === "go") {
      const partial = rest.join(" ").toLowerCase();
      const match = Object.keys(goTargets).find((k) => k.startsWith(partial));
      if (match && match !== partial) return match.slice(partial.length);
    }

    if (cmd === "open") {
      const partial = rest.join(" ").toLowerCase();
      const match = Object.keys(openTargets).find((k) => k.startsWith(partial));
      if (match && match !== partial) return match.slice(partial.length);
    }

    if (cmd === "copy") {
      const partial = rest.join(" ").toLowerCase();
      const options = ["email", "github", "linkedin"];
      const match = options.find((k) => k.startsWith(partial));
      if (match && match !== partial) return match.slice(partial.length);
    }

    return "";
  };

  const setInputFromHistory = (index) => {
    const value = history[index] || "";
    input.value = value;
    input.setSelectionRange(value.length, value.length);
  };

  const openUrl = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const doGo = (target) => {
    const href = goTargets[target];
    if (!href) return false;
    const el = $(href);
    if (!el) return false;
    el.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "start" });
    return true;
  };

  const doCopy = async (value) => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      // ignore
    }

    const inputEl = document.createElement("input");
    inputEl.value = value;
    inputEl.setAttribute("readonly", "true");
    inputEl.style.position = "fixed";
    inputEl.style.left = "-9999px";
    document.body.appendChild(inputEl);
    inputEl.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      inputEl.remove();
    }
  };

  const banner = () => {
    return [
      "┌───────────────────────────────┐",
      "│             LUKAS              │",
      "├───────────────────────────────┤",
      "│  type 'help' to explore        │",
      "└───────────────────────────────┘",
    ].join("\n");
  };

  const helpText = () => {
    return [
      "Commands",
      "  • help — show this help",
      "  • whoami — quick summary",
      "  • stats — metrics snapshot",
      "  • skills — skills overview",
      "  • experience — work experience summary",
      "  • projects — project shortlist",
      "  • writing — publication + link",
      "  • contact — contact methods",
      "  • resume — open resume PDF",
      "  • go <section> — jump (home/about/experience/projects/writing/contact/cta)",
      "  • open <thing> — open (resume/graphrag/clipandtrim/gator/github/linkedin)",
      "  • copy <thing> — copy (email/github/linkedin)",
      "  • clear — clear terminal",
      "  • banner — show banner art",
      "",
      "Tips",
      "  • Enter runs • Tab completes • ↑/↓ history",
    ].join("\n");
  };

  const whoamiText = () =>
    [
      "Lukas Kanopka",
      "Software Engineer — full-stack (Python/FastAPI/Vue) + applied ML.",
      "I like performance, clean UX, and shipping systems end-to-end.",
    ].join("\n");

  const statsText = () =>
    [
      "40% faster API responses (Swimage)",
      "80% less manual work (classification pipeline)",
      "20× faster encoding (ClipAndTrim)",
      "3.96 GPA (UF, CS • Minor Statistics)",
    ].join("\n");

  const skillsText = () =>
    [
      "Languages: Python, Java, C++, SQL, R, JavaScript",
      "Web: FastAPI, Flask, Vue.js, React, Node.js, Pydantic, SQLAlchemy",
      "Tools/Cloud/ML: Git, Docker, Google Cloud, DigitalOcean, Netlify, PyTorch, Scikit-learn, Pandas, NumPy, SpaCy",
    ].join("\n");

  const experienceText = () =>
    [
      "Swimage — Software Engineer (Aug 2025–Present)",
      "  - Migrated legacy portal to Vue.js + FastAPI; 40% faster APIs",
      "  - Orchestrated remote OS/software installs at scale",
      "",
      "Swimage — Full Stack SWE Intern (Jun 2025–Aug 2025)",
      "  - Python pipeline integrating Gemini + OpenRouter",
      "  - Multi-tenant auth (JWT + bitmask permissions)",
      "",
      "ClipAndTrim.io — Freelance Full Stack Developer (Mar 2025–Aug 2025)",
      "  - FastAPI + FFmpeg + GPU acceleration; 20× faster encoding",
    ].join("\n");

  const projectsText = () =>
    [
      "Projects:",
      "  - clipandtrim      (open clipandtrim)",
      "  - gator            (open gator)",
      "  - gpt model        (see Projects section; details modal)",
      "  - spotify floater  (GitHub)",
      "  - degrees of spotify (GitHub)",
      "",
      "Try: go projects",
    ].join("\n");

  const writingText = () =>
    [
      "GraphRAG: A Massive Leap in LLM Real-World Intelligence",
      "Intelligence • Q4 2025",
      "",
      "Open it: open graphrag",
    ].join("\n");

  const contactText = () =>
    [
      "Email:    lukaskanopka@icloud.com  (copy email)",
      "GitHub:   github.com/lukaskanopka  (open github | copy github)",
      "LinkedIn: linkedin.com/in/laurynaskanopka  (open linkedin | copy linkedin)",
    ].join("\n");

  const run = async (raw) => {
    const command = raw.trim();
    if (!command) return;
    addLine("prompt", `$ ${command}`);

    const parts = command.split(/\s+/);
    const head = (parts[0] || "").toLowerCase();
    const args = parts.slice(1);

    switch (head) {
      case "help":
        addBlock("output", helpText());
        return;
      case "banner":
        addBlock("output", banner());
        return;
      case "whoami":
        addBlock("output", whoamiText());
        return;
      case "stats":
        addBlock("output", statsText());
        return;
      case "skills":
        addBlock("output", skillsText());
        return;
      case "experience":
        addBlock("output", experienceText());
        return;
      case "projects":
        addBlock("output", projectsText());
        return;
      case "writing":
        addBlock("output", writingText());
        return;
      case "contact":
        addBlock("output", contactText());
        return;
      case "resume":
        openUrl(resumeUrl);
        addBlock("output", "Opened: resume");
        return;
      case "go": {
        const target = (args[0] || "").toLowerCase();
        if (!target) {
          addBlock("error", "Usage: go <home|about|experience|projects|writing|contact|cta>");
          return;
        }
        if (doGo(target)) {
          addBlock("output", `Jumped to: ${target}`);
          return;
        }
        addBlock("error", `Unknown section: ${target}`);
        return;
      }
      case "open": {
        const target = (args[0] || "").toLowerCase();
        if (!target) {
          addBlock("error", "Usage: open <resume|graphrag|clipandtrim|gator|github|linkedin>");
          return;
        }
        const url = openTargets[target];
        if (!url) {
          addBlock("error", `Unknown link: ${target}`);
          return;
        }
        openUrl(url);
        addBlock("output", `Opened: ${target}`);
        return;
      }
      case "copy": {
        const target = (args[0] || "").toLowerCase();
        const map = {
          email: "lukaskanopka@icloud.com",
          github: "https://github.com/lukaskanopka",
          linkedin: "https://www.linkedin.com/in/laurynaskanopka/",
        };
        const value = map[target];
        if (!value) {
          addBlock("error", "Usage: copy <email|github|linkedin>");
          return;
        }
        const ok = await doCopy(value);
        addBlock("output", ok ? `Copied: ${target}` : "Copy failed");
        if (ok) toast.show("Copied to clipboard");
        return;
      }
      case "clear":
        body.replaceChildren(inputLine);
        return;
      default:
        addBlock("error", `Command not found: ${head}. Type 'help'.`);
        return;
    }
  };

  const completeFromGhost = () => {
    const suggestion = computeSuggestion(input.value);
    if (!suggestion) return false;
    input.value = input.value + suggestion;
    return true;
  };

  const printIntro = async () => {
    addBlock("output", banner());
    addDivider();
    addBlock("output", "Try: help • go projects • open resume • copy email");
  };

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = input.value;
      if (!value.trim()) return;
      history.unshift(value);
      historyIndex = -1;
      if (history.length > 30) history.pop();
      input.value = "";
      void run(value);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      if (!completeFromGhost()) toast.show("No completion");
      return;
    }

    if (event.key === "ArrowUp") {
      if (history.length === 0) return;
      event.preventDefault();
      historyIndex = Math.min(historyIndex + 1, history.length - 1);
      setInputFromHistory(historyIndex);
      return;
    }

    if (event.key === "ArrowDown") {
      if (history.length === 0) return;
      event.preventDefault();
      historyIndex = Math.max(historyIndex - 1, -1);
      if (historyIndex === -1) {
        input.value = "";
      } else {
        setInputFromHistory(historyIndex);
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      input.focus();
    }
  });

  body.addEventListener("click", () => {
    input.focus();
  });

  // Auto focus on load (desktop only-ish)
  window.setTimeout(() => {
    input.focus();
  }, 350);

  void printIntro();
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
  initTerminal();
  initCopyButtons();
  initModal();
});
