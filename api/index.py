from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for local testing and cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cellphone database updated with your local image paths from the images folder
cellphones_db = [
    {
        "id": 1,
        "brand": "Apple",
        "name": "iPhone 15 Pro Max",
        "model_number": "A3106",
        "release_year": 2023,
        "display": '6.7" Super Retina XDR OLED, 120Hz',
        "chipset": "Apple A17 Pro",
        "ram": "8 GB",
        "storage": "256 GB",
        "battery": "4422 mAh",
        "price": "$1,199",
        "os": "iOS 17",
        "weight": "221 g",
        "camera_setup": "48 MP Main + 12 MP Periscope + 12 MP Ultrawide",
        "description": "Titanium build with Action Button and 5x optical zoom.",
        "image": "/images/iph15pm.jpg"
    },
    {
        "id": 2,
        "brand": "Google",
        "name": "Google Pixel 8 Pro",
        "model_number": "GC3VE",
        "release_year": 2023,
        "display": '6.7" LTPO OLED, 120Hz',
        "chipset": "Google Tensor G3",
        "ram": "12 GB",
        "storage": "128 GB",
        "battery": "5050 mAh",
        "price": "$999",
        "os": "Android 14",
        "weight": "213 g",
        "camera_setup": "50 MP Main + 48 MP Telephoto + 48 MP Ultrawide",
        "description": "Advanced AI features with best-in-class camera processing.",
        "image": "/images/gglp8pro.jpg"
    },
    {
        "id": 3,
        "brand": "Google",
        "name": "Google Pixel 8a",
        "model_number": "G6GPR",
        "release_year": 2024,
        "display": '6.1" OLED, 120Hz',
        "chipset": "Google Tensor G3",
        "ram": "8 GB",
        "storage": "128 GB",
        "battery": "4492 mAh",
        "price": "$499",
        "os": "Android 14",
        "weight": "188 g",
        "camera_setup": "64 MP Main + 13 MP Ultrawide",
        "description": "Budget-friendly Pixel experience powered by Tensor G3.",
        "image": "/images/gglpixel8a.jpg"
    },
    {
        "id": 4,
        "brand": "Realme",
        "name": "Realme GT 5 Pro",
        "model_number": "RMX3888",
        "release_year": 2023,
        "display": '6.78" AMOLED, 144Hz',
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "12 GB",
        "storage": "256 GB",
        "battery": "5400 mAh",
        "price": "$650",
        "os": "Android 14, Realme UI 5.0",
        "weight": "218 g",
        "camera_setup": "50 MP Main + 50 MP Periscope + 8 MP Ultrawide",
        "description": "High-performance flagship killer with 100W fast charging.",
        "image": "/images/realmegt5pro.jpg"
    },
    {
        "id": 5,
        "brand": "Sony",
        "name": "Sony Xperia 1 VI",
        "model_number": "XQ-EC54",
        "release_year": 2024,
        "display": '6.5" LTPO OLED, 120Hz',
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "12 GB",
        "storage": "256 GB",
        "battery": "5000 mAh",
        "price": "$1,399",
        "os": "Android 14",
        "weight": "192 g",
        "camera_setup": "48 MP Main + 12 MP Optical Zoom + 12 MP Ultrawide",
        "description": "Professional camera tech with dedicated shutter button.",
        "image": "/images/sonyxperia.jpg"
    },
    {
        "id": 6,
        "brand": "Vivo",
        "name": "Vivo X100 Pro",
        "model_number": "V2309A",
        "release_year": 2023,
        "display": '6.78" LTPO AMOLED, 120Hz',
        "chipset": "MediaTek Dimensity 9300",
        "ram": "16 GB",
        "storage": "512 GB",
        "battery": "5400 mAh",
        "price": "$899",
        "os": "Android 14, Funtouch 14",
        "weight": "225 g",
        "camera_setup": "50 MP 1-inch Main + 50 MP Zeiss APO + 50 MP Ultra",
        "description": "Zeiss optics with unmatched low-light photography.",
        "image": "/images/vivox100pro.jpg"
    },
    {
        "id": 7,
        "brand": "Xiaomi",
        "name": "Xiaomi 14",
        "model_number": "23127PN0CC",
        "release_year": 2023,
        "display": '6.36" LTPO OLED, 120Hz',
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "12 GB",
        "storage": "256 GB",
        "battery": "4610 mAh",
        "price": "$799",
        "os": "Android 14, HyperOS",
        "weight": "193 g",
        "camera_setup": "50 MP Leica Main + 50 MP Telephoto + 50 MP Ultra",
        "description": "Compact flagship co-engineered with Leica optics.",
        "image": "/images/xiaomi14.jpg"
    }
]

@app.get("/cellphones")
def get_all_cellphones():
    return {"cellphones": cellphones_db}

@app.get("/cellphones/search")
def search_cellphones(q: str = ""):
    query = q.lower().strip()
    if not query:
        return {"results": cellphones_db}
    
    filtered = [
        phone for phone in cellphones_db
        if query in phone["name"].lower() or query in phone["brand"].lower()
    ]
    return {"results": filtered}

@app.get("/cellphones/{phone_id}")
def get_cellphone_by_id(phone_id: int):
    for phone in cellphones_db:
        if phone["id"] == phone_id:
            return phone
    return {"error": "Cellphone not found"}