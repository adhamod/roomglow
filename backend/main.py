import base64
import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

load_dotenv()

app = FastAPI(title="Interior Design Advisor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
      "tips": ["tip 1", "tip 2", "tip 3"]
    },
    {
      "name": "Furniture & Layout",
      "icon": "sofa",
      "tips": ["tip 1", "tip 2", "tip 3"]
    },
    {
      "name": "Lighting",
      "icon": "lightbulb",
      "tips": ["tip 1", "tip 2", "tip 3"]
    },
    {
      "name": "Decor & Accessories",
      "icon": "sparkles",
      "tips": ["tip 1", "tip 2", "tip 3"]
    }
  ]
}

Rules:
- Reference SPECIFIC things you see in the photo (e.g. "your beige sectional", "the wooden coffee table").
- Be practical and actionable — give advice someone could act on this weekend.
- Keep each tip to 1-2 sentences.
- Return ONLY the JSON object, nothing else."""


@app.post("/api/analyze")
async def analyze_room(file: UploadFile = File(...)):
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
            max_tokens=1500,
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
