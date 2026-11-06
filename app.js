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

  /* ---------- RESULTS (one step at a time + emotional support) ---------- */

  // Gentle affirmations shown under each "right now" action (deterministic by index).
  var AFFIRMATIONS = [
    "Breathe. You're already doing the right thing. 💛",
    "One thing at a time. You've got this.",
    "This isn't your fault. Keep going.",
    "You're being brave right now. Nearly there.",
    "Take your time. There's no rush."
  ];

  var resState = null; // { route, phase: 'add'|'next', i }

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

  function supportBar() {
    return '<div class="support-bar"><span>💛</span><span><b>Feeling overwhelmed right now?</b> You can talk to someone any time — ' +
      'Samaritans of Singapore (SOS): call <b>1767</b> or text <b>9151 1767</b>, 24 hours. You don\'t have to be in crisis to call.</span></div>';
  }

  function headBlock(route) {
    return '<div class="res-head"><span class="what">' + escapeHtml(route.harm.label) + "</span>" +
      "<h2>" + escapeHtml(route.headline) + "</h2></div>" +
      '<div class="reassure-line">' + withVerify(route.banner.text) +
      "</div>";
  }

  function renderResults(route) {
    resState = { route: route, phase: "add", i: 0 };
    drawResults();
  }

  function drawResults() {
    if (resState.phase === "add") drawAdd();
    else drawNext();
    window.scrollTo(0, 0);
  }

  // PHASE 1 — urgent "protect now" actions, one per screen, no wall of text.
  function drawAdd() {
    var route = resState.route, add = route.add, i = resState.i, total = add.length;

    var pips = "";
    for (var k = 0; k < total; k++) {
      pips += '<div class="pip' + (k < i ? " done" : k === i ? " cur" : "") + '"></div>';
    }

    var isLast = i === total - 1;
    var nextLabel = isLast ? "I've done this — what's next →" : "Done — next step ✓";

    document.getElementById("results").innerHTML =
      headBlock(route) +
      '<div class="now-kicker">Right now · step ' + (i + 1) + " of " + total + "</div>" +
      '<div class="step-progress">' + pips + "</div>" +
      '<div class="step-big"><span class="num">' + (i + 1) + "</span>" +
      '<p class="txt">' + withVerify(add[i]) + "</p>" +
      '<p class="affirm">' + AFFIRMATIONS[i % AFFIRMATIONS.length] + "</p></div>" +
      '<div class="btns-row">' +
      (i > 0 ? '<button class="btn ghost" onclick="NextStep._addBack()">← Back</button>' : "") +
      '<button class="btn primary" onclick="NextStep._addNext()">' + nextLabel + "</button></div>" +
      '<button class="seeall" onclick="NextStep._seeAll()">Show me everything at once instead</button>' +
      supportBar();
  }

  function addNext() {
    if (resState.i < resState.route.add.length - 1) { resState.i++; drawAdd(); window.scrollTo(0, 0); }
    else { resState.phase = "next"; drawResults(); }
  }
  function addBack() {
    if (resState.i > 0) { resState.i--; drawAdd(); window.scrollTo(0, 0); }
  }
  function seeAll() { resState.phase = "next"; resState.showAllAdd = true; drawResults(); }

  // PHASE 2 — calmer "next" screen: what you did, get a human, report when ready.
  function drawNext() {
    var route = resState.route, a = route.answers;

    var recap =
      '<div class="recap"><div class="rc-h">✓ You\'ve protected yourself</div><ul>' +
      route.add.map(function (t) { return "<li>" + withVerify(t) + "</li>"; }).join("") +
      "</ul></div>";

    var trustedBtn = route.showTrustedAdult
      ? '<button class="btn primary" style="margin-top:4px" onclick="NextStep.tellAdult()">📨 Send to a trusted adult</button>'
      : "";

    var tellCard =
      '<div class="card tell"><div class="label"><span class="tag">Tell</span> Get a human on your side</div>' +
      '<div class="sub">The most important step. You should not do this alone.</div>' +
      stepsUL(route.tell) + trustedBtn +
      '<div class="support">' +
      route.support.lines.map(function (l) { return withVerify(l); }).join("<br>") + "</div></div>";

    var checkCard =
      '<div class="card check"><div class="label"><span class="tag">Check</span> Report it — when you\'re ready</div>' +
      '<div class="sub">No rush. You can do this later today. Confirm each link before relying on it.</div>' +
      "<details" + '><summary style="cursor:pointer;font-weight:700;color:#1D3A8F;padding:6px 0;">Show the report steps</summary>' +
      stepsOL(route.check) + "</details></div>";

    var why =
      '<details class="why"><summary>Why this route?</summary>' +
      '<div class="rule">The engine matched your answers against the rule table — no AI decided this, and nothing was sent anywhere:<br><br>' +
      "What: <code>" + escapeHtml(a.harm) + "</code><br>" +
      "Danger now: <code>" + escapeHtml(a.danger_now) + "</code><br>" +
      "Under 18: <code>" + escapeHtml(a.under18) + "</code><br>" +
      "Platform: <code>" + escapeHtml(a.platform) + "</code><br><br>" +
      "Matched rule: <code>" + escapeHtml(route.ruleId) + "</code>" +
      "</div></details>";

    document.getElementById("results").innerHTML =
      headBlock(route) +
      '<div class="reassure-line" style="background:#EDF2FC;border-color:rgba(67,114,214,.4)"><b>That was the hard part — well done.</b> Now the key step: get a real person beside you.</div>' +
      recap + tellCard + checkCard + supportBar() + why;
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
    _addNext: addNext, _addBack: addBack, _seeAll: seeAll, // one-step results
    computeRoute: computeRoute // exposed for rules.html / tests
  };

  // Preload the rule table so the first tap is instant.
  load();
})();
