from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import backend.state as state
from backend.tracker_service import start_tracking
from backend.streamer import video_feed


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting CrowdShield Backend...")

    start_tracking()

    yield

    print("🛑 Backend shutting down...")


app = FastAPI(
    title="CrowdShield AI API",
    lifespan=lifespan
)

# ─── CORS ────────────────────────────────────────────────────────────────────
# allow_origins="*" lets any device on the LAN reach this API.
# For production, replace "*" with explicit frontend URLs.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,   # must be False when allow_origins="*"
    allow_methods=["*"],
    allow_headers=["*"],
)
# ─────────────────────────────────────────────────────────────────────────────


@app.get("/")
def root():
    return {
        "message": "CrowdShield AI Backend Running",
        "status": "online"
    }


@app.get("/status")
def status():
    return state.latest_data


@app.get("/risk")
def risk():
    return {
        "risk": state.latest_data["risk"],
        "people": state.latest_data["people"],
        "highest_zone": state.latest_data["highest_zone"]
    }


@app.get("/flow")
def flow():
    return state.latest_data["flow"]


@app.get("/zones")
def zones():
    return state.latest_data["zones"]


@app.get("/recommendations")
def recommendations():
    return state.latest_data["recommendations"]


@app.get("/bottleneck")
def bottleneck():
    return state.latest_data["bottleneck"]


@app.get("/video_feed")
def stream():
    return video_feed()