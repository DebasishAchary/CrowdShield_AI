from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import shutil
import uuid

import backend.state as state
from backend.tracker_service import start_tracking, restart_tracking
from backend.streamer import video_feed


BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "datasets" / "videos" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


class VideoSourceRequest(BaseModel):
    source: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting CrowdShield Backend...")

    # Use the default source from backend.state.
    state.stop_tracking = False
    start_tracking()

    yield

    print("🛑 Backend shutting down...")
    state.stop_tracking = True


app = FastAPI(
    title="CrowdShield AI API",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    return {
        "zones": state.latest_data["zones"],
        "highest_zone": state.latest_data["highest_zone"]
    }


@app.get("/recommendations")
def recommendations():
    return {
        "recommendations": state.latest_data["recommendations"]
    }


@app.get("/bottleneck")
def bottleneck():
    return state.latest_data["bottleneck"]


@app.get("/video_feed")
def stream():
    return video_feed()


@app.post("/set_source")
def set_source(request: VideoSourceRequest):
    source = request.source.strip()

    if not source:
        raise HTTPException(
            status_code=400,
            detail="Video source cannot be empty."
        )

    try:
        restart_tracking(source)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=409, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to switch video source: {exc}"
        )

    return {
        "message": "Video source updated successfully",
        "source": state.current_video_source
    }


@app.post("/upload_video")
async def upload_video(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No video file was provided."
        )

    allowed_extensions = {
        ".mp4", ".avi", ".mov", ".mkv", ".webm", ".mpeg", ".mpg"
    }

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported video format. "
                f"Allowed: {', '.join(sorted(allowed_extensions))}"
            )
        )

    safe_name = f"{uuid.uuid4().hex}{extension}"
    destination = UPLOAD_DIR / safe_name

    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as exc:
        if destination.exists():
            destination.unlink()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save uploaded video: {exc}"
        )
    finally:
        await file.close()

    try:
        restart_tracking(str(destination))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=409, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to start uploaded video: {exc}"
        )

    return {
        "message": "Video uploaded and tracking restarted",
        "source": str(destination),
        "filename": file.filename
    }
