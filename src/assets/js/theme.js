(function () {
  var root = document.documentElement;
  root.classList.add("js");

  /* --- Split headings into words for the staggered reveal ---------------- */

  // Walks text nodes rather than rewriting innerHTML, so inline markup such as
  // <em> survives intact.
  document.querySelectorAll("[data-split-words]").forEach(function (heading) {
    var walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(function (node) {
      if (!node.nodeValue.trim()) return;
      // Elements marked as a word already animate as one unit.
      if (node.parentElement.closest(".word")) return;

      var fragment = document.createDocumentFragment();

      // Splits on ordinary whitespace only, so &nbsp; keeps names together.
      node.nodeValue.split(/([ \t\n\r]+)/).forEach(function (chunk) {
        if (!chunk) return;
        if (/^[ \t\n\r]+$/.test(chunk)) {
          fragment.appendChild(document.createTextNode(" "));
          return;
        }
        var span = document.createElement("span");
        span.className = "word";
        span.textContent = chunk;
        fragment.appendChild(span);
      });

      node.parentNode.replaceChild(fragment, node);
    });

    heading.querySelectorAll(".word").forEach(function (word, i) {
      word.style.setProperty("--delay", i * 26 + "ms");
    });
  });

  /* --- Drag to pan the hero collage ------------------------------------- */

  // Trackpads and touch scroll it natively; this adds click-and-drag for mice.
  document.querySelectorAll("[data-pan]").forEach(function (strip) {
    var startX = 0;
    var startScroll = 0;

    strip.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      startX = event.clientX;
      startScroll = strip.scrollLeft;
      strip.setAttribute("data-dragging", "true");
      strip.setPointerCapture(event.pointerId);
    });

    strip.addEventListener("pointermove", function (event) {
      if (strip.getAttribute("data-dragging") !== "true") return;
      strip.scrollLeft = startScroll - (event.clientX - startX);
    });

    function stop() {
      strip.removeAttribute("data-dragging");
    }

    strip.addEventListener("pointerup", stop);
    strip.addEventListener("pointercancel", stop);
  });

  var calm = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* --- Picture cursor over a word --------------------------------------- */

  document.querySelectorAll("[data-cursor], [data-preview]").forEach(function (target) {
    var chip = document.getElementById(
      target.getAttribute("data-cursor") || target.getAttribute("data-preview")
    );
    if (!chip) return;
    var preview = chip.classList.contains("cursor-chip--preview");

    // Chips marked data-swing lean into horizontal movement and hold that
    // lean when the pointer stops; moving back the other way undoes it. The
    // faster the pointer moves, the more each pixel adds, so gentle moves
    // nudge it and flicks throw it. The card follows on a slightly loose
    // spring: it swings a little past where it's heading, including past the
    // limit, then settles back. The target is limited so the card's overall
    // angle, including its resting tilt, settles within ±maxLean.
    var inner = chip.querySelector(".cursor-chip__inner");
    var swings = chip.hasAttribute("data-swing");
    var rest = parseFloat(getComputedStyle(chip).getPropertyValue("--rest-tilt")) || 0;
    var maxLean = 6;
    var minPush = -maxLean - rest;
    var maxPush = maxLean - rest;
    var push = 0;
    var tilt = 0;
    var spin = 0;
    var speed = 0;
    var lastX = null;
    var lastTime = 0;
    var frame = 0;

    function swing() {
      spin = (spin + (push - tilt) * 0.07) * 0.72;
      tilt += spin;
      inner.style.setProperty("--tilt", tilt.toFixed(2) + "deg");
      frame =
        Math.abs(push - tilt) > 0.05 || Math.abs(spin) > 0.01
          ? requestAnimationFrame(swing)
          : 0;
    }

    function place(event) {
      var x = event.clientX;
      var y = event.clientY;

      // Sit the screenshot just past the pointer, and flip it back inside
      // the window when the pointer is near an edge.
      if (preview) {
        var gap = 16;
        var width = chip.offsetWidth;
        var height = chip.offsetHeight;
        x += gap;
        y += gap + 8;
        if (x + width > window.innerWidth - 12) x = event.clientX - width - gap;
        if (y + height > window.innerHeight - 12) y = event.clientY - height - gap;
      }

      chip.style.setProperty("--cursor-x", x + "px");
      chip.style.setProperty("--cursor-y", y + "px");

      if (!swings || calm.matches) return;
      if (lastX !== null) {
        var dx = event.clientX - lastX;
        var dt = Math.max(event.timeStamp - lastTime, 8);
        var current = Math.abs(dx) / dt;
        // Speed in px/ms, smoothed so one jittery event can't spike it. After
        // a pause the old speed no longer applies.
        speed = dt > 100 ? current : speed * 0.4 + current * 0.6;
        var gain = 0.084 * Math.min(Math.max(speed / 0.6, 0.25), 3);
        push = Math.max(minPush, Math.min(maxPush, push + dx * gain));
      }
      lastX = event.clientX;
      lastTime = event.timeStamp;
      if (!frame) frame = requestAnimationFrame(swing);
    }

    target.addEventListener("pointerenter", function (event) {
      if (event.pointerType !== "mouse") return;
      lastX = null;
      speed = 0;
      place(event);
      chip.setAttribute("data-active", "true");
    });

    target.addEventListener("pointermove", function (event) {
      if (event.pointerType === "mouse") place(event);
    });

    target.addEventListener("pointerleave", function () {
      chip.removeAttribute("data-active");
    });
  });

  /* --- Sparkles over a phrase ------------------------------------------- */

  var sparkleColours = ["#fa4c03", "#ffb800", "#ff5fa2", "#3d7bff"];

  document.querySelectorAll("[data-sparkle]").forEach(function (phrase) {
    // Each letter gets its own box so the letters can hop in turn. Screen
    // readers get the plain words instead of letter-by-letter spans.
    var index = 0;
    phrase.querySelectorAll(".word").forEach(function (word) {
      var text = word.textContent;
      var letters = document.createElement("span");
      letters.setAttribute("aria-hidden", "true");
      Array.from(text).forEach(function (letter) {
        var span = document.createElement("span");
        span.className = "char";
        span.textContent = letter;
        span.style.setProperty("--i", index++);
        letters.appendChild(span);
      });
      var spoken = document.createElement("span");
      spoken.className = "visually-hidden";
      spoken.textContent = text;
      word.textContent = "";
      word.appendChild(letters);
      word.appendChild(spoken);
    });

    var chars = phrase.querySelectorAll(".char");
    var lastChar = chars[chars.length - 1];
    var timer = null;

    function spawn() {
      var star = document.createElement("span");
      star.className = "sparkle";
      star.setAttribute("aria-hidden", "true");
      star.style.setProperty("--size", (0.14 + Math.random() * 0.22).toFixed(2) + "em");
      star.style.setProperty("--spin", Math.round(Math.random() * 180 - 90) + "deg");
      star.style.left = (Math.random() * 100).toFixed(1) + "%";
      star.style.top = (Math.random() * 120 - 10).toFixed(1) + "%";
      star.style.color = sparkleColours[Math.floor(Math.random() * sparkleColours.length)];
      star.addEventListener("animationend", function () {
        star.remove();
      });
      phrase.appendChild(star);
    }

    phrase.addEventListener("pointerenter", function () {
      // A burst that is already running plays out rather than restarting.
      if (calm.matches || phrase.classList.contains("is-sparkling")) return;
      phrase.classList.add("is-sparkling");

      // One burst per visit: sparkles keep coming while the letters hop, then
      // stop even if the pointer stays.
      for (var i = 0; i < 6; i++) spawn();
      timer = setInterval(spawn, 130);
    });

    phrase.addEventListener("animationend", function (event) {
      if (event.target !== lastChar) return;
      phrase.classList.remove("is-sparkling");
      clearInterval(timer);
    });
  });

  /* --- Active menu marker ------------------------------------------------ */

  var menu = document.querySelector(".mast__nav");

  if (menu) {
    var marker = menu.querySelector(".mast__marker");
    var links = Array.prototype.slice.call(menu.querySelectorAll("a"));
    var activeLink = null;
    var lockedLink = null;

    var placeMarker = function (link, animate) {
      links.forEach(function (item) {
        if (item === link) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });

      // Sit just outside the label, so the words stay flush with the name.
      var x = link.offsetLeft - marker.offsetWidth - 6;
      var y = link.offsetTop + (link.offsetHeight - marker.offsetHeight) / 2;

      if (!animate) marker.style.transition = "none";
      marker.style.transform = "translate(" + x + "px, " + y + "px)";
      if (!animate) {
        marker.getBoundingClientRect();
        marker.style.transition = "";
      }
    };

    var linkForHash = function (hash) {
      return links.find(function (link) {
        return link.getAttribute("href").endsWith(hash);
      });
    };

    var sectionLink = function () {
      var about = document.getElementById("about");
      var aboutLink = linkForHash("#about");
      var workLink = linkForHash("#top") || links[0];

      if (!about || !aboutLink) return workLink;

      // About takes over once its heading has climbed into the top half.
      if (about.getBoundingClientRect().top < window.innerHeight * 0.45) {
        return aboutLink;
      }

      return workLink;
    };

    var syncMarker = function (animate) {
      var next = sectionLink();

      if (lockedLink) {
        if (next === lockedLink) lockedLink = null;
        else next = lockedLink;
      }

      if (!next || (animate && next === activeLink)) return;
      var moved = Boolean(activeLink && activeLink !== next);
      activeLink = next;
      placeMarker(next, animate && moved);
    };

    var lockScroll = window.scrollY;

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        lockedLink = link;
        lockScroll = window.scrollY;
        syncMarker(true);
      });
    });

    window.addEventListener("hashchange", function () {
      var link = linkForHash(window.location.hash);
      if (!link) return;
      lockedLink = link;
      lockScroll = window.scrollY;
      syncMarker(true);
    });

    window.addEventListener("scroll", function () {
      if (lockedLink) {
        var aboutLink = linkForHash("#about");
        var towardAbout = lockedLink === aboutLink;
        var reversed = towardAbout
          ? window.scrollY < lockScroll - 24
          : window.scrollY > lockScroll + 24;
        if (reversed) lockedLink = null;
        else lockScroll = window.scrollY;
      }
      syncMarker(true);
    }, { passive: true });

    window.addEventListener("resize", function () {
      if (!activeLink) return;
      placeMarker(activeLink, false);
    });

    if (window.location.hash) {
      var hashed = linkForHash(window.location.hash);
      if (hashed) lockedLink = hashed;
    }

    syncMarker(false);
  }

  /* --- Nav hairline on scroll ------------------------------------------- */

  var nav = document.querySelector(".nav");

  if (nav) {
    var onScroll = function () {
      nav.setAttribute("data-scrolled", String(window.scrollY > 8));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Company name fills the 1100px image width ------------------------ */

  var caseNames = document.querySelectorAll("[data-fit-width]");

  function fitCaseNames() {
    caseNames.forEach(function (heading) {
      var text = heading.querySelector("span");
      if (!text) return;
      var target = heading.clientWidth;
      if (!target) return;

      var min = 8;
      var max = target;
      var best = min;

      for (var i = 0; i < 18; i++) {
        var mid = (min + max) / 2;
        text.style.fontSize = mid + "px";
        // A few pixels short of the edge, so the last glyph is not clipped.
        if (text.getBoundingClientRect().width <= target - 8) {
          best = mid;
          min = mid;
        } else {
          max = mid;
        }
      }

      text.style.fontSize = best + "px";
    });
  }

  if (caseNames.length) {
    fitCaseNames();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitCaseNames);
    window.addEventListener("resize", fitCaseNames);
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
