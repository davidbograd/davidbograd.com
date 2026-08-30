(function () {
  var root = document.documentElement;
  root.classList.add("js");

  /* --- Theme toggle ----------------------------------------------------- */

  var toggle = document.querySelector(".theme-toggle");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    if (!toggle) return;
    var dark = theme === "dark";
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  apply(root.getAttribute("data-theme") || "light");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  // Follow the OS unless the visitor has made an explicit choice.
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", function (event) {
    var stored = null;
    try {
      stored = localStorage.getItem("theme");
    } catch (e) {}
    if (!stored) apply(event.matches ? "dark" : "light");
  });

  /* --- Nav hairline on scroll ------------------------------------------- */

  var nav = document.querySelector(".nav");

  if (nav) {
    var onScroll = function () {
      nav.setAttribute("data-scrolled", String(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Reveal on scroll ------------------------------------------------- */

  var targets = document.querySelectorAll(".reveal");

  if (!targets.length) return;

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    targets.forEach(function (el) {
      el.classList.add("is-in");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  targets.forEach(function (el, i) {
    el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
    observer.observe(el);
  });
})();
