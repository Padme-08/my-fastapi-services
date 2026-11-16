from fastapi import APIRouter, HTTPException, Header, Depends, Query
from typing import Optional
import psycopg2
import os
from dotenv import load_dotenv
from .database import get_db_connection
from .models import Cellphone

load_dotenv()
router = APIRouter()
API_KEY = os.getenv("API_KEY", "student-api-key-123")

def verify_api_key(x_api_key: Optional[str] = Header(default=None)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key.")
    return True

# 1. READ ALL (GET) - Accepts optional ?limit=4 for Guest Mode
@router.get("/cellphones", dependencies=[Depends(verify_api_key)])
def get_cellphones(limit: Optional[int] = Query(None, ge=1)):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            if limit:
                cur.execute("SELECT * FROM cellphones ORDER BY id ASC LIMIT %s;", (limit,))
            else:
                cur.execute("SELECT * FROM cellphones ORDER BY id ASC;")
            records = cur.fetchall()
            return {"count": len(records), "cellphones": records}
    except Exception as e:
        print(f"Error in GET /cellphones: {e}")
        raise HTTPException(status_code=500, detail="Database connection or query failed.")
    finally:
        if conn:
            conn.close()

# 2. SEARCH (GET)
@router.get("/cellphones/search", dependencies=[Depends(verify_api_key)])
def search_cellphones(q: str = Query(..., min_length=1)):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            search_pattern = f"%{q}%"
            cur.execute("""
                SELECT * FROM cellphones 
                WHERE name ILIKE %s OR brand ILIKE %s OR model_number ILIKE %s OR chipset ILIKE %s;
            """, (search_pattern, search_pattern, search_pattern, search_pattern))
            records = cur.fetchall()
            return {"query": q, "count": len(records), "results": records}
    except Exception as e:
        print(f"Error in SEARCH /cellphones: {e}")
        raise HTTPException(status_code=500, detail="Search failed.")
    finally:
        if conn:
            conn.close()

# 3. READ ONE (GET)
@router.get("/cellphones/{phone_id}", dependencies=[Depends(verify_api_key)])
def get_cellphone(phone_id: int):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM cellphones WHERE id = %s;", (phone_id,))
            record = cur.fetchone()
            if not record:
                raise HTTPException(status_code=404, detail="Phone not found.")
            return record
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in GET /cellphones/{phone_id}: {e}")
        raise HTTPException(status_code=500, detail="Database lookup failed.")
    finally:
        if conn:
            conn.close()

# 4. CREATE (POST)
@router.post("/cellphones", dependencies=[Depends(verify_api_key)], status_code=201)
def create_cellphone(phone: Cellphone):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            query = """
                INSERT INTO cellphones (
                    brand, name, model_number, release_year, display, chipset, ram, 
                    storage, battery, price, os, weight, camera_setup, description, 
                    image, refresh_rate, charging_speed, water_resistance, audio_speakers, 
                    biometrics, connectivity, build_material, sim_support, expandable_storage, gpu
                ) VALUES (
                    %(brand)s, %(name)s, %(model_number)s, %(release_year)s, %(display)s, %(chipset)s, %(ram)s, 
                    %(storage)s, %(battery)s, %(price)s, %(os)s, %(weight)s, %(camera_setup)s, %(description)s, 
                    %(image)s, %(refresh_rate)s, %(charging_speed)s, %(water_resistance)s, %(audio_speakers)s, 
                    %(biometrics)s, %(connectivity)s, %(build_material)s, %(sim_support)s, %(expandable_storage)s, %(gpu)s
                ) RETURNING id;
            """
            data = phone.model_dump(exclude={"id"})
            cur.execute(query, data)
            new_id = cur.fetchone()["id"]
            conn.commit()
            return {"message": "Record created successfully", "id": new_id}
    except psycopg2.IntegrityError:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=400, detail="A cellphone with this name already exists.")
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error in POST /cellphones: {e}")
        raise HTTPException(status_code=500, detail="Database Inserted Failed")
    finally:
        if conn:
            conn.close()

# 5. UPDATE (PUT)
@router.put("/cellphones/{phone_id}", dependencies=[Depends(verify_api_key)])
def update_cellphone(phone_id: int, phone: Cellphone):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM cellphones WHERE id = %s;", (phone_id,))
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail="Phone not found.")
            
            query = """
                UPDATE cellphones SET 
                    brand=%(brand)s, name=%(name)s, model_number=%(model_number)s, release_year=%(release_year)s, 
                    display=%(display)s, chipset=%(chipset)s, ram=%(ram)s, storage=%(storage)s, 
                    battery=%(battery)s, price=%(price)s, os=%(os)s, weight=%(weight)s, 
                    camera_setup=%(camera_setup)s, description=%(description)s, image=%(image)s, 
                    refresh_rate=%(refresh_rate)s, charging_speed=%(charging_speed)s, water_resistance=%(water_resistance)s, 
                    audio_speakers=%(audio_speakers)s, biometrics=%(biometrics)s, connectivity=%(connectivity)s, 
                    build_material=%(build_material)s, sim_support=%(sim_support)s, expandable_storage=%(expandable_storage)s, gpu=%(gpu)s
                WHERE id = %(id)s;
            """
            data = phone.model_dump()
            data["id"] = phone_id
            cur.execute(query, data)
            conn.commit()
            return {"message": "Record updated successfully"}
    except HTTPException:
        raise
    except psycopg2.IntegrityError:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=400, detail="A cellphone with this name already exists.")
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error in PUT /cellphones: {e}")
        raise HTTPException(status_code=500, detail="Failed to update record.")
    finally:
        if conn:
            conn.close()

# 6. DELETE (DELETE)
@router.delete("/cellphones/{phone_id}", dependencies=[Depends(verify_api_key)])
def delete_cellphone(phone_id: int):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("DELETE FROM cellphones WHERE id = %s RETURNING id;", (phone_id,))
            deleted = cur.fetchone()
            if not deleted:
                raise HTTPException(status_code=404, detail="Phone not found.")
            conn.commit()
            return {"message": "Record deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error in DELETE /cellphones: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete record.")
    finally:
        if conn:
            conn.close()