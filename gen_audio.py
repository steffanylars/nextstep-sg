"""Pre-generate calm MP3s for NextStep with ElevenLabs. BUILD-TIME ONLY.

The API key is read from the environment or a local .env.local (which is
gitignored). The key is NEVER written to the frontend or committed; only the
resulting /audio/*.mp3 files are committed.

Usage:  python gen_audio.py
"""
import os
import pathlib
import sys


def load_env():
    for p in [pathlib.Path(".env.local"), pathlib.Path(__file__).resolve().parent / ".env.local"]:
        if p.exists():
            for line in p.read_text().splitlines():
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


load_env()
KEY = os.environ.get("ELEVENLABS_API_KEY")
if not KEY:
    print("NO_KEY: set ELEVENLABS_API_KEY (env or .env.local in this folder)")
    sys.exit(2)

try:
    from elevenlabs.client import ElevenLabs
except Exception as e:
    print("NO_SDK:", e)
    sys.exit(3)

VOICE = "21m00Tcm4TlvDq8ikWAM"
MODELS = ["eleven_v3", "eleven_multilingual_v2"]  # try v3, fall back if unavailable

CLIPS = {
    "step-bank": "First, call your bank right away. Ask them to block the transaction and freeze your card. Stopping the money comes first.",
    "step-police": "Next, lodge a police report. It creates the official record your bank and the authorities will need.",
    "step-scamshield": "Then call the Scam Shield helpline, one seven nine nine. They can check and report the scam, and help block the numbers.",
    "step-warn": "Finally, warn the real person, or your friend. Their account may be hijacked, and this stops others from being scammed.",
    "drill-intro": "You just got this message. Let's practise what to do next.",
    "drill-ready": "You're scam ready. You know the first move: protect the money, then report.",
}

client = ElevenLabs(api_key=KEY)
outdir = pathlib.Path("audio")
outdir.mkdir(exist_ok=True)

ok = 0
for name, text in CLIPS.items():
    done = False
    for m in MODELS:
        try:
            audio = client.text_to_speech.convert(
                voice_id=VOICE, model_id=m, text=text, output_format="mp3_44100_128")
            if isinstance(audio, (bytes, bytearray)):
                data = bytes(audio)
            else:
                data = b"".join(audio)
            (outdir / (name + ".mp3")).write_bytes(data)
            print("OK", name, "via", m, "(%d bytes)" % len(data))
            ok += 1
            done = True
            break
        except Exception as e:
            print("fail", name, m, str(e)[:140])
    if not done:
        print("GIVEUP", name)

print("DONE %d/%d clips" % (ok, len(CLIPS)))
