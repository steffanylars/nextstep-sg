"""Create the NextStep ElevenLabs Conversational AI agent. BUILD-TIME ONLY.
Prints the agent_id (a public client id). The API key stays in .env.local.
"""
import os
import pathlib
import re
import sys


def load_env():
    p = pathlib.Path(".env.local")
    if p.exists():
        for line in p.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


load_env()
KEY = os.environ.get("ELEVENLABS_API_KEY")
if not KEY:
    print("NO_KEY"); sys.exit(2)

# Pull the system prompt out of AGENT_PROMPT.md (the block after "## SYSTEM PROMPT").
md = pathlib.Path("AGENT_PROMPT.md").read_text()
after = md.split("## SYSTEM PROMPT", 1)[1]
m = re.search(r"```(.*?)```", after, re.S)
SYSTEM_PROMPT = m.group(1).strip()
FIRST = "Hi. You're not in trouble. Tell me what happened, and we'll do the next step together."
print("prompt chars:", len(SYSTEM_PROMPT))

from elevenlabs.client import ElevenLabs
client = ElevenLabs(api_key=KEY)

conversation_config = {
    "agent": {
        "prompt": {"prompt": SYSTEM_PROMPT},
        "first_message": FIRST,
        "language": "en",
    }
}

tiers = [
    {"auth": {"enable_auth": False, "allowlist": [{"hostname": "steffanylars.github.io"}]}},
    {"auth": {"enable_auth": False}},
    None,
]

for i, ps in enumerate(tiers):
    try:
        kwargs = {"conversation_config": conversation_config, "name": "NextStep SG"}
        if ps is not None:
            kwargs["platform_settings"] = ps
        res = client.conversational_ai.agents.create(**kwargs)
        aid = getattr(res, "agent_id", None) or (res.get("agent_id") if isinstance(res, dict) else None)
        print("AGENT_ID:", aid, "(tier", i, ")")
        sys.exit(0)
    except Exception as e:
        print("tier", i, "failed:", str(e)[:200])

print("ALL_TIERS_FAILED")
sys.exit(1)
