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

latest_frame = None
frame_lock = Lock()

# Active video source.
# Examples:
#   "0"                    -> local webcam 0
#   "1"                    -> local webcam 1
#   "rtsp://..."           -> RTSP/IP camera stream
#   "http://..."           -> HTTP/IP camera stream
#   "/path/to/video.mp4"   -> local video file
current_video_source = "0"

# Set to True to ask the running tracker thread to stop.
stop_tracking = False
