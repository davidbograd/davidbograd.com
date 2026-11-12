(function () {
  var root = document.documentElement;
  root.classList.add("js");

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
    var label = chip.classList.contains("cursor-chip--label");

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
      if (preview || label) {
        var gap = 16;
        var width = chip.offsetWidth;
        var height = chip.offsetHeight;
        var shiftX = label ? 16 : gap;
        var shiftY = label ? 14 : gap + 8;
        x += shiftX;
        y += shiftY;
        if (x + width > window.innerWidth - 12) x = event.clientX - width - shiftX;
        if (y + height > window.innerHeight - 12) y = event.clientY - height - shiftY;
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

  /* --- Copy the email address ------------------------------------------- */

  var copyChip = document.getElementById("copy-cursor");
  if (copyChip) {
    var copyLabel = copyChip.querySelector(".cursor-chip__inner");
    var copyTimer = 0;

    function copyWithSelection(value) {
      var area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      var ok = document.execCommand("copy");
      area.remove();
      return ok ? Promise.resolve() : Promise.reject();
    }

    function copyText(value) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(value).catch(function () {
          return copyWithSelection(value);
        });
      }
      return copyWithSelection(value);
    }

    document.querySelectorAll("[data-copy]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        var value = button.getAttribute("data-copy");
        if (!value) return;
        copyText(value).then(function () {
          copyLabel.textContent = "Copied";
          button.dispatchEvent(
            new PointerEvent("pointermove", {
              bubbles: true,
              pointerType: "mouse",
              clientX: event.clientX,
              clientY: event.clientY,
            })
          );
          clearTimeout(copyTimer);
          copyTimer = setTimeout(function () {
            copyLabel.textContent = "Copy";
          }, 1200);
        });
      });
    });
  }

  /* --- Sparkles over a phrase ------------------------------------------- */

  var sparkleColours = ["#e476b3", "#ffb800", "#ff5fa2", "#3d7bff"];

  document.querySelectorAll("[data-sparkle]").forEach(function (phrase) {
    // Each letter gets its own box so the letters can hop in turn. Screen
    // readers get the plain words instead of letter-by-letter spans.
    var index = 0;
    var text = phrase.textContent;
    var letters = document.createElement("span");
    letters.setAttribute("aria-hidden", "true");
    var word = null;
    Array.from(text).forEach(function (letter) {
      if (letter === " ") {
        letters.appendChild(document.createTextNode(" "));
        word = null;
        return;
      }
      // Keep each word, including its punctuation, on one line. The letters
      // inside can still hop on their own.
      if (!word) {
        word = document.createElement("span");
        word.className = "word";
        letters.appendChild(word);
      }
      if (".,!?;:".indexOf(letter) !== -1) {
        word.appendChild(document.createTextNode(letter));
        return;
      }
      var span = document.createElement("span");
      span.className = "char";
      span.textContent = letter;
      span.style.setProperty("--i", index++);
      word.appendChild(span);
    });
    var spoken = document.createElement("span");
    spoken.className = "visually-hidden";
    spoken.textContent = text;
    phrase.textContent = "";
    phrase.appendChild(letters);
    phrase.appendChild(spoken);

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
      var workLink = linkForHash("#top") || links[0];
      var stops = ["#side-projects", "#about"];

      for (var i = 0; i < stops.length; i++) {
        var id = stops[i].slice(1);
        var section = document.getElementById(id);
        var link = linkForHash(stops[i]);
        if (section && link && section.getBoundingClientRect().top < window.innerHeight * 0.45) {
          return link;
        }
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
        var hash = lockedLink.getAttribute("href") || "";
        var id = hash.indexOf("#") >= 0 ? hash.slice(hash.indexOf("#") + 1) : "";
        var target = id && id !== "top" ? document.getElementById(id) : null;
        var targetY = target ? window.scrollY + target.getBoundingClientRect().top : 0;
        var goingDown = targetY >= lockScroll;
        var reversed = goingDown
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

  /* --- Replay a short thumbnail after it finishes ----------------------- */

  // Native `loop` restarts immediately. A delay keeps a short clip from
  // repeating without a breath: the last frame holds, then playback starts over.
  document.querySelectorAll("video[data-replay-delay]").forEach(function (video) {
    var delay = Number(video.getAttribute("data-replay-delay")) * 1000;
    if (!delay) return;

    video.addEventListener("ended", function () {
      window.setTimeout(function () {
        if (!video.hasAttribute("data-inview")) return;
        video.currentTime = 0;
        var play = video.play();
        if (play && typeof play.catch === "function") play.catch(function () {});
      }, delay);
    });
  });

  /* --- Play a thumbnail only while its tile is near the screen --------- */

  var thumbs = document.querySelectorAll(".study__visual video");

  var armThumb = function (video) {
    var pending = video.getAttribute("data-src");
    if (!pending || video.getAttribute("src")) return;
    video.preload = "auto";
    video.src = pending;
    video.removeAttribute("data-src");
  };

  var playThumb = function (video) {
    armThumb(video);
    var play = video.play();
    if (play && typeof play.catch === "function") play.catch(function () {});
  };

  if (thumbs.length && "IntersectionObserver" in window) {
    // Half a screen ahead, so a fast connection has the next tile playing
    // by the time it arrives. Anything further down stays unloaded.
    var watch = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          if (entry.isIntersecting) {
            video.setAttribute("data-inview", "");
            playThumb(video);
          } else {
            video.removeAttribute("data-inview");
            video.pause();
          }
        });
      },
      { rootMargin: "50% 0px" }
    );

    thumbs.forEach(function (video) {
      watch.observe(video);
    });
  } else {
    thumbs.forEach(playThumb);
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
