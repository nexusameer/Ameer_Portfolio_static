/* Control Plane — portfolio behaviour (vanilla JS) */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- theme toggle (remembered) ---- */
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");
  function stored() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem("theme", v); } catch (e) {} }
  var saved = stored();
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  if (toggle) {
    toggle.addEventListener("click", function () {
      var sysLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      var current = root.getAttribute("data-theme") || (sysLight ? "light" : "dark");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      save(next);
    });
  }

  /* ---- mobile nav ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---- count-up stats ---- */
  function countUp(el) {
    var valEl = el.querySelector(".val") || el;
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
    if (reduced) { valEl.textContent = target.toFixed(decimals); return; }
    var dur = 1100, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      valEl.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else valEl.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll(".num[data-count]");
  if (nums.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      nums.forEach(countUp);
    } else {
      var no = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { countUp(en.target); no.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      nums.forEach(function (el) { no.observe(el); });
    }
  }

  /* ---- copy email ---- */
  var copyBtn = document.querySelector(".copy-btn");
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(copyBtn.getAttribute("data-email")).then(function () {
        copyBtn.classList.add("copied");
        setTimeout(function () { copyBtn.classList.remove("copied"); }, 1600);
      });
    });
  }

  /* ---- hero terminal typewriter (runs once) ---- */
  var term = document.querySelector(".terminal-body");
  if (term) {
    var lines = [
      { t: "$ terraform apply", c: "cmd" },
      { t: "✓ 25 accounts in sync", c: "ok" },
      { t: "$ deploy --env prod", c: "cmd" },
      { t: "✓ snyk: passed", c: "ok" },
      { t: "✓ ecs: service stable", c: "ok" }
    ];
    if (reduced) {
      term.innerHTML = lines.map(function (l) {
        var cls = l.c === "cmd" ? "prompt" : "ok";
        return '<div class="term-line"><span class="' + cls + '">' + l.t + "</span></div>";
      }).join("");
    } else {
      var li = 0;
      function typeLine() {
        if (li >= lines.length) return;
        var l = lines[li];
        var row = document.createElement("div");
        row.className = "term-line";
        var span = document.createElement("span");
        span.className = l.c === "cmd" ? "prompt" : "ok";
        row.appendChild(span);
        var cur = document.createElement("span");
        cur.className = "cursor";
        row.appendChild(cur);
        term.appendChild(row);
        var i = 0;
        var speed = l.c === "cmd" ? 42 : 20;
        (function tick() {
          if (i <= l.t.length) {
            span.textContent = l.t.slice(0, i);
            i++;
            setTimeout(tick, speed);
          } else {
            if (l.c === "cmd") row.removeChild(cur);
            li++;
            setTimeout(typeLine, l.c === "cmd" ? 260 : 420);
          }
        })();
      }
      setTimeout(typeLine, 500);
    }
  }

  /* ---- stack rail: highlight projects that use a tool ---- */
  var toolRows = document.querySelectorAll(".tool-row");
  if (toolRows.length) {
    var projects = document.querySelectorAll(".project[data-project]");
    var pinned = null;

    function clearHighlight() {
      projects.forEach(function (p) {
        p.classList.remove("hl", "dimmed");
        var chip = p.querySelector(".uses-chip");
        if (chip) { chip.hidden = true; chip.textContent = ""; }
      });
      toolRows.forEach(function (r) { r.classList.remove("active"); });
    }

    function activate(row) {
      clearHighlight();
      row.classList.add("active");
      var ids = (row.getAttribute("data-projects") || "").split(/\s+/).filter(Boolean);
      if (!ids.length) return; // no project match — just highlight the row itself
      var tool = row.getAttribute("data-tool") || "";
      projects.forEach(function (p) {
        if (ids.indexOf(p.getAttribute("data-project")) !== -1) {
          p.classList.add("hl");
          var chip = p.querySelector(".uses-chip");
          if (chip) { chip.textContent = "uses " + tool; chip.hidden = false; }
        } else {
          p.classList.add("dimmed");
        }
      });
    }

    toolRows.forEach(function (row) {
      row.addEventListener("mouseenter", function () { if (!pinned) activate(row); });
      row.addEventListener("mouseleave", function () { if (!pinned) clearHighlight(); });
      row.addEventListener("focus", function () { if (!pinned) activate(row); });
      row.addEventListener("blur", function () { if (!pinned) clearHighlight(); });
      row.addEventListener("click", function () {
        if (pinned === row) { pinned = null; clearHighlight(); }
        else { pinned = row; activate(row); }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && pinned) { pinned = null; clearHighlight(); }
    });
  }
})();
