from fastapi import FastAPI, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Sport Hub",
    description="A beginner-friendly REST API containing information about sports.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SPORT DATA
sports = [
    {
        "id": 1,
        "name": "Basketball",
        "category": "Team Sport",
        "players_per_team": 5,
        "duration": "48 minutes",
        "description": "A fast-paced team sport where players score points by shooting a ball through an elevated hoop.",
        "image": "https://en.reformsports.com/what-are-the-rules-of-basketball/"
    },
    {
        "id": 2,
        "name": "Soccer (Football)",
        "category": "Team Sport",
        "players_per_team": 11,
        "duration": "90 minutes",
        "description": "The world's most popular sport, where teams attempt to kick a ball into the opposing net without using their hands."
    },
    {
        "id": 3,
        "name": "Volleyball",
        "category": "Team Sport",
        "players_per_team": 6,
        "duration": "Best of 5 sets",
        "description": "A high-energy court sport where players use their hands to hit a ball back and forth over a high net."
    },
    {
        "id": 4,
        "name": "Badminton",
        "category": "Racket Sport",
        "players_per_team": 1,
        "duration": "Best of 3 sets",
        "description": "A fast-reaction racket sport played by hitting a shuttlecock across a net using lightweight rackets."
    },
    {
        "id": 5,
        "name": "Tennis",
        "category": "Racket Sport",
        "players_per_team": 1,
        "duration": "Best of 3 or 5 sets",
        "description": "A classic court sport involving rackets and a felt-covered rubber ball played singles or doubles."
    },
    {
        "id": 6,
        "name": "Baseball",
        "category": "Bat-and-Ball",
        "players_per_team": 9,
        "duration": "9 innings",
        "description": "A field sport where teams alternate between batting to score runs and fielding to get hitters out."
    },
    {
        "id": 7,
        "name": "American Football",
        "category": "Contact Sport",
        "players_per_team": 11,
        "duration": "60 minutes",
        "description": "A tactical collision sport played on a 100-yard field aiming to advance a ball into the endzone."
    },
    {
        "id": 8,
        "name": "Rugby Union",
        "category": "Contact Sport",
        "players_per_team": 15,
        "duration": "80 minutes",
        "description": "A continuous contact sport featuring lateral passing, tackling, and grounding the ball for tries."
    },
    {
        "id": 9,
        "name": "Cricket",
        "category": "Bat-and-Ball",
        "players_per_team": 11,
        "duration": "Varies (3 to 8 hours)",
        "description": "A traditional bat-and-ball game focused on scoring runs between wickets while bowlers aim for dismissals."
    },
    {
        "id": 10,
        "name": "Ice Hockey",
        "category": "Winter / Team Sport",
        "players_per_team": 6,
        "duration": "60 minutes",
        "description": "A high-speed contact sport played on ice skates where teams hit a rubber puck into a goal."
    },
    {
        "id": 11,
        "name": "Table Tennis",
        "category": "Racket Sport",
        "players_per_team": 1,
        "duration": "Best of 5 or 7 sets",
        "description": "A rapid indoor sport where opponents hit a lightweight ball back and forth across a hard table."
    },
    {
        "id": 12,
        "name": "Swimming",
        "category": "Aquatic / Individual",
        "players_per_team": 1,
        "duration": "Event dependent",
        "description": "A competitive water sport testing speed and endurance across freestyle, backstroke, breaststroke, and butterfly."
    },
    {
        "id": 13,
        "name": "Boxing",
        "category": "Combat Sport",
        "players_per_team": 1,
        "duration": "Up to 12 rounds",
        "description": "A combat discipline where two fighters wearing padded gloves throw strikes within a square ring."
    },
    {
        "id": 14,
        "name": "Golf",
        "category": "Precision Sport",
        "players_per_team": 1,
        "duration": "18 holes (~4 hours)",
        "description": "A precision club-and-ball sport where players aim to sink a ball into a series of holes in as few strokes as possible."
    },
    {
        "id": 15,
        "name": "Track and Field",
        "category": "Athletics",
        "players_per_team": 1,
        "duration": "Event dependent",
        "description": "A collection of athletic contests combining running, jumping, throwing, and walking disciplines."
    },
    {
        "id": 16,
        "name": "Gymnastics",
        "category": "Aesthetic / Gymnastic",
        "players_per_team": 1,
        "duration": "Event dependent",
        "description": "An athletic discipline requiring balance, strength, flexibility, agility, coordination, and endurance."
    },
    {
        "id": 17,
        "name": "Formula 1 Racing",
        "category": "Motorsport",
        "players_per_team": 1,
        "duration": "Up to 2 hours",
        "description": "The highest class of international auto racing for single-seater open-wheel Formula racing cars."
    },
    {
        "id": 18,
        "name": "Surfing",
        "category": "Water Sport",
        "players_per_team": 1,
        "duration": "Heat dependent",
        "description": "A water sport where athletes ride moving waves toward the shore on a surfboard while performing maneuvers."
    },
    {
        "id": 19,
        "name": "Archery",
        "category": "Precision Sport",
        "players_per_team": 1,
        "duration": "Match dependent",
        "description": "The art and skill of shooting arrows at a stationary target with a bow to score high-value ring points."
    },
    {
        "id": 20,
        "name": "Mixed Martial Arts (MMA)",
        "category": "Combat Sport",
        "players_per_team": 1,
        "duration": "3 to 5 rounds",
        "description": "A full-contact combat sport allowing striking and grappling, both standing and on the ground, using techniques from various combat disciplines."
    }
]

# HOME
@app.get("/")
def home():
    return {
        "message": "Welcome to the Sports Hub API!",
        "endpoints": [
            "/sports",
            "/sports/search",
            "/sports/{id}"
        ]
    }


# GET ALL SPORTS
@app.get("/sports")
def get_sports():
    return {
        "count": len(sports),
        "sports": sports
    }


# SEARCH SPORTS (Defined BEFORE /sports/{sport_id} so "search" isn't parsed as an ID)
@app.get("/sports/search")
def search_sports(q: str = Query(default="", min_length=0)):
    query = q.lower().strip()
    
    if not query:
        return {
            "query": q,
            "count": len(sports),
            "results": sports
        }

    results = []
    for sport in sports:
        searchable_text = (
            f"{sport['name']} "
            f"{sport['category']} "
            f"{sport['description']}"
        ).lower()

        if query in searchable_text:
            results.append(sport)

    return {
        "query": q,
        "count": len(results),
        "results": results
    }


# GET ONE SPORT
@app.get("/sports/{sport_id}")
def get_sport(sport_id: int):
    for sport in sports:
        if sport["id"] == sport_id:
            return sport

    raise HTTPException(
        status_code=404,
        detail="Sport not found."
    )