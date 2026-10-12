from fastapi import APIRouter, HTTPException, Header, Query, Depends
from typing import Optional
from datetime import datetime
from .database import cellphones_db

router = APIRouter()
API_KEY = "student-api-key-123"

def verify_api_key(x_api_key: Optional[str] = Header(default=None)):
    if x_api_key != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key."
        )
    return True

@router.get("/cellphones", dependencies=[Depends(verify_api_key)])
def get_cellphones():
    return {
        "count": len(cellphones_db),
        "cellphones": cellphones_db
    }

@router.get("/cellphones/search", dependencies=[Depends(verify_api_key)])
def search_cellphones(q: str = Query(..., min_length=1)):
    q_clean = q.lower().strip()
    results = []

    for phone in cellphones_db:
        searchable_text = (
            f"{phone['brand']} "
            f"{phone['name']} "
            f"{phone['model_number']} "
            f"{phone['release_year']} "
            f"{phone['display']} "
            f"{phone['chipset']} "
            f"{phone['ram']} "
            f"{phone['storage']} "
            f"{phone['os']} "
            f"{phone['camera_setup']} "
            f"{phone['description']} "
            f"{phone['refresh_rate']} "
            f"{phone['charging_speed']} "
            f"{phone['water_resistance']} "
            f"{phone['audio_speakers']} "
            f"{phone['biometrics']} "
            f"{phone['connectivity']} "
            f"{phone['build_material']} "
            f"{phone['sim_support']} "
            f"{phone['expandable_storage']} "
            f"{phone['gpu']}"
        ).lower()

        if q_clean in searchable_text:
            results.append(phone)

    return {
        "query": q,
        "count": len(results),
        "results": results
    }

@router.get("/cellphones/{phone_id}", dependencies=[Depends(verify_api_key)])
def get_cellphone(phone_id: int):
    for phone in cellphones_db:
        if phone["id"] == phone_id:
            return phone
    raise HTTPException(status_code=404, detail="Cellphone not found.")