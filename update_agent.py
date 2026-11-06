"""Update the live NextStep ElevenLabs agent with the scam-first prompt.
Reads the API key from .env.local and the agent id from config.js. BUILD-TIME ONLY.
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

AGENT_ID = re.search(r'ELEVENLABS_AGENT_ID:\s*"([^"]+)"', pathlib.Path("config.js").read_text()).group(1)
md = pathlib.Path("AGENT_PROMPT.md").read_text()
SYSTEM_PROMPT = re.search(r"```(.*?)```", md.split("## SYSTEM PROMPT", 1)[1], re.S).group(1).strip()
FIRST = re.search(r"```(.*?)```", md.split("## FIRST MESSAGE", 1)[1], re.S).group(1).strip()
print("agent:", AGENT_ID, "| prompt chars:", len(SYSTEM_PROMPT))

from elevenlabs.client import ElevenLabs
client = ElevenLabs(api_key=KEY)

conversation_config = {
    "agent": {
        "prompt": {"prompt": SYSTEM_PROMPT},
        "first_message": FIRST,
        "language": "en",
    }
}

try:
    client.conversational_ai.agents.update(agent_id=AGENT_ID, conversation_config=conversation_config)
    print("UPDATED", AGENT_ID)
except Exception as e:
    print("FAILED:", str(e)[:200]); sys.exit(1)
