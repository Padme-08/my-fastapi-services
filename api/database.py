import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Automatically locate and load the root .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    """Establish and return a secure connection to the Neon database."""
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is missing or empty. Please check your .env file.")
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise e