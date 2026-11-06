/* NextStep SG — deterministic route engine.
 * The engine decides the route from routes.json. No AI, no randomness.
 * AI (ElevenLabs voice) only converses and reads back THIS same table.
 */
(function () {
  "use strict";

  var RULES = null;        // loaded routes.json
  var step = 0;            // current question index
  var answers = {};        // { harm, danger_now, under18, platform }
  var startTime = null;    // for the "seconds to first route" measurement

  var screens = {
    home: document.getElementById("screen-home"),
    flow: document.getElementById("screen-flow"),
    results: document.getElementById("screen-results")
  };

  function show(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle("active", k === name);
    });
    window.scrollTo(0, 0);
  }

  // Turn "...text [VERIFY LINK]" into text + a styled badge (no invented URLs).
  function withVerify(text) {
    var html = escapeHtml(text);
    return html.replace(/\[VERIFY LINK\]/g, '<span class="verify">VERIFY LINK</span>');
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function load() {
    return fetch("routes.json")
      .then(function (r) { return r.json(); })
      .then(function (data) { RULES = data; })
      .catch(function () {
        alert("Could not load routes.json. If you opened the file directly, run a local server (see README).");
      });
  }

  /* ---------- FLOW ---------- */

  function start() {
    if (!RULES) { load().then(start); return; }
    answers = {};
    step = 0;
    startTime = Date.now();
    show("flow");
    renderQuestion();
  }

  function renderQuestion() {
    var q = RULES.questions[step];
    var total = RULES.questions.length;

    document.getElementById("qKicker").textContent = "Step " + (step + 1) + " of " + total;
    document.getElementById("qTitle").textContent = q.title;
    document.getElementById("backBtn").classList.toggle("show", step > 0);

    var stepper = document.getElementById("stepper");
    stepper.innerHTML = "";
    for (var i = 0; i < total; i++) {
      var pip = document.createElement("div");
      pip.className = "pip" + (i < step ? " done" : i === step ? " cur" : "");
      stepper.appendChild(pip);
    }

    var box = document.getElementById("options");
    box.innerHTML = "";
    q.options.forEach(function (opt) {
      var b = document.createElement("button");
      b.className = "opt" + (answers[q.id] === opt.value ? " sel" : "");
      b.innerHTML = "<span>" + escapeHtml(opt.label) + "</span><span class='chev'>›</span>";
      b.onclick = function () { choose(q.id, opt.value); };
      box.appendChild(b);
    });
  }

  function choose(id, value) {
    answers[id] = value;
    if (step < RULES.questions.length - 1) {
      step++;
      renderQuestion();
    } else {
      finish();
    }
  }

  function back() {
    if (step > 0) { step--; renderQuestion(); }
    else { show("home"); }
  }

  function restart() { show("home"); }

  /* ---------- ENGINE: answers -> route (pure lookup) ---------- */

  function computeRoute(a) {
    var harm = RULES.harms[a.harm];
    var platform = RULES.platforms[a.platform] || RULES.platforms.other;
    var dMod = RULES.modifiers[a.danger_now === "yes" ? "danger_now_yes" : "danger_now_no"];
    var uMod = RULES.modifiers[a.under18 === "yes" ? "under18_yes" : "under18_no"];

    // ADD: protect now (danger step first if applicable)
    var add = harm.add.slice();
    if (dMod.add_first) add.unshift(dMod.add_first);

    // CHECK: concrete platform report first, then official channels, then police if danger
    var check = [];
    check.push("On " + platform.label + ": " + platform.report);
    check = check.concat(harm.check.slice(1)); // drop the generic "report on the platform" line
    if (dMod.check_add) check.push(dMod.check_add);

    // TELL: age-appropriate first line, then harm-specific line
    var tell = [];
    if (uMod.tell_first) tell.push(uMod.tell_first);
    tell = tell.concat(harm.tell);

    var ruleId = [a.harm, "danger:" + a.danger_now, "under18:" + a.under18, a.platform].join(" | ");

    return {
      harm: harm,
      headline: harm.headline,
      banner: { kind: dMod.banner, text: dMod.banner_text },
      add: add,
      check: check,
      tell: tell,
      showTrustedAdult: !!uMod.show_trusted_adult_button,
      support: RULES.support,
      answers: a,
      ruleId: ruleId
    };
  }

  function finish() {
    var route = computeRoute(answers);
    recordTiming();
    renderResults(route);
    show("results");
  }

  /* ---------- RESULTS ---------- */

  function stepsOL(items) {
    return '<ol class="steps">' + items.map(function (t, i) {
      return '<li><span class="n">' + (i + 1) + '</span><span>' + withVerify(t) + '</span></li>';
    }).join("") + "</ol>";
  }
  function stepsUL(items) {
    return '<ul class="steps">' + items.map(function (t) {
      return "<li><span>" + withVerify(t) + "</span></li>";
    }).join("") + "</ul>";
  }

  function renderResults(route) {
    var el = document.getElementById("results");
    var a = route.answers;

    var supportHtml =
      '<div class="support"><b>' + escapeHtml(route.support.label) + "</b>" +
      route.support.lines.map(function (l) { return withVerify(l); }).join("<br>") +
      "</div>";

    var trustedBtn = route.showTrustedAdult
      ? '<button class="btn primary" style="margin-top:14px" onclick="NextStep.tellAdult()">📨 Send to a trusted adult</button>'
      : "";

    var why =
      '<details class="why"><summary>Why this route?</summary>' +
      '<div class="rule">The engine matched your answers against the rule table — no AI decided this:<br><br>' +
      "What: <code>" + escapeHtml(a.harm) + "</code><br>" +
      "Danger now: <code>" + escapeHtml(a.danger_now) + "</code><br>" +
      "Under 18: <code>" + escapeHtml(a.under18) + "</code><br>" +
      "Platform: <code>" + escapeHtml(a.platform) + "</code><br><br>" +
      "Matched rule: <code>" + escapeHtml(route.ruleId) + "</code>" +
      '</div></details>';

    el.innerHTML =
      '<div class="res-head"><span class="what">' + escapeHtml(route.harm.label) + "</span>" +
      "<h2>" + escapeHtml(route.headline) + "</h2></div>" +

      '<div class="banner ' + route.banner.kind + '">' + withVerify(route.banner.text) + "</div>" +

      '<div class="card add"><div class="label"><span class="tag">Add</span> Protect yourself now</div>' +
      '<div class="sub">Keep the evidence and lower the pressure.</div>' + stepsOL(route.add) + "</div>" +

      '<div class="card check"><div class="label"><span class="tag">Check</span> Report it the right way</div>' +
      '<div class="sub">Official channels. Confirm each link before you rely on it.</div>' + stepsOL(route.check) + "</div>" +

      '<div class="card tell"><div class="label"><span class="tag">Tell</span> Get a human on your side</div>' +
      '<div class="sub">You should not do this alone.</div>' + stepsUL(route.tell) + trustedBtn + supportHtml + "</div>" +

      why;
  }

  /* ---------- Trusted adult share (no image, neutral message) ---------- */

  function tellAdult() {
    var msg = RULES.trusted_adult_message;
    if (navigator.share) {
      navigator.share({ text: msg }).catch(function () {});
    } else {
      // Fallback: open SMS composer with a prefilled body.
      window.location.href = "sms:?&body=" + encodeURIComponent(msg);
    }
  }

  /* ---------- Measurement: seconds from start to first route ---------- */

  function recordTiming() {
    if (!startTime) return;
    var secs = Math.round((Date.now() - startTime) / 100) / 10;
    try {
      var arr = JSON.parse(localStorage.getItem("nextstep_timings") || "[]");
      arr.push(secs);
      localStorage.setItem("nextstep_timings", JSON.stringify(arr));
    } catch (e) {}
  }

  // Public API
  window.NextStep = {
    start: start, back: back, restart: restart, tellAdult: tellAdult,
    computeRoute: computeRoute // exposed for rules.html / tests
  };

  // Preload the rule table so the first tap is instant.
  load();
})();
