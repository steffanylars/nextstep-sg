/* NextStep SG, deterministic route engine.
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
    voice: document.getElementById("screen-voice"),
    results: document.getElementById("screen-results")
  };
  var voiceNote = null;      // optional free-text addendum (the user's own words)
  var recog = null, recording = false;
  var stepBase = 0;          // index of the first question the user actually answers (0 normally, 1 when harm is preset)

  function show(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle("active", k === name);
    });
    window.scrollTo(0, 0);
  }

  // Escape, turn [VERIFY LINK] into a badge, and make real URLs clickable.
  function withVerify(text) {
    var html = escapeHtml(text);
    html = html.replace(/\[VERIFY LINK\]/g, '<span class="verify">VERIFY LINK</span>');
    html = html.replace(/(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener" style="color:var(--teal);font-weight:700;word-break:break-all;">$1</a>');
    return html;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- i18n ---------- */
  var I18N = window.NEXTSTEP_I18N || { en: { ui: {}, note: "" } };
  var RULES_EN = null;
  var LANG = (function () { try { return localStorage.getItem("nextstep_lang") || "en"; } catch (e) { return "en"; } })();
  if (!I18N[LANG]) LANG = "en";

  function byId(id) { return document.getElementById(id); }
  function ui(k) {
    var u = (I18N[LANG] && I18N[LANG].ui) || {};
    if (u[k] !== undefined) return u[k];
    return (I18N.en.ui[k] !== undefined) ? I18N.en.ui[k] : k;
  }
  function getRules() {
    if (LANG === "en" || !I18N[LANG] || !I18N[LANG].content) return RULES_EN;
    var c = I18N[LANG].content;
    return Object.assign({}, RULES_EN, {
      questions: c.questions || RULES_EN.questions,
      harms: c.harms || RULES_EN.harms,
      platforms: c.platforms || RULES_EN.platforms,
      support: c.support || RULES_EN.support,
      modifiers: c.modifiers || RULES_EN.modifiers,
      trusted_adult_message: c.trusted_adult_message || RULES_EN.trusted_adult_message
    });
  }
  function applyStaticUi() {
    document.documentElement.lang = LANG;
    var set = function (id, v, html) { var e = byId(id); if (e) { if (html) e.innerHTML = v; else e.textContent = v; } };
    set("t-h1", ui("home_h1"));
    set("t-lede", ui("home_lede"));
    set("t-reassure", ui("home_reassure"), true);
    set("t-start", ui("start"));
    set("t-mini", ui("mini"), true);
    set("t-startover", ui("start_over"));
    set("backBtn", ui("back"));
    var vl = byId("voice-label"); if (vl) vl.textContent = ui("voice_label");
    var tagged = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < tagged.length; i++) tagged[i].textContent = ui(tagged[i].getAttribute("data-i18n"));
    var upd = byId("alerts-upd"); if (upd && window.NEXTSTEP_ALERTS) upd.textContent = window.NEXTSTEP_ALERTS.updated;
    var ha = byId("home-alerts");
    if (ha && window.renderAlertCards) window.renderAlertCards(ha, { max: 6, btnHref: "#", btnOnclick: "NextStep.startWith('scam');return false;", btnLabel: ui("alerts_btn") });
    var note = byId("langNote");
    if (note) { var n = (I18N[LANG] && I18N[LANG].note) || ""; note.textContent = n; note.style.display = n ? "block" : "none"; }
    var lb = byId("langbar");
    if (lb) { var bs = lb.querySelectorAll("button"); for (var j = 0; j < bs.length; j++) bs[j].classList.toggle("active", bs[j].getAttribute("data-lang") === LANG); }
  }
  function setLang(lang) {
    if (!I18N[lang]) lang = "en";
    LANG = lang;
    try { localStorage.setItem("nextstep_lang", lang); } catch (e) {}
    RULES = getRules();
    applyStaticUi();
    if (screens.flow.classList.contains("active") && RULES) renderQuestion();
    if (screens.results.classList.contains("active") && resState) { resState.route = computeRoute(answers); drawResults(); }
  }

  function load() {
    return fetch("routes.json")
      .then(function (r) { return r.json(); })
      .then(function (data) { RULES_EN = data; RULES = getRules(); })
      .catch(function () {
        alert("Could not load routes.json. If you opened the file directly, run a local server (see README).");
      });
  }

  /* ---------- FLOW ---------- */

  function start() {
    if (!RULES) { load().then(start); return; }
    answers = {};
    step = 0;
    stepBase = 0;
    voiceNote = null;
    startTime = Date.now();
    show("flow");
    renderQuestion();
  }

  function renderQuestion() {
    var q = RULES.questions[step];
    var total = RULES.questions.length - stepBase; // only the questions the user answers
    var shown = step - stepBase;                   // 0-based position among those

    document.getElementById("qKicker").textContent = ui("step_of").replace("%1", shown + 1).replace("%2", total);
    document.getElementById("qTitle").textContent = q.title;
    document.getElementById("backBtn").classList.toggle("show", step > stepBase);

    var stepper = document.getElementById("stepper");
    stepper.innerHTML = "";
    for (var i = 0; i < total; i++) {
      var pip = document.createElement("div");
      pip.className = "pip" + (i < shown ? " done" : i === shown ? " cur" : "");
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
      showVoiceAddendum(); // optional screen before the (unchanged) result
    }
  }

  function back() {
    if (screens.voice.classList.contains("active")) { show("flow"); renderQuestion(); return; }
    if (step > stepBase) { step--; renderQuestion(); }
    else { show("home"); }
  }

  /* ---------- Optional voice addendum (purely additive; never changes the route) ---------- */
  function speechApi() { return window.SpeechRecognition || window.webkitSpeechRecognition; }
  function setMic(on) {
    var mic = byId("vaMic"); if (mic) mic.classList.toggle("rec", on);
    var lab = byId("vaMicLabel"); if (lab) lab.textContent = on ? "Stop" : "Speak";
  }
  function showVoiceAddendum() {
    voiceNote = null;
    if (!speechApi()) { finish(); return; } // fail silent: no support -> straight to result
    var t = byId("vaText"); if (t) t.value = "";
    setMic(false);
    show("voice");
  }
  function vaMic() {
    var SR = speechApi(); if (!SR) return;
    var t = byId("vaText");
    if (recording) { try { recog.stop(); } catch (e) {} return; }
    recog = new SR();
    recog.lang = LANG === "zh" ? "zh-CN" : LANG === "ms" ? "ms-MY" : "en-SG";
    recog.interimResults = true; recog.continuous = true;
    var base = t.value ? t.value.trim() + " " : "";
    recog.onresult = function (e) {
      var txt = ""; for (var i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
      t.value = base + txt;
    };
    recog.onend = function () { recording = false; setMic(false); };
    recog.onerror = function () { recording = false; setMic(false); };
    recording = true; setMic(true);
    try { recog.start(); } catch (e) { recording = false; setMic(false); }
  }
  function vaDone() {
    if (recording) { try { recog.stop(); } catch (e) {} }
    var v = (byId("vaText") && byId("vaText").value || "").trim();
    voiceNote = v || null;
    finish();
  }
  function vaSkip() {
    if (recording) { try { recog.stop(); } catch (e) {} }
    voiceNote = null;
    finish();
  }

  function restart() { show("home"); }

  // Jump straight into a known route (e.g. from a scam alert card).
  function startWith(harm) {
    if (!RULES) { load().then(function () { setLang(LANG); startWith(harm); }); return; }
    if (!RULES.harms[harm]) { start(); return; }
    answers = { harm: harm };
    step = 1; // Q1 (harm) is already answered.
    stepBase = 1; // so the stepper counts from "Step 1" of the remaining questions
    voiceNote = null;
    startTime = Date.now();
    show("flow");
    renderQuestion();
  }

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
  var AFFS = {
    en: ["Breathe. You're already doing the right thing.", "One thing at a time. You've got this.",
      "This isn't your fault. Keep going.", "You're being brave right now. Nearly there.", "Take your time. There's no rush."],
    zh: ["深呼吸。你已经在做对的事了。", "一次做一件事。你可以的。", "这不是你的错。继续。", "你现在很勇敢，快好了。", "慢慢来，不用急。"],
    ms: ["Tarik nafas. Awak dah buat perkara betul.", "Satu demi satu. Awak boleh.", "Ini bukan salah awak. Teruskan.", "Awak sangat berani sekarang. Hampir siap.", "Ambil masa awak. Tak perlu tergesa."]
  };
  function affirms() { return AFFS[LANG] || AFFS.en; }

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
    return '<div class="support-bar"><svg class="ic" viewBox="0 0 24 24" style="flex:none;margin-top:1px"><path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z"/></svg><span>' + ui("support_bar") + "</span></div>";
  }

  function headBlock(route) {
    return '<div class="res-head"><span class="what">' + escapeHtml(route.harm.label) + "</span>" +
      "<h2>" + escapeHtml(route.headline) + "</h2></div>" +
      '<div class="reassure-line">' + withVerify(route.banner.text) + "</div>" +
      (route.answers.harm === "scam"
        ? '<button class="listen-btn" onclick="NextStep.listenScam()"><svg class="ic" viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg> ' + ui("listen") + "</button>"
        : "") +
      (voiceNote
        ? '<div class="added-note"><b>Based on what you added:</b> ' + escapeHtml(voiceNote) + "</div>"
        : "");
  }

  // Play pre-generated MP3s in sequence (static files in /audio; silent if missing).
  var clipAudios = [];
  function stopAudio() {
    clipAudios.forEach(function (a) { try { a.pause(); a.currentTime = 0; } catch (e) {} });
    clipAudios = [];
  }
  function playSeq(names) {
    stopAudio();
    var i = 0;
    function next() {
      if (i >= names.length) return;
      var a = new Audio("audio/" + names[i] + ".mp3");
      clipAudios.push(a);
      i++;
      a.onended = next; a.onerror = next;
      a.play().catch(function () { next(); });
    }
    next();
  }
  function listenScam() { playSeq(["step-bank", "step-police", "step-scamshield", "step-warn"]); }

  function renderResults(route) {
    resState = { route: route, phase: "add", i: 0 };
    drawResults();
  }

  function drawResults() {
    if (resState.phase === "add") drawAdd();
    else drawNext();
    window.scrollTo(0, 0);
  }

  // PHASE 1, urgent "protect now" actions, one per screen, no wall of text.
  function drawAdd() {
    var route = resState.route, add = route.add, i = resState.i, total = add.length;

    var pips = "";
    for (var k = 0; k < total; k++) {
      pips += '<div class="pip' + (k < i ? " done" : k === i ? " cur" : "") + '"></div>';
    }

    var isLast = i === total - 1;
    var nextLabel = isLast ? ui("done_last") : ui("done_next");
    var aff = affirms();

    document.getElementById("results").innerHTML =
      headBlock(route) +
      '<div class="now-kicker">' + ui("now_kicker").replace("%1", i + 1).replace("%2", total) + "</div>" +
      '<div class="step-progress">' + pips + "</div>" +
      '<div class="step-big"><span class="num">' + (i + 1) + "</span>" +
      '<p class="txt">' + withVerify(add[i]) + "</p>" +
      '<p class="affirm">' + aff[i % aff.length] + "</p></div>" +
      '<div class="btns-row">' +
      (i > 0 ? '<button class="btn ghost" onclick="NextStep._addBack()">' + ui("back") + "</button>" : "") +
      '<button class="btn primary" onclick="NextStep._addNext()">' + nextLabel + "</button></div>" +
      '<button class="seeall" onclick="NextStep._seeAll()">' + ui("see_all") + "</button>" +
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

  // PHASE 2, calmer "next" screen: what you did, get a human, report when ready.
  function drawNext() {
    var route = resState.route, a = route.answers;

    var recap =
      '<div class="recap"><div class="rc-h">' + ui("protected") + "</div><ul>" +
      route.add.map(function (t) { return "<li>" + withVerify(t) + "</li>"; }).join("") +
      "</ul></div>";

    var trustedBtn = route.showTrustedAdult
      ? '<button class="btn primary" style="margin-top:4px" onclick="NextStep.tellAdult()"><svg class="ic" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> ' + ui("tell_btn") + "</button>"
      : "";

    var tellCard =
      '<div class="card tell"><div class="label"><span class="tag">Tell</span> ' + ui("label_tell") + "</div>" +
      '<div class="sub">' + ui("sub_tell") + "</div>" +
      stepsUL(route.tell) + trustedBtn +
      '<div class="support">' +
      route.support.lines.map(function (l) { return withVerify(l); }).join("<br>") + "</div></div>";

    var checkCard =
      '<div class="card check"><div class="label"><span class="tag">Check</span> ' + ui("label_check") + "</div>" +
      '<div class="sub">' + ui("sub_check") + "</div>" +
      '<details><summary style="cursor:pointer;font-weight:700;color:#1D3A8F;padding:6px 0;">' + ui("show_report") + "</summary>" +
      stepsOL(route.check) + "</details></div>";

    var why =
      '<details class="why"><summary>' + ui("why") + "</summary>" +
      '<div class="rule">' + ui("why_intro") + "<br><br>" +
      ui("why_what") + ": <code>" + escapeHtml(a.harm) + "</code><br>" +
      ui("why_danger") + ": <code>" + escapeHtml(a.danger_now) + "</code><br>" +
      ui("why_under18") + ": <code>" + escapeHtml(a.under18) + "</code><br>" +
      ui("why_platform") + ": <code>" + escapeHtml(a.platform) + "</code><br><br>" +
      ui("why_matched") + ": <code>" + escapeHtml(route.ruleId) + "</code>" +
      "</div></details>";

    document.getElementById("results").innerHTML =
      headBlock(route) +
      '<div class="reassure-line" style="background:#EDF2FC;border-color:rgba(67,114,214,.4)">' + ui("hardpart") + "</div>" +
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
    start: start, startWith: startWith, back: back, restart: restart, tellAdult: tellAdult,
    setLang: setLang, listenScam: listenScam, stopAudio: stopAudio,
    vaMic: vaMic, vaDone: vaDone, vaSkip: vaSkip,
    _addNext: addNext, _addBack: addBack, _seeAll: seeAll, // one-step results
    computeRoute: computeRoute // exposed for rules.html / tests
  };

  // Wire the language switcher.
  var langbar = document.getElementById("langbar");
  if (langbar) {
    langbar.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("button[data-lang]") : null;
      if (b) setLang(b.getAttribute("data-lang"));
    });
  }

  // Preload the rule table, then apply the saved/default language.
  load().then(function () {
    setLang(LANG);
    try {
      var s = new URLSearchParams(location.search).get("start");
      if (s && RULES && RULES.harms[s]) startWith(s);
    } catch (e) {}
  });
})();
