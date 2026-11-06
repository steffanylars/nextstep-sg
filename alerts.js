/* NextStep SG — Latest scam alerts.
 * SOURCE: official Singapore Police Force advisories only. Dates, titles, stats
 * and URLs are taken verbatim from SPF. Do not add items, numbers or dates that
 * are not from an SPF advisory. The one-line "what" is a plain-language summary
 * of the SPF title (no new facts).
 */
window.NEXTSTEP_ALERTS = {
  updated: "Updated 6 Nov 2026 from official Singapore Police Force advisories.",
  items: [
    {
      date: "29 Oct 2026",
      title: "Calls impersonating SIMBA staff, then transferred to fake police/MAS officers",
      what: "A “telco” caller claims a problem with your line, then hands you to fake officials.",
      stat: "At least 59 cases, $1.3M lost in October",
      url: "https://www.police.gov.sg/Media-Hub/News/2026/10/20261029_police_advisory_on_scams_involving_the_impersonation_of_simba_staff"
    },
    {
      date: "23 Oct 2026",
      title: "Fake Facebook ads with AI-generated police officers offering “scam recovery”",
      what: "Ads use AI “officers” to offer to recover money you lost — for a fee.",
      stat: "Police never advertise recovery services",
      url: "https://www.police.gov.sg/Media-Hub/News/2026/10/20261023_police_advisory_on_fake_advertisements_of_ai_generated_police_officer"
    },
    {
      date: "23 Oct 2026",
      title: "Fake buyers on Carousell sending phishing links",
      what: "A “buyer” sends a link to “confirm payment” that steals your bank login.",
      stat: "At least 63 cases, $180,000 since July",
      url: "https://www.police.gov.sg/Media-Hub/News/2026/10/20261023_police_advisory_on_phishing_scams_involving_fake_buyers_on_online_marketplace"
    },
    {
      date: "21 Oct 2026",
      title: "Hijacked WhatsApp accounts of friends asking for loans",
      what: "A friend’s account is taken over and messages you to borrow money.",
      stat: "At least 128 cases, $249,000 since September",
      url: "https://www.police.gov.sg/Media-Hub/News/2026/10/20261021_police_advisory_on_social_media_impersonation_scams"
    },
    {
      date: "18 Oct 2026",
      title: "Facebook ads impersonating famous investors, then WhatsApp “gurus”",
      what: "Investment ads pose as well-known investors, then move you to WhatsApp.",
      stat: "",
      url: "https://www.police.gov.sg/Media-Hub/News/2026/10/20261018_police_advisory_on_investment_scams_involving_impersonation_of_popular_investors"
    },
    {
      date: "02 Oct 2026",
      title: "Cheap-product ads on Facebook, Instagram, TikTok leading to phishing sites",
      what: "Too-cheap deals lead to fake sites that steal card or bank details.",
      stat: "At least 246 cases, $1.4M since July",
      url: "https://www.police.gov.sg/Media-Hub/News/2026/10/20261002_police_advisory_on_phishing_scams_involving_fraudulent_social_media_advertisements"
    }
  ]
};

/* Shared renderer used by the home page and alerts.html.
 * opts: { max, btnHref, btnOnclick, btnLabel } */
window.renderAlertCards = function (el, opts) {
  if (!el) return;
  opts = opts || {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var items = window.NEXTSTEP_ALERTS.items.slice(0, opts.max || 99);
  var label = opts.btnLabel || "If it happened to you →";
  el.innerHTML = items.map(function (a) {
    return '<div class="alert-card">' +
      '<div class="a-date">' + esc(a.date) + "</div>" +
      '<div class="a-title">' + esc(a.title) + "</div>" +
      '<div class="a-what">' + esc(a.what) + "</div>" +
      (a.stat ? '<div class="a-stat">' + esc(a.stat) + "</div>" : "") +
      '<div class="a-actions">' +
        '<a class="a-btn" href="' + (opts.btnHref || "#") + '"' +
          (opts.btnOnclick ? ' onclick="' + opts.btnOnclick + '"' : "") + ">" + esc(label) + "</a>" +
        '<a class="a-src" href="' + esc(a.url) + '" target="_blank" rel="noopener">Source: SPF ↗</a>' +
      "</div></div>";
  }).join("");
};
