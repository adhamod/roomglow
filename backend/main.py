import base64
import io
import json
import os
import time
from typing import Any

import requests as http_requests
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Interior Design Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_api_key = os.getenv("OPENAI_API_KEY")
_hf_token = os.getenv("HF_TOKEN")
client = OpenAI(api_key=_api_key or "sk-placeholder")  # Only used after _ensure_api_key() validates

BARK_API_URL = "https://api-inference.huggingface.co/models/suno/bark"


def _ensure_api_key():
    if not _api_key or _api_key == "not-set":
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY is not configured. Add it to backend/.env and restart the server.",
        )


def _ensure_hf_token():
    if not _hf_token:
        raise HTTPException(
            status_code=503,
            detail="HF_TOKEN is not configured. Add your HuggingFace token to backend/.env and restart.",
        )


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "openai_configured": bool(_api_key and _api_key != "not-set" and _api_key.startswith("sk-")),
    }

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

SYSTEM_PROMPT = """You are an elite interior design consultant. The user will show you a photo of a room.
Analyze it carefully and return ONLY valid JSON (no markdown, no code fences) with this exact structure:

{
  "overall_impression": "A 2-3 sentence summary of the space — what works, what the vibe is, and the single biggest opportunity for improvement.",
  "categories": [
    {
      "name": "Color Palette",
      "icon": "palette",
      "tips": ["tip 1", "tip 2", "tip 3"],
      "product": {
        "name": "A specific purchasable product relevant to color palette (e.g. 'Sage green throw pillow set')",
        "why": "1 sentence on why this product helps this room's color palette specifically.",
        "search_query": "short Google Shopping search phrase (e.g. 'sage green throw pillow set')"
      }
    },
    {
      "name": "Furniture & Layout",
      "icon": "sofa",
      "tips": ["tip 1", "tip 2", "tip 3"],
      "product": {
        "name": "A specific purchasable furniture or layout product",
        "why": "1 sentence on why this helps the furniture or layout.",
        "search_query": "short Google Shopping search phrase"
      }
    },
    {
      "name": "Lighting",
      "icon": "lightbulb",
      "tips": ["tip 1", "tip 2", "tip 3"],
      "product": {
        "name": "A specific purchasable lighting product",
        "why": "1 sentence on why this improves the lighting.",
        "search_query": "short Google Shopping search phrase"
      }
    },
    {
      "name": "Decor & Accessories",
      "icon": "sparkles",
      "tips": ["tip 1", "tip 2", "tip 3"],
      "product": {
        "name": "A specific purchasable decor or accessory item",
        "why": "1 sentence on why this enhances the decor.",
        "search_query": "short Google Shopping search phrase"
      }
    }
  ]
}

Rules:
- Reference SPECIFIC things you see in the photo (e.g. "your beige sectional", "the wooden coffee table").
- Be practical and actionable — give advice someone could act on this weekend.
- Keep each tip to 1-2 sentences.
- Each category's product must be something real and purchasable on Google Shopping.
- Return ONLY the JSON object, nothing else."""

PRODUCTS_PROMPT = """You are an elite interior design consultant. The user will show you a photo of a room.
Based on the room, recommend EXACTLY 3 purchasable products that would improve it.
Return ONLY valid JSON (no markdown, no code fences) with this exact structure:

{
  "products": [
    {
      "name": "Specific product name (e.g. 'Floor lamp with adjustable arm')",
      "why": "1-2 sentences on why this would improve the room based on what you see",
      "search_query": "short search phrase to find this product online (e.g. 'modern floor lamp adjustable')"
    },
    { "name": "...", "why": "...", "search_query": "..." },
    { "name": "...", "why": "...", "search_query": "..." }
  ]
}

Rules:
- Suggest 3 different products than last time if the user asks for new recommendations.
- Be specific and practical. search_query should work on Google Shopping.
- Return ONLY the JSON object, nothing else."""


