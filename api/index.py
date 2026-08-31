from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Cellphones Hub API",
    description="A REST API containing detailed information about cellphones.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="images"), name="images")

cellphones = [
    {
        "id": 1,
        "name": "iPhone 15 Pro Max",
        "brand": "Apple",
        "model_number": "A3106",
        "release_year": 2023,
        "display": "6.7-inch Super Retina XDR OLED",
        "chipset": "Apple A17 Pro",
        "ram": "8 GB",
        "storage": "256 GB",
        "battery": "4422 mAh",
        "price": "$1,199",
        "camera_setup": "48 MP Main + 12 MP Ultrawide + 12 MP Telephoto",
        "os": "iOS 17",
        "weight": "221 g",
        "description": "Premium flagship smartphone featuring a lightweight titanium frame, Action button, and a 5x optical telephoto lens.",
        "image": "http://127.0.0.1:8000/images/iph15pm.jpg"
    },
    {
        "id": 2,
        "name": "Google Pixel 8 Pro",
        "brand": "Google",
        "model_number": "GC3VE",
        "release_year": 2023,
        "display": "6.7-inch Super Actua LTPO OLED",
        "chipset": "Google Tensor G3",
        "ram": "12 GB",
        "storage": "128 GB",
        "battery": "5050 mAh",
        "price": "$999",
        "camera_setup": "50 MP Main + 48 MP Ultrawide + 48 MP Telephoto",
        "os": "Android 14",
        "weight": "213 g",
        "description": "Pure Android smartphone featuring advanced computational photography, Magic Editor AI, and 7 years of software updates.",
        "image": "http://127.0.0.1:8000/images/gglp8pro.jpg"
    },
    {
        "id": 3,
        "name": "Google Pixel 8a",
        "brand": "Google",
        "model_number": "G6GPR",
        "release_year": 2024,
        "display": "6.1-inch Actua OLED (120Hz)",
        "chipset": "Google Tensor G3",
        "ram": "8 GB",
        "storage": "128 GB",
        "battery": "4492 mAh",
        "price": "$499",
        "camera_setup": "64 MP Main + 13 MP Ultrawide",
        "os": "Android 14",
        "weight": "188 g",
        "description": "Mid-range device offering flagship Google Tensor AI features and long-term software support.",
        "image": "http://127.0.0.1:8000/images/gglpixel8a.jpg"
    },
    {
        "id": 4,
        "name": "Realme GT 5 Pro",
        "brand": "Realme",
        "model_number": "RMX3888",
        "release_year": 2023,
        "display": "6.78-inch AMOLED (144Hz)",
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "16 GB",
        "storage": "512 GB",
        "battery": "5400 mAh",
        "price": "$650",
        "camera_setup": "50 MP Main + 50 MP Periscope + 8 MP Ultrawide",
        "os": "Android 14 (Realme UI 5.0)",
        "weight": "218 g",
        "description": "Value flagship delivering high-end computing performance and 100W wired charging support.",
        "image": "http://127.0.0.1:8000/images/realmegt5pro.jpg"
    },
    {
        "id": 5,
        "name": "Sony Xperia 1 VI",
        "brand": "Sony",
        "model_number": "XQ-EC54",
        "release_year": 2024,
        "display": "6.5-inch FHD+ LTPO OLED",
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "12 GB",
        "storage": "256 GB",
        "battery": "5000 mAh",
        "price": "$1,399",
        "camera_setup": "48 MP Main + 12 MP Telephoto + 12 MP Ultrawide",
        "os": "Android 14",
        "weight": "192 g",
        "description": "Enthusiast multimedia device offering continuous true optical zoom and dedicated physical shutter key.",
        "image": "http://127.0.0.1:8000/images/sonyxperia.jpg"
    },
    {
        "id": 6,
        "name": "Vivo X100 Pro",
        "brand": "Vivo",
        "model_number": "V2308",
        "release_year": 2023,
        "display": "6.78-inch LTPO AMOLED",
        "chipset": "MediaTek Dimensity 9300",
        "ram": "16 GB",
        "storage": "512 GB",
        "battery": "5400 mAh",
        "price": "$950",
        "camera_setup": "50 MP Main (1-inch) + 50 MP Periscope + 50 MP Ultrawide",
        "os": "Android 14 (Funtouch 14)",
        "weight": "225 g",
        "description": "Camera-focused smartphone equipped with a 1-inch ZEISS primary sensor.",
        "image": "http://127.0.0.1:8000/images/vivox100pro.jpg"
    },
    {
        "id": 7,
        "name": "Xiaomi 14 Ultra",
        "brand": "Xiaomi",
        "model_number": "24030PN60G",
        "release_year": 2024,
        "display": "6.73-inch LTPO AMOLED",
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "16 GB",
        "storage": "512 GB",
        "battery": "5000 mAh",
        "price": "$1,100",
        "camera_setup": "50 MP Main (1-inch) + 50 MP Periscope + 50 MP Telephoto + 50 MP Ultrawide",
        "os": "Android 14 (HyperOS)",
        "weight": "219.8 g",
        "description": "Photography flagship built with Leica quad 50MP cameras and stepless variable aperture.",
        "image": "http://127.0.0.1:8000/images/xiaomi14.jpg"
    },
    {
        "id": 8,
        "name": "Samsung Galaxy S24 Ultra",
        "brand": "Samsung",
        "model_number": "SM-S928B",
        "release_year": 2024,
        "display": "6.8-inch Dynamic LTPO AMOLED 2X",
        "chipset": "Snapdragon 8 Gen 3 for Galaxy",
        "ram": "12 GB",
        "storage": "512 GB",
        "battery": "5000 mAh",
        "price": "$1,299",
        "camera_setup": "200 MP Main + 50 MP Periscope + 10 MP Telephoto + 12 MP Ultrawide",
        "os": "Android 14 (One UI 6.1)",
        "weight": "232 g",
        "description": "Ultimate Android flagship featuring integrated S Pen, anti-reflective display, and Galaxy AI.",
        "image": "http://127.0.0.1:8000/images/s24ultra.jpg"
    },
    {
        "id": 9,
        "name": "OnePlus 12",
        "brand": "OnePlus",
        "model_number": "CPH2581",
        "release_year": 2024,
        "display": "6.82-inch LTPO AMOLED (4500 nits)",
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "16 GB",
        "storage": "512 GB",
        "battery": "5400 mAh",
        "price": "$799",
        "camera_setup": "50 MP Main + 64 MP Periscope + 48 MP Ultrawide",
        "os": "Android 14 (OxygenOS 14)",
        "weight": "220 g",
        "description": "Performance flagship featuring Hasselblad camera tuning and 100W SUPERVOOC charging.",
        "image": "http://127.0.0.1:8000/images/oneplus12.jpg"
    },
    {
        "id": 10,
        "name": "ASUS ROG Phone 8 Pro",
        "brand": "ASUS",
        "model_number": "ASUS_AI2401",
        "release_year": 2024,
        "display": "6.78-inch Samsung E6 AMOLED (165Hz)",
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "24 GB",
        "storage": "1 TB",
        "battery": "5500 mAh",
        "price": "$1,199",
        "camera_setup": "50 MP Gimbal Main + 32 MP Telephoto + 13 MP Ultrawide",
        "os": "Android 14 (ROG UI)",
        "weight": "225 g",
        "description": "Gaming smartphone with AniMe Vision LED back display and AirTrigger capacitive touch controls.",
        "image": "http://127.0.0.1:8000/images/rogphone8.jpg"
    },
    {
        "id": 11,
        "name": "Motorola Edge 50 Ultra",
        "brand": "Motorola",
        "model_number": "XT2401-2",
        "release_year": 2024,
        "display": "6.7-inch P-OLED (144Hz)",
        "chipset": "Snapdragon 8s Gen 3",
        "ram": "16 GB",
        "storage": "1 TB",
        "battery": "4500 mAh",
        "price": "$999",
        "camera_setup": "50 MP Main + 64 MP Periscope + 50 MP Ultrawide",
        "os": "Android 14 (Hello UI)",
        "weight": "197 g",
        "description": "Design-focused phone featuring real wood and vegan leather back options with Pantone validation.",
        "image": "http://127.0.0.1:8000/images/edge50ultra.jpg"
    },
    {
        "id": 12,
        "name": "Nothing Phone (2a)",
        "brand": "Nothing",
        "model_number": "A142",
        "release_year": 2024,
        "display": "6.7-inch Flexible AMOLED (120Hz)",
        "chipset": "MediaTek Dimensity 7200 Pro",
        "ram": "12 GB",
        "storage": "256 GB",
        "battery": "5000 mAh",
        "price": "$349",
        "camera_setup": "50 MP Main + 50 MP Ultrawide",
        "os": "Android 14 (Nothing OS 2.5)",
        "weight": "190 g",
        "description": "Unique transparent aesthetic featuring Glyph lighting interface and clean software experience.",
        "image": "http://127.0.0.1:8000/images/nothing2a.jpg"
    },
    {
        "id": 13,
        "name": "Honor Magic6 Pro",
        "brand": "Honor",
        "model_number": "BVT-AN10",
        "release_year": 2024,
        "display": "6.8-inch LTPO OLED (5000 nits)",
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "12 GB",
        "storage": "512 GB",
        "battery": "5600 mAh",
        "price": "$1,099",
        "camera_setup": "180 MP Periscope + 50 MP Main + 50 MP Ultrawide",
        "os": "Android 14 (MagicOS 8)",
        "weight": "229 g",
        "description": "Flagship device featuring high-density silicon-carbon battery technology and AI motion sensing camera.",
        "image": "http://127.0.0.1:8000/images/magic6pro.jpg"
    },
    {
        "id": 14,
        "name": "POCO F6 Pro",
        "brand": "POCO",
        "model_number": "24069PC21G",
        "release_year": 2024,
        "display": "6.67-inch WQHD+ Flow AMOLED",
        "chipset": "Snapdragon 8 Gen 2",
        "ram": "16 GB",
        "storage": "1 TB",
        "battery": "5000 mAh",
        "price": "$499",
        "camera_setup": "50 MP Main (OIS) + 8 MP Ultrawide + 2 MP Macro",
        "os": "Android 14 (HyperOS)",
        "weight": "209 g",
        "description": "Performance-centric mid-ranger with 120W HyperCharge fast charging and 4000 nits peak brightness.",
        "image": "http://127.0.0.1:8000/images/pocof6pro.jpg"
    },
    {
        "id": 15,
        "name": "iQOO 12",
        "brand": "iQOO",
        "model_number": "I2220",
        "release_year": 2023,
        "display": "6.78-inch LTPO AMOLED (144Hz)",
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "16 GB",
        "storage": "512 GB",
        "battery": "5000 mAh",
        "price": "$699",
        "camera_setup": "50 MP Main + 64 MP Periscope + 50 MP Ultrawide",
        "os": "Android 14 (Funtouch 14)",
        "weight": "203.7 g",
        "description": "Esports gaming smartphone featuring Supercomputing Chip Q1 and BMW M Motorsport branding.",
        "image": "http://127.0.0.1:8000/images/iqoo12.jpg"
    },
    {
        "id": 16,
        "name": "ZTE Nubia Z60 Ultra",
        "brand": "ZTE",
        "model_number": "NX721J",
        "release_year": 2023,
        "display": "6.8-inch AMOLED (No Notch)",
        "chipset": "Snapdragon 8 Gen 3",
        "ram": "16 GB",
        "storage": "512 GB",
        "battery": "6000 mAh",
        "price": "$779",
        "camera_setup": "50 MP (35mm) + 64 MP (85mm) + 50 MP (18mm)",
        "os": "Android 14 (MyOS 14)",
        "weight": "246 g",
        "description": "Full-screen display device with fifth-generation under-display front camera and triple optical OIS.",
        "image": "http://127.0.0.1:8000/images/z60ultra.jpg"
    },
    {
        "id": 17,
        "name": "Infinix GT 20 Pro",
        "brand": "Infinix",
        "model_number": "X6871",
        "release_year": 2024,
        "display": "6.78-inch FHD+ AMOLED (144Hz)",
        "chipset": "MediaTek Dimensity 8200 Ultimate",
        "ram": "12 GB",
        "storage": "256 GB",
        "battery": "5000 mAh",
        "price": "$319",
        "camera_setup": "108 MP Main (OIS) + 2 MP Macro + 2 MP Depth",
        "os": "Android 14 (XOS 14)",
        "weight": "194 g",
        "description": "Budget cyber-mecha styled gaming smartphone equipped with dedicated Pixelworks display chip.",
        "image": "http://127.0.0.1:8000/images/gt20pro.jpg"
    },
    {
        "id": 18,
        "name": "Tecno Camon 30 Premier",
        "brand": "Tecno",
        "model_number": "CL9",
        "release_year": 2024,
        "display": "6.77-inch LTPO AMOLED",
        "chipset": "MediaTek Dimensity 8200 Ultimate",
        "ram": "12 GB",
        "storage": "512 GB",
        "battery": "5000 mAh",
        "price": "$450",
        "camera_setup": "50 MP Main + 50 MP Periscope + 50 MP Ultrawide",
        "os": "Android 14 (HIOS 14)",
        "weight": "210 g",
        "description": "Mobile imaging system featuring Sony CXD5622GG imaging chip and PolarAce AI system.",
        "image": "http://127.0.0.1:8000/images/camon30.jpg"
    },
    {
        "id": 19,
        "name": "Fairphone 5",
        "brand": "Fairphone",
        "model_number": "FP5",
        "release_year": 2023,
        "display": "6.46-inch OLED (90Hz)",
        "chipset": "Qualcomm QCM6490",
        "ram": "8 GB",
        "storage": "256 GB",
        "battery": "4200 mAh (Replaceable)",
        "price": "$700",
        "camera_setup": "50 MP Main + 50 MP Ultrawide",
        "os": "Android 13 (Upgradable to 14)",
        "weight": "212 g",
        "description": "Modular sustainable smartphone with 10-year software support window and easy self-repair parts.",
        "image": "http://127.0.0.1:8000/images/fairphone5.jpg"
    },
    {
        "id": 20,
        "name": "Sharp Aquos R8 Pro",
        "brand": "Sharp",
        "model_number": "SH-R80P",
        "release_year": 2023,
        "display": "6.6-inch Pro IGZO OLED (240Hz)",
        "chipset": "Snapdragon 8 Gen 2",
        "ram": "12 GB",
        "storage": "256 GB",
        "battery": "5000 mAh",
        "price": "$1,050",
        "camera_setup": "47.2 MP (1-inch Leica Summicron) + 1.9 MP Depth",
        "os": "Android 13 (Upgradable to 14)",
        "weight": "207 g",
        "description": "Japanese flagship featuring 240Hz refresh rate screen and 1-inch image sensor with lens hood support.",
        "image": "http://127.0.0.1:8000/images/aquosr8pro.jpg"
    }
]

@app.get("/")
def home():
    return {
        "message": "Welcome to the Cellphones Hub API!",
        "endpoints": ["/cellphones", "/cellphones/search", "/cellphones/{id}"]
    }

@app.get("/cellphones")
def get_cellphones():
    return {"count": len(cellphones), "cellphones": cellphones}

@app.get("/cellphones/search")
def search_cellphones(q: str = Query(default="", min_length=0)):
    query = q.lower().strip()
    if not query:
        return {"query": q, "count": len(cellphones), "results": cellphones}

    results = [
        phone for phone in cellphones
        if query in f"{phone['name']} {phone['brand']} {phone['chipset']} {phone['description']}".lower()
    ]
    return {"query": q, "count": len(results), "results": results}

@app.get("/cellphones/{cellphone_id}")
def get_cellphone(cellphone_id: int):
    for phone in cellphones:
        if phone["id"] == cellphone_id:
            return phone
    raise HTTPException(status_code=404, detail="Cellphone not found.")