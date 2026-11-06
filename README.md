# NextStep SG

**What it is:** a calm, mobile-first static site that tells a Singapore youth (13–19) exactly what to do in the first 10 minutes after online harm — intimate-image threats, doxxing, harassment, or impersonation. It does **not** detect harm; it guides the victim afterwards.
**IMDA actions:** maps to **"Report Inappropriate Content"** + **"Engage & Support"**, structured with the **Add / Check / Tell** framework.
**How routing works:** four tap questions (harm → danger now → under 18 → platform) look up a **deterministic rule table** in [`routes.json`](routes.json) — no AI decides the advice. The optional ElevenLabs voice agent only **converses** and reads back the *same* table; a human (trusted adult) is always the final step.
**Transparency:** every result shows a **"Why this route?"** trace of the exact rule matched, and [`/rules`](rules.html) renders the whole table. Every external link is a `[VERIFY LINK]` placeholder — no URLs are invented.
**Play & win:** [`/quiz`](quiz.html) has two quizzes (spot the real `.gov.sg` site vs look-alikes, and this month's scams from SPF advisories). Acing both with a perfect score enters a raffle.

## Run locally
```bash
python3 -m http.server 8787
# open http://localhost:8787/index.html
```
No build, no backend, no API keys in the frontend. Loads in under 2s.

## Voice (ElevenLabs)
Paste your agent prompt from [`AGENT_PROMPT.md`](AGENT_PROMPT.md) into the ElevenLabs dashboard, then put the agent id in [`config.js`](config.js). The mic appears automatically. The agent id is a public client id (safe to commit); never commit an API key.

## Built today vs reused
**Reused from my earlier project (Zen — USAII Global AI Hackathon 2025), adapted:**
- **Design system / tokens** — colour palette (sand / teal / amber), Fraunces + Plus Jakarta Sans typography, card, button, pill, stepper and banner styles (adapted from Zen's `static/index.html`).
- **Architecture pattern** — "deterministic engine decides, LLM only converses, human-in-the-loop escalation."

**Built entirely during this hackathon (new today):**
- All routing logic and the rule table [`routes.json`](routes.json), the route engine [`app.js`](app.js), and every piece of Add/Check/Tell content.
- The tap flow, results screen, [`/rules`](rules.html) table, and the [`/quiz`](quiz.html) Play & win quizzes.
- The ElevenLabs voice agent prompt [`AGENT_PROMPT.md`](AGENT_PROMPT.md) and widget integration.

No benefits data, MILP model, or business logic from Zen was copied; only structure, styling, and the design pattern were adapted.

## License
MIT — see [LICENSE](LICENSE).
