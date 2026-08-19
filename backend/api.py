from contextlib import asynccontextmanager
from pathlib import Path
import shutil
import uuid

import cv2
import numpy as np

from fastapi import (
    FastAPI,
    HTTPException,
    UploadFile,
    File,
)

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import backend.state as state

from backend.tracker_service import (
    start_tracking,
    restart_tracking,
)

from backend.streamer import video_feed


# =====================================================
# PROJECT PATHS
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_DIR = (
    BASE_DIR
    / "datasets"
    / "videos"
    / "uploads"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =====================================================
# REQUEST MODELS
# =====================================================

class VideoSourceRequest(BaseModel):
    source: str


# =====================================================
# APPLICATION LIFESPAN
# =====================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("=" * 60)
    print("🚀 Starting CrowdShield Backend...")
    print("=" * 60)

    # Reset tracker state
    state.stop_tracking = False

    # Reset phone camera state
    state.phone_camera_connected = False

    with state.phone_frame_lock:
        state.phone_frame = None

    # Start tracker
    start_tracking()

    yield

    # Shutdown
    print("=" * 60)
    print("🛑 Backend shutting down...")
    print("=" * 60)

    state.stop_tracking = True

    state.phone_camera_connected = False

    with state.phone_frame_lock:
        state.phone_frame = None


# =====================================================
# FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title="CrowdShield AI API",
    description="AI-powered crowd monitoring and risk analysis backend",
    lifespan=lifespan,
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():

    return {
        "message": "CrowdShield AI Backend Running",
        "status": "online",
    }


# =====================================================
# STATUS
# =====================================================

@app.get("/status")
def status():

    response = state.latest_data.copy()

    response["phone_camera_connected"] = (
        state.phone_camera_connected
    )

    response["video_source"] = (
        state.current_video_source
    )

    return response


# =====================================================
# RISK
# =====================================================

@app.get("/risk")
def risk():

    return {
        "risk": state.latest_data["risk"],
        "people": state.latest_data["people"],
        "highest_zone": state.latest_data["highest_zone"],
    }


# =====================================================
# FLOW
# =====================================================

@app.get("/flow")
def flow():

    return state.latest_data["flow"]


# =====================================================
# ZONES
# =====================================================

@app.get("/zones")
def zones():

    return {
        "zones": state.latest_data["zones"],
        "highest_zone": state.latest_data["highest_zone"],
    }


# =====================================================
# RECOMMENDATIONS
# =====================================================

@app.get("/recommendations")
def recommendations():

    return {
        "recommendations":
            state.latest_data["recommendations"]
    }


# =====================================================
# BOTTLENECK
# =====================================================

@app.get("/bottleneck")
def bottleneck():

    return state.latest_data["bottleneck"]


# =====================================================
# PROCESSED VIDEO STREAM
#
# Phone/browser requests this endpoint to receive
# the AI-processed MJPEG stream.
# =====================================================

@app.get("/video_feed")
def stream():

    return video_feed()


# =====================================================
# PHONE CAMERA FRAME
#
# Phone camera sends JPEG frames here.
#
# PHONE
#   ↓
# POST /phone_frame
#   ↓
# FastAPI
#   ↓
# state.phone_frame
#   ↓
# tracker.py
# =====================================================

@app.post("/phone_frame")
async def phone_frame(
    file: UploadFile = File(...)
):

    try:

        # -------------------------------------------------
        # Read uploaded JPEG
        # -------------------------------------------------

        data = await file.read()

        if not data:

            raise HTTPException(
                status_code=400,
                detail="Empty phone camera frame.",
            )


        # -------------------------------------------------
        # JPEG bytes -> NumPy
        # -------------------------------------------------

        np_array = np.frombuffer(
            data,
            dtype=np.uint8,
        )


        # -------------------------------------------------
        # NumPy -> OpenCV frame
        # -------------------------------------------------

        frame = cv2.imdecode(
            np_array,
            cv2.IMREAD_COLOR,
        )


        if frame is None:

            raise HTTPException(
                status_code=400,
                detail="Invalid JPEG frame.",
            )


        # -------------------------------------------------
        # Switch tracker to phone mode
        # -------------------------------------------------

        current_source = (
            str(
                state.current_video_source
            )
            .strip()
            .lower()
        )


        if current_source != "phone":

            print(
                "📱 Switching tracker to phone camera..."
            )

            restart_tracking("phone")


        # -------------------------------------------------
        # Store latest phone frame
        # -------------------------------------------------

        with state.phone_frame_lock:

            state.phone_frame = frame


        state.phone_camera_connected = True


        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        return {
            "status": "ok",
            "message": "Phone frame received",
        }


    except HTTPException:

        raise


    except Exception as exc:

        print(
            f"❌ Phone frame error: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to process phone frame: "
                f"{exc}"
            ),
        )


# =====================================================
# CHANGE VIDEO SOURCE
#
# Examples:
#
# "0"       -> laptop webcam
# "1"       -> second webcam
# "phone"   -> mobile camera
# "rtsp..." -> network camera
# "video"   -> recorded video
# =====================================================

@app.post("/set_source")
def set_source(
    request: VideoSourceRequest
):

    source = request.source.strip()


    if not source:

        raise HTTPException(
            status_code=400,
            detail="Video source cannot be empty.",
        )


    try:

        restart_tracking(
            source
        )


    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


    except RuntimeError as exc:

        raise HTTPException(
            status_code=409,
            detail=str(exc),
        )


    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to switch video source: "
                f"{exc}"
            ),
        )


    return {

        "message":
            "Video source updated successfully",

        "source":
            state.current_video_source,

    }


# =====================================================
# UPLOAD VIDEO
# =====================================================

@app.post("/upload_video")
async def upload_video(
    file: UploadFile = File(...)
):

    # -------------------------------------------------
    # Validate filename
    # -------------------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No video file was provided.",
        )


    # -------------------------------------------------
    # Allowed formats
    # -------------------------------------------------

    allowed_extensions = {
        ".mp4",
        ".avi",
        ".mov",
        ".mkv",
        ".webm",
        ".mpeg",
        ".mpg",
    }


    extension = Path(
        file.filename
    ).suffix.lower()


    if extension not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported video format. "
                f"Allowed: "
                f"{', '.join(sorted(allowed_extensions))}"
            ),
        )


    # -------------------------------------------------
    # Create safe filename
    # -------------------------------------------------

    safe_name = (
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )


    destination = (
        UPLOAD_DIR / safe_name
    )


    # -------------------------------------------------
    # Save uploaded file
    # -------------------------------------------------

    try:

        with destination.open("wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )


    except Exception as exc:

        if destination.exists():

            destination.unlink()


        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to save uploaded video: "
                f"{exc}"
            ),
        )


    finally:

        await file.close()


    # -------------------------------------------------
    # Start tracking uploaded video
    # -------------------------------------------------

    try:

        restart_tracking(
            str(destination)
        )


    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


    except RuntimeError as exc:

        raise HTTPException(
            status_code=409,
            detail=str(exc),
        )


    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to start uploaded video: "
                f"{exc}"
            ),
        )


    # -------------------------------------------------
    # Response
    # -------------------------------------------------

    return {

        "message":
            "Video uploaded and tracking restarted",

        "source":
            str(destination),

        "filename":
            file.filename,

    }
