from threading import Lock

latest_data = {
    "people": 0,
    "risk": "LOW",
    "highest_zone": "A",
    "zones": {
        "A": 0,
        "B": 0,
        "C": 0,
        "D": 0,
    },
    "flow": {
        "UP": 0,
        "DOWN": 0,
        "LEFT": 0,
        "RIGHT": 0,
        "STATIONARY": 0,
    },
    "recommendations": [],
    "bottleneck": {
        "bottleneck": False,
        "zone": None,
        "reason": "",
    },
}

# =====================================================
# AI PROCESSED FRAME
# =====================================================

latest_frame = None
frame_lock = Lock()


# =====================================================
# PHONE CAMERA FRAME
# =====================================================

phone_frame = None
phone_frame_lock = Lock()
phone_camera_connected = False


# =====================================================
# ACTIVE VIDEO SOURCE
# =====================================================

# "0"      -> laptop webcam
# "1"      -> second webcam
# "phone"  -> mobile phone camera
# "rtsp://" -> network camera
# video path -> recorded video

current_video_source = "0"


# =====================================================
# TRACKER CONTROL
# =====================================================

stop_tracking = False