import spacy
import uvicorn
import re
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

nlp = spacy.load("en_core_web_sm")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    text: str

def local_scrub(text: str):
    # --- STEP 1: PROTECT THE "FRUIT" MANUALLY ---
    tech_keywords = ["laptop", "macbook", "iphone", "computer", "working", "device", "fix"]
    words = text.split()
    temp_list = []
    for i, word in enumerate(words):
        clean = re.sub(r'[^\w]', '', word).lower()
        if clean == "apple":
            context = " ".join(words[max(0, i-2):i+3]).lower()
            # If "eating" or tech words are nearby, it's a safe Apple
            if any(k in context for k in tech_keywords) or "eating" in context:
                temp_list.append("SAFE_APPLE_KEEP")
            else:
                temp_list.append("<ORG_REDACTED>")
        else:
            temp_list.append(word)
    text = " ".join(temp_list)

    # --- STEP 2: MANUAL OVERRIDES (The "Shield") ---
    # This prevents Padma (GPE) and Aadhaar (PERSON) errors
    manual_redactions = {
        r"\bpadma\b": "<PERSON_REDACTED>",
        r"\bnayanika\b": "<PERSON_REDACTED>",
        r"\baadhaar\b": "Aadhaar" # Force the word to stay as "Aadhaar"
    }
    for pattern, replacement in manual_redactions.items():
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

    # --- STEP 3: REGEX SENTINELS (Numbers) ---
    aadhaar_pat = r'\b\d{4}[ -]?\d{4}[ -]?\d{4}\b'
    srm_id_pat = r'\b(RA\d{13}|\d{7})\b'
    text = re.sub(aadhaar_pat, "<AADHAAR_REDACTED>", text)
    text = re.sub(srm_id_pat, "<STUDENT_ID_REDACTED>", text)

    # --- STEP 4: ML NER (Catch-all) ---
    doc = nlp(text)
    for ent in doc.ents:
        # Skip what we already handled
        if any(tag in ent.text for tag in ["REDACTED", "SAFE_APPLE_KEEP", "Aadhaar"]):
            continue
        if ent.label_ in ["PERSON", "ORG", "GPE"]:
            text = text.replace(ent.text, f"<{ent.label_}_REDACTED>")

    # --- STEP 5: FINAL RESTORE ---
    return text.replace("SAFE_APPLE_KEEP", "Apple")

@app.post("/scrub")
async def scrub_text(request: PromptRequest):
    return {"scrubbed_text": local_scrub(request.text)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)