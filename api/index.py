import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles  # 1. Import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Mount the 'images' folder so /images/filename.jpg requests work
app.mount("/images", StaticFiles(directory="images"), name="images")

@app.get("/")
def read_root():
    if os.path.exists("index.html"):
        return FileResponse("index.html")
    return {"message": "Welcome to the Cellphones Hub API!"}

# Cellphone database updated with local image paths matching the files in /images
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
    },
    {
        "id": 8,
        "brand": "Samsung",
        "name": "Samsung Galaxy S24 Ultra",
        "model_number": "SM-S928B",
        "release_year": 2024,
        "display": '6.8" Dynamic LTPO AMOLED 2X, 120Hz',
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "12 GB",
        "storage": "512 GB",
        "battery": "5000 mAh",
        "price": "$1,299",
        "os": "Android 14, One UI 6.1",
        "weight": "232 g",
        "camera_setup": "200 MP Main + 50 MP Periscope + 10 MP Tele + 12 MP Ultra",
        "description": "Titanium frame with integrated S Pen and Galaxy AI.",
        "image": "/images/samsungultra.jpg"
    },
    {
        "id": 9,
        "brand": "OnePlus",
        "name": "OnePlus 12",
        "model_number": "CPH2581",
        "release_year": 2024,
        "display": '6.82" LTPO AMOLED, 120Hz',
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "16 GB",
        "storage": "512 GB",
        "battery": "5400 mAh",
        "price": "$799",
        "os": "Android 14, OxygenOS 14",
        "weight": "220 g",
        "camera_setup": "50 MP Main + 64 MP Periscope + 48 MP Ultrawide",
        "description": "Hasselblad camera system with 100W SUPERVOOC charging.",
        "image": "/images/oneplus.jpg"
    },
    {
        "id": 10,
        "brand": "Asus",
        "name": "ROG Phone 8 Pro",
        "model_number": "AI2401",
        "release_year": 2024,
        "display": '6.78" LTPO AMOLED, 165Hz',
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "16 GB",
        "storage": "512 GB",
        "battery": "5500 mAh",
        "price": "$1,199",
        "os": "Android 14, ROG UI",
        "weight": "225 g",
        "camera_setup": "50 MP Gimbal Main + 32 MP Telephoto + 13 MP Ultrawide",
        "description": "Ultimate gaming performance with AniMe Vision display.",
        "image": "/images/rog.jpg"
    },
    {
        "id": 11,
        "brand": "Samsung",
        "name": "Samsung Galaxy A54 5G",
        "model_number": "SM-A546B",
        "release_year": 2023,
        "display": '6.4" Super AMOLED, 120Hz',
        "chipset": "Exynos 1380",
        "ram": "8 GB",
        "storage": "128 GB",
        "battery": "5000 mAh",
        "price": "$449",
        "os": "Android 13, One UI 5.1",
        "weight": "202 g",
        "camera_setup": "50 MP Main + 12 MP Ultrawide + 5 MP Macro",
        "description": "Reliable mid-range smartphone with IP67 rating and crisp display.",
        "image": "/images/samga54.jpg"
    },
    {
        "id": 12,
        "brand": "Motorola",
        "name": "Edge 50 Ultra",
        "model_number": "XT2401-1",
        "release_year": 2024,
        "display": '6.7" P-OLED, 144Hz',
        "chipset": "Snapdragon 8s Gen 3",
        "ram": "16 GB",
        "storage": "1 TB",
        "battery": "4500 mAh",
        "price": "$999",
        "os": "Android 14, Hello UI",
        "weight": "197 g",
        "camera_setup": "50 MP Main + 64 MP Periscope + 50 MP Ultrawide",
        "description": "Real wooden back finish with Pantone validated colors.",
        "image": "/images/edge50ultra.jpg"
    },
    {
        "id": 13,
        "brand": "Honor",
        "name": "Honor Magic6 Pro",
        "model_number": "BVT-AN00",
        "release_year": 2024,
        "display": '6.8" LTPO OLED, 120Hz',
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "12 GB",
        "storage": "512 GB",
        "battery": "5600 mAh",
        "price": "$1,099",
        "os": "Android 14, MagicOS 8.0",
        "weight": "229 g",
        "camera_setup": "50 MP Main + 180 MP Telephoto + 50 MP Ultrawide",
        "description": "180 MP periscope zoom with Silicon-carbon battery technology.",
        "image": "/images/honormagicpro.jpg"
    },
    {
        "id": 14,
        "brand": "Apple",
        "name": "iPhone 15",
        "model_number": "A3090",
        "release_year": 2023,
        "display": '6.1" Super Retina XDR OLED',
        "chipset": "Apple A16 Bionic",
        "ram": "6 GB",
        "storage": "128 GB",
        "battery": "3349 mAh",
        "price": "$799",
        "os": "iOS 17",
        "weight": "171 g",
        "camera_setup": "48 MP Main + 12 MP Ultrawide",
        "description": "Dynamic Island integration with color-infused glass back.",
        "image": "/images/ip15.jpg"
    },
    {
        "id": 15,
        "brand": "Samsung",
        "name": "Galaxy Z Flip 5",
        "model_number": "SM-F731B",
        "release_year": 2023,
        "display": '6.7" Foldable Dynamic AMOLED 2X, 120Hz',
        "chipset": "Snapdragon 8 Gen 2",
        "ram": "8 GB",
        "storage": "256 GB",
        "battery": "3700 mAh",
        "price": "$999",
        "os": "Android 13, One UI 5.1.1",
        "weight": "187 g",
        "camera_setup": "12 MP Main + 12 MP Ultrawide",
        "description": "Pocket-sized foldable phone with large Flex Window outer display.",
        "image": "/images/galaxygflip5.jpg"
    },
    {
        "id": 16,
        "brand": "Xiaomi",
        "name": "Xiaomi 13T Pro",
        "model_number": "23078PND5G",
        "release_year": 2023,
        "display": '6.67" AMOLED, 144Hz',
        "chipset": "MediaTek Dimensity 9200+",
        "ram": "12 GB",
        "storage": "512 GB",
        "battery": "5000 mAh",
        "price": "$699",
        "os": "Android 13, MIUI 14",
        "weight": "206 g",
        "camera_setup": "50 MP Leica Main + 50 MP Telephoto + 12 MP Ultra",
        "description": "Leica professional camera system with 120W HyperCharge.",
        "image": "/images/xiaomi.webp"
    },
    {
        "id": 17,
        "brand": "Poco",
        "name": "Poco X6 Pro",
        "model_number": "2311DRK48G",
        "release_year": 2024,
        "display": '6.67" AMOLED, 120Hz',
        "chipset": "MediaTek Dimensity 8300 Ultra",
        "ram": "12 GB",
        "storage": "512 GB",
        "battery": "5000 mAh",
        "price": "$350",
        "os": "Android 14, HyperOS",
        "weight": "186 g",
        "camera_setup": "64 MP Main + 8 MP Ultrawide + 2 MP Macro",
        "description": "Mid-range performance king with Flow AMOLED screen.",
        "image": "/images/pocox6.jpg"
    },
    {
        "id": 18,
        "brand": "Vivo",
        "name": "Vivo V30 Pro",
        "model_number": "V2319",
        "release_year": 2024,
        "display": '6.78" AMOLED, 120Hz',
        "chipset": "MediaTek Dimensity 8200",
        "ram": "12 GB",
        "storage": "512 GB",
        "battery": "5000 mAh",
        "price": "$520",
        "os": "Android 14, Funtouch 14",
        "weight": "188 g",
        "camera_setup": "50 MP Main + 50 MP Telephoto + 50 MP Ultrawide",
        "description": "Zeiss portrait camera with Aura Light portrait system.",
        "image": "/images/vivov30.jpg"
    },
    {
        "id": 19,
        "brand": "Oppo",
        "name": "Oppo Find X7 Ultra",
        "model_number": "PHY110",
        "release_year": 2024,
        "display": '6.82" LTPO AMOLED, 120Hz',
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "16 GB",
        "storage": "512 GB",
        "battery": "5000 mAh",
        "price": "$999",
        "os": "Android 14, ColorOS 14",
        "weight": "221 g",
        "camera_setup": "50 MP Quad Main + Dual Periscope Telephoto",
        "description": "World's first quad-main camera system with dual periscopes.",
        "image": "/images/oppofind.jpg"
    },
    {
        "id": 20,
        "brand": "Infinix",
        "name": "Infinix GT 20 Pro",
        "model_number": "X6871",
        "release_year": 2024,
        "display": '6.78" AMOLED, 144Hz',
        "chipset": "MediaTek Dimensity 8200 Ultimate",
        "ram": "12 GB",
        "storage": "256 GB",
        "battery": "5000 mAh",
        "price": "$320",
        "os": "Android 14, XOS 14",
        "weight": "194 g",
        "camera_setup": "108 MP OIS Main + 2 MP Macro + 2 MP Depth",
        "description": "Cyber-mecha gaming design with custom LED loop lighting.",
        "image": "/images/infiiiii.avif"
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