@app.post("/api/analyze")
async def analyze_room(file: UploadFile = File(...)):
    _ensure_api_key()
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Accepted: JPEG, PNG, WebP.",
        )

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10 MB.",
        )

    b64_image = base64.b64encode(contents).decode("utf-8")
    data_uri = f"data:{file.content_type};base64,{b64_image}"

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Please analyze this room and give me interior design tips.",
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": data_uri, "detail": "high"},
                        },
                    ],
                },
            ],
            max_tokens=2000,
            temperature=0.7,
        )

        raw = response.choices[0].message.content.strip()
        # Strip markdown code fences if the model wraps them anyway
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1]
            raw = raw.rsplit("```", 1)[0]
        tips = json.loads(raw)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="The AI returned an unexpected format. Please try again.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI analysis failed: {str(e)}",
        )

    return tips


@app.post("/api/recommendations")
async def get_recommendations(file: UploadFile = File(...)):
    """Get 3 product recommendations for the room. Call again for different suggestions (refresh)."""
    _ensure_api_key()
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Accepted: JPEG, PNG, WebP.",
        )

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10 MB.",
        )

    b64_image = base64.b64encode(contents).decode("utf-8")
    data_uri = f"data:{file.content_type};base64,{b64_image}"

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": PRODUCTS_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Recommend 3 products to buy that would improve this room. Give different suggestions than before if possible.",
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": data_uri, "detail": "high"},
                        },
                    ],
                },
            ],
            max_tokens=800,
            temperature=0.9,
        )

        raw = response.choices[0].message.content.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1]
            raw = raw.rsplit("```", 1)[0]
        data = json.loads(raw)

        if "products" not in data or not data["products"]:
            raise ValueError("Expected at least one product")
        data["products"] = data["products"][:3]

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="The AI returned an unexpected format. Please try again.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"AI recommendations failed: {str(e)}",
        )

    return data


LYRICS_PROMPT = """You are a fun, creative songwriter. The user will describe a room's interior design vibe.
Write a short, catchy song (4 lines, rhyming couplets) that captures the room's personality.
Be specific — reference the actual colors, furniture, and mood described.
Keep it playful, upbeat, and SHORT — max 4 lines, each line under 10 words.
No intro text, no verse/chorus labels, just the 4 lines of lyrics."""


class VibeSongRequest(BaseModel):
    overall_impression: str
    categories: list[dict[str, Any]]


def _call_bark(lyrics: str) -> bytes:
    """Call HuggingFace Bark API to sing lyrics. Retries once if model is loading."""
    headers = {"Authorization": f"Bearer {_hf_token}"}
    # Wrap in ♪ to trigger singing mode in Bark
    payload = {"inputs": f"♪ {lyrics} ♪"}

    for attempt in range(3):
        resp = http_requests.post(BARK_API_URL, headers=headers, json=payload, timeout=120)
        if resp.status_code == 200:
            return resp.content
        if resp.status_code == 503:
            # Model loading — wait and retry
            wait = resp.json().get("estimated_time", 20)
            time.sleep(min(float(wait), 30))
            continue
        raise HTTPException(
            status_code=502,
            detail=f"HuggingFace Bark error ({resp.status_code}): {resp.text[:200]}",
        )
    raise HTTPException(status_code=502, detail="Bark model timed out loading. Try again in 30 seconds.")


@app.post("/api/vibe-song")
async def generate_vibe_song(data: VibeSongRequest):
    """Generate sung audio using GPT-4o lyrics + HuggingFace Bark singing model."""
    _ensure_api_key()
    _ensure_hf_token()

    room_context = f"Room impression: {data.overall_impression}\n"
    room_context += "Design areas: " + ", ".join(
        cat.get("name", "") for cat in data.categories
    )

    try:
        # Step 1: Generate short lyrics with GPT-4o
        lyrics_response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": LYRICS_PROMPT},
                {
                    "role": "user",
                    "content": f"Write a 4-line song about this room:\n{room_context}",
                },
            ],
            max_tokens=120,
            temperature=1.1,
        )
        lyrics = lyrics_response.choices[0].message.content.strip()

        # Step 2: Sing the lyrics using Bark (returns WAV bytes)
        audio_bytes = _call_bark(lyrics)
        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Song generation failed: {str(e)}",
        )

    return {"lyrics": lyrics, "audio_base64": audio_b64, "format": "wav"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